import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";

type Platform = { x: number; y: number; w: number; h: number };

const CANVAS_W = 900;
const CANVAS_H = 520;
const PLAYER_W = 38;
const PLAYER_H = 56;

export default function Game(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 玩家物理状态
  const playerRef = useRef({
    x: 100,
    y: 0,
    vx: 0,
    vy: 0,
    facing: 1 as 1 | -1,
    canDoubleJump: true,
    usedDoubleJump: false,
  });

  // 精灵图
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const [frame, setFrame] = useState(0);
  const frameTimer = useRef(0);

  // UI 对话
  const [dialogue, setDialogue] = useState<string | null>(null);
  const dialogueRef = useRef<string | null>(null);

  // 残像计数（保留）
  const [, setShardsCollected] = useState<number>(0);

  // 输入状态
  const keysRef = useRef<Record<string, boolean>>({});
  const jumpKeyWasDown = useRef(false);

  // 跳跃容错
  const coyoteTimer = useRef(0);
  const jumpBufferTimer = useRef(0);

  // 交互（E 键）
  const eHoldTime = useRef(0);
  const eHoldThreshold = 0.35;
  const dialogHideTimeout = useRef<number | null>(null);
  const isNearNpcRef = useRef(false);

  // 物理参数
  const GRAVITY = 2000;
  const MAX_FALL_SPEED = 1200;
  const MOVE_ACCEL = 3000;
  const GROUND_FRICTION = 2400;
  const MAX_MOVE_SPEED = 220;
  const JUMP_VELOCITY = -880;
  const COYOTE_TIME = 0.12;
  const JUMP_BUFFER_TIME = 0.14;
  const SHORT_HOP_MULT = 0.5;

  // 平台
  const platformsRef = useRef<Platform[]>([
    { x: 0, y: 440, w: 900, h: 80 },
    { x: 220, y: 340, w: 140, h: 16 },
    { x: 420, y: 260, w: 160, h: 16 },
    { x: 640, y: 200, w: 120, h: 16 },
  ]);

  // 残像
  const shardsRef = useRef<{ x: number; y: number; id: string }[]>([
    { x: 260, y: 300, id: "s_room" },
    { x: 470, y: 220, id: "s_ruin1" },
  ]);
  const collectedRef = useRef<Record<string, boolean>>({});

  // NPC 区域
  const npcZone = { x: 730, y: 384, w: 40, h: 56 };

  // 工具
  const rectsOverlap = (
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    bx: number,
    by: number,
    bw: number,
    bh: number
  ) => !(ax + aw <= bx || ax >= bx + bw || ay + ah <= by || ay >= by + bh);

  // 键盘监听
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = (e.key || "").toLowerCase();
      keysRef.current[key] = true;
      if (e.code) keysRef.current[e.code] = true;
      if (e.code === "Space") e.preventDefault();
      if (
        (key === "e" || e.code === "KeyE") &&
        isNearNpcRef.current &&
        !dialogueRef.current
      ) {
        triggerNpcDialogue();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      const key = (e.key || "").toLowerCase();
      keysRef.current[key] = false;
      if (e.code) keysRef.current[e.code] = false;
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // 主循环
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 载入精灵
    const sprite = new Image();
    sprite.src = "/assets/hero_sprite.png"; // 放到 public/assets
    spriteRef.current = sprite;

    const initialPlatform = platformsRef.current[0];
    playerRef.current.y = initialPlatform.y - PLAYER_H;
    playerRef.current.x = 80;

    let last = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.02);
      last = now;
      update(dt);
      render(ctx, dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  function triggerNpcDialogue() {
    const text =
      "（镇长霍姆）你是… 余烬之民？太好了！镇外的虚无正在逼近。若不尽快找到北边遗迹里的‘先驱者之视’，安全屋的屏障撑不过三天。";
    setDialogue(text);
    dialogueRef.current = text;
    if (dialogHideTimeout.current) {
      clearTimeout(dialogHideTimeout.current);
      dialogHideTimeout.current = null;
    }
  }

  function update(dt: number) {
    const keys = keysRef.current;
    const p = playerRef.current;

    // 移动
    const left = keys["a"] || keys["arrowleft"];
    const right = keys["d"] || keys["arrowright"];
    if (left && !right) {
      p.vx -= MOVE_ACCEL * dt;
      p.facing = -1;
    } else if (right && !left) {
      p.vx += MOVE_ACCEL * dt;
      p.facing = 1;
    } else {
      if (p.vx > 0) p.vx = Math.max(0, p.vx - GROUND_FRICTION * dt);
      else if (p.vx < 0) p.vx = Math.min(0, p.vx + GROUND_FRICTION * dt);
    }
    if (p.vx > MAX_MOVE_SPEED) p.vx = MAX_MOVE_SPEED;
    if (p.vx < -MAX_MOVE_SPEED) p.vx = -MAX_MOVE_SPEED;

    // 重力
    p.vy += GRAVITY * dt;
    if (p.vy > MAX_FALL_SPEED) p.vy = MAX_FALL_SPEED;

    // 跳跃
    const onGroundNow = isOnGround(p.x, p.y + 1);
    if (onGroundNow) {
      coyoteTimer.current = COYOTE_TIME;
      p.usedDoubleJump = false;
    } else coyoteTimer.current = Math.max(0, coyoteTimer.current - dt);

    const jumpPressed =
      keys["w"] || keys["arrowup"] || keys[" "] || keys["Space"];
    if (jumpPressed && !jumpKeyWasDown.current) {
      jumpBufferTimer.current = JUMP_BUFFER_TIME;
    }
    jumpKeyWasDown.current = !!jumpPressed;

    if (jumpBufferTimer.current > 0) {
      if (onGroundNow || coyoteTimer.current > 0) {
        p.vy = JUMP_VELOCITY;
        jumpBufferTimer.current = 0;
        coyoteTimer.current = 0;
      } else if (p.canDoubleJump && !p.usedDoubleJump && !onGroundNow) {
        p.vy = JUMP_VELOCITY * 0.9;
        p.usedDoubleJump = true;
        jumpBufferTimer.current = 0;
      }
    }
    if (p.vy < 0 && !jumpPressed) p.vy *= SHORT_HOP_MULT;

    // 水平碰撞
    let nextX = p.x + p.vx * dt;
    const bboxX = { x: nextX, y: p.y, w: PLAYER_W, h: PLAYER_H };
    for (const plat of platformsRef.current) {
      if (
        rectsOverlap(
          bboxX.x,
          bboxX.y,
          bboxX.w,
          bboxX.h,
          plat.x,
          plat.y,
          plat.w,
          plat.h
        )
      ) {
        if (p.vx > 0) nextX = plat.x - PLAYER_W - 0.01;
        else if (p.vx < 0) nextX = plat.x + plat.w + 0.01;
        p.vx = 0;
      }
    }
    p.x = clamp(nextX, 0, CANVAS_W - PLAYER_W);

    // 垂直碰撞
    let nextY = p.y + p.vy * dt;
    const bboxY = { x: p.x, y: nextY, w: PLAYER_W, h: PLAYER_H };
    for (const plat of platformsRef.current) {
      if (
        rectsOverlap(
          bboxY.x,
          bboxY.y,
          bboxY.w,
          bboxY.h,
          plat.x,
          plat.y,
          plat.w,
          plat.h
        )
      ) {
        if (p.vy > 0) {
          nextY = plat.y - PLAYER_H;
          p.vy = 0;
        } else if (p.vy < 0) {
          nextY = plat.y + plat.h + 0.01;
          p.vy = 0;
        }
      }
    }
    p.y = clamp(nextY, -2000, CANVAS_H - PLAYER_H);

    // 残像拾取
    for (const s of shardsRef.current) {
      if (!collectedRef.current[s.id]) {
        const cpx = p.x + PLAYER_W / 2;
        const cpy = p.y + PLAYER_H / 2;
        const dist = Math.hypot(cpx - s.x, cpy - s.y);
        if (dist < 36) {
          collectedRef.current[s.id] = true;
          setShardsCollected(Object.keys(collectedRef.current).length);
        }
      }
    }

    // NPC 检测
    const near = rectsOverlap(
      p.x,
      p.y,
      PLAYER_W,
      PLAYER_H,
      npcZone.x - 16,
      npcZone.y - 16,
      npcZone.w + 32,
      npcZone.h + 32
    );
    isNearNpcRef.current = near;

    const eHeld = keys["e"] || keys["KeyE"];
    if (near && eHeld && !dialogueRef.current) {
      eHoldTime.current += dt;
      if (eHoldTime.current >= eHoldThreshold) triggerNpcDialogue();
    } else {
      if (eHoldTime.current > 0) eHoldTime.current = 0;
      if (dialogueRef.current && !eHeld) {
        if (dialogHideTimeout.current) clearTimeout(dialogHideTimeout.current);
        dialogHideTimeout.current = window.setTimeout(() => {
          setDialogue(null);
          dialogueRef.current = null;
          dialogHideTimeout.current = null;
        }, 2000);
      }
    }
  }

  function isOnGround(px: number, py: number): boolean {
    for (const plat of platformsRef.current) {
      const feetY = py + PLAYER_H;
      const withinX =
        px + PLAYER_W > plat.x + 2 && px < plat.x + plat.w - 2;
      const touching = feetY >= plat.y - 2 && feetY <= plat.y + 6;
      if (withinX && touching) return true;
    }
    return false;
  }

  function render(ctx: CanvasRenderingContext2D, dt: number) {
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // 背景
    const g = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
    g.addColorStop(0, "#02030a");
    g.addColorStop(1, "#071018");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // 平台
    for (const plat of platformsRef.current) {
      ctx.fillStyle = "#2c2f33";
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
    }

    // 残像
    for (const s of shardsRef.current) {
      if (!collectedRef.current[s.id]) {
        ctx.beginPath();
        ctx.fillStyle = "cyan";
        ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // NPC
    ctx.fillStyle = "#7f2d2d";
    ctx.fillRect(npcZone.x, npcZone.y, npcZone.w, npcZone.h);
    ctx.fillStyle = "#fff";
    ctx.fillText("镇长", npcZone.x - 6, npcZone.y - 6);

    // 玩家绘制（精灵动画）
    const p = playerRef.current;
    const sprite = spriteRef.current;
    if (sprite && sprite.complete) {
      const spriteSize = 64;
      const row = p.facing === 1 ? 0 : 1;
      if (Math.abs(p.vx) > 10) {
        frameTimer.current += dt;
        if (frameTimer.current > 0.15) {
          setFrame((f) => (f + 1) % 4);
          frameTimer.current = 0;
        }
      } else {
        setFrame(0);
      }
      ctx.drawImage(
        sprite,
        frame * spriteSize,
        row * spriteSize,
        spriteSize,
        spriteSize,
        p.x,
        p.y,
        PLAYER_W,
        PLAYER_H
      );
    } else {
      ctx.fillStyle = "teal";
      ctx.fillRect(p.x, p.y, PLAYER_W, PLAYER_H);
    }

    // HUD
    ctx.fillStyle = "#fff";
    ctx.fillText(
      `残像: ${Object.keys(collectedRef.current).length} / ${shardsRef.current.length}`,
      20,
      24
    );

    if (isNearNpcRef.current && !dialogueRef.current) {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(npcZone.x - 40, npcZone.y - 48, 140, 28);
      ctx.fillStyle = "#ffd";
      ctx.fillText("按住 [E] 与镇长对话", npcZone.x - 34, npcZone.y - 30);
    }

    if (dialogue) {
      ctx.fillStyle = "rgba(0,0,0,0.82)";
      ctx.fillRect(100, CANVAS_H - 120, 700, 80);
      ctx.fillStyle = "#0ff";
      wrapText(ctx, dialogue, 120, CANVAS_H - 92, 660, 18);
    }
  }

  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) {
    const words = text.split(" ");
    let line = "";
    let curY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + " ";
        curY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }

  function clamp(v: number, a: number, b: number) {
    return Math.max(a, Math.min(b, v));
  }

  return (
    <div style={{ textAlign: "center", padding: 12, position: "relative" }}>
      <h2 style={{ color: "#0ff" }}>余烬征途 — 新手教程</h2>
      <canvas
        ref={canvasRef}
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ border: "2px solid #0ff", borderRadius: 8 }}
      />
      <p style={{ color: "#ccc" }}>
        A/D 或 ←/→ 移动 | W/↑/Space 跳跃 | 靠近镇长显示提示，按住 E 触发（单击 E 也可）
      </p>
    </div>
  );
}
