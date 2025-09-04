// src/components/AudioManager.tsx
import{ useEffect, useRef } from "react";

const audioList: Record<string, { src: string; loop?: boolean; volume?: number }> = {
  heartbeat: { src: "/audio/heartbeat.mp3", loop: true, volume: 0.5 },
  ambient: { src: "/audio/ambient_wind.mp3", loop: true, volume: 0.45 },
  strings: { src: "/audio/strings_low.mp3", loop: true, volume: 0.5 },
  starfire: { src: "/audio/starfire.wav", loop: false, volume: 0.9 },
  absorb: { src: "/audio/absorb.wav", loop: false, volume: 0.9 },
};

export default function AudioManager() {
  const mapRef = useRef<Record<string, HTMLAudioElement>>({});

  useEffect(() => {
    const map: Record<string, HTMLAudioElement> = {};
    Object.entries(audioList).forEach(([k, v]) => {
      try {
        const a = new Audio(v.src);
        a.loop = !!v.loop;
        a.volume = v.volume ?? 1.0;
        a.preload = "auto";
        map[k] = a;
      } catch (err) {
        console.warn("Audio load failed:", k, v.src);
      }
    });
    mapRef.current = map;

    (window as any).audioPlay = (k: string) => {
      const a = mapRef.current[k];
      if (!a) return;
      a.play().catch(() => {});
    };
    (window as any).audioStop = (k: string) => {
      const a = mapRef.current[k];
      if (!a) return;
      a.pause();
      a.currentTime = 0;
    };

    return () => {
      Object.values(mapRef.current).forEach(a => { a.pause(); });
      (window as any).audioPlay = undefined;
      (window as any).audioStop = undefined;
    };
  }, []);

  return null;
}
