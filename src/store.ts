// src/store.ts
import { create } from "zustand";

/**
 * 全局游戏状态（Zustand）
 * - 保存 scene, player pos, shards collected, unlocked skills
 * - 提供 save/load to server (示例)
 */

type ShardRecord = Record<string, boolean>;

type GameState = {
  scene: number;
  setScene: (s: number) => void;

  px: number;
  py: number;
  setPlayerPos: (x: number, y: number) => void;

  shards: ShardRecord;
  collectShard: (id: string) => void;
  clearShards: () => void;

  unlocked: { doubleJump: boolean; dash: boolean };
  unlock: (k: keyof GameState["unlocked"]) => void;

  saveToServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
};


export const useGameStore = create<GameState>((set, get) => ({
  scene: 1,
  setScene: (s: any) => set({ scene: s }),

  px: 80,
  py: 0,
  setPlayerPos: (x, y) => set({ px: x, py: y }),

  shards: {},
  collectShard: (id) => set((state) => ({ shards: { ...state.shards, [id]: true } })),
  clearShards: () => set({ shards: {} }),

  unlocked: { doubleJump: false, dash: false },
  unlock: (k) => set((state) => ({ unlocked: { ...state.unlocked, [k]: true } })),

  saveToServer: async () => {
    const st = get();
    const payload = {
      scene: st.scene,
      shards: st.shards,
      unlocked: st.unlocked,
      pos: { x: st.px, y: st.py },
    };
    try {
      const res = await fetch("/api/save-progress", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("server save failed");
      console.log("Saved to server");
    } catch (err) {
      console.warn("save failed, fallback to localStorage", err);
      localStorage.setItem("yj_save", JSON.stringify(payload));
    }
  },

  loadFromServer: async () => {
    try {
      const res = await fetch("/api/load-progress");
      if (!res.ok) throw new Error("no server load");
      const data = await res.json();
      set({
        scene: data.scene ?? 1,
        shards: data.shards ?? {},
        unlocked: data.unlocked ?? { doubleJump: false, dash: false },
        px: data.pos?.x ?? 80,
        py: data.pos?.y ?? 0,
      });
      console.log("Loaded from server");
    } catch (err) {
      const raw = localStorage.getItem("yj_save");
      if (raw) {
        const data = JSON.parse(raw);
        set({
          scene: data.scene ?? 1,
          shards: data.shards ?? {},
          unlocked: data.unlocked ?? { doubleJump: false, dash: false },
          px: data.pos?.x ?? 80,
          py: data.pos?.y ?? 0,
        });
        console.log("Loaded from localStorage");
      } else {
        console.warn("No save found");
      }
    }
  },
}));
