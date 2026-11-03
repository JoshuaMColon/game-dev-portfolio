"use client";

import { useEffect, useRef, useState } from "react";
import { pressable } from "@/lib/ui";

const BASE = "/level-design/site-zero/video";

export const walkthroughStops = [
  "Forecourt",
  "Vestibule",
  "Checkpoint",
  "Zone A lobby",
  "Archive",
  "Zone B hall",
  "F2 flank",
  "Zone C atrium",
  "Medical bay",
  "Sector L",
  "Zone D arena",
  "Main corridor",
  "Exit checkpoint",
  "Service yard",
];

/**
 * Muted, looping route walkthrough. Plays only while on screen, and never
 * autoplays when the visitor prefers reduced motion.
 */
export default function RouteWalkthrough() {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [reduced, setReduced] = useState(false);
  const [playing, setPlaying] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (reduced) {
      v.pause();
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
          if (!userPaused.current) v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: [0, 0.5, 1] },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <figure className="m-0">
      <div className="relative overflow-hidden rounded-sm border border-[var(--line)] bg-black">
        <video
          ref={ref}
          className="block aspect-video h-auto w-full"
          width={1280}
          height={720}
          poster={`${BASE}/walkthrough-poster.webp`}
          muted
          loop
          playsInline
          controls
          preload="metadata"
          title="Site Zero route walkthrough: captured blockout shots in route order, not gameplay"
          aria-label="Route walkthrough of Site Zero built from captured blockout shots, not gameplay footage"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={`${BASE}/walkthrough.webm`} type="video/webm" />
          <source src={`${BASE}/walkthrough.mp4`} type="video/mp4" />
          <track kind="captions" src={`${BASE}/walkthrough.vtt`} srcLang="en" label="Location names" />
        </video>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          type="button"
          onClick={toggle}
          title={playing ? "Pause the walkthrough" : "Play the walkthrough"}
          aria-label={playing ? "Pause the walkthrough" : "Play the walkthrough"}
          className={`flex min-h-[36px] items-center gap-2 rounded-sm border border-[var(--phosphor)]/60 bg-[var(--surface-strong)] px-3 py-1.5 font-mono text-[10px] tracking-wider text-[var(--text-primary)] hover:border-[var(--phosphor)] ${pressable}`}
        >
          <span aria-hidden="true" className="text-[var(--phosphor)]">
            {playing ? "❚❚" : "▶"}
          </span>
          {playing ? "PAUSE" : "PLAY"}
        </button>
        <span className="rounded-sm border border-dashed border-[#d4a24c]/60 bg-[#d4a24c]/10 px-2 py-1 font-mono text-[10px] tracking-wider text-[#8a5d0f] dark:text-[#d4a24c]">
          CAPTURED-SHOT WALKTHROUGH · NOT GAMEPLAY
        </span>
        <span className="font-mono text-[10px] tracking-wider text-[var(--text-dim)]">
          0:39 · MUTED · {reduced ? "AUTOPLAY OFF (REDUCED MOTION)" : "PLAYS WHEN IN VIEW"}
        </span>
      </figcaption>
      <ol
        className="mt-3 flex flex-wrap items-center gap-x-1 gap-y-1.5 font-mono text-[9px] tracking-wider text-[var(--text-muted)]"
        aria-label="Stops in the walkthrough, in route order"
      >
        {walkthroughStops.map((s, i) => (
          <li key={s} className="flex items-center gap-1">
            <span className="uppercase">{s}</span>
            {i < walkthroughStops.length - 1 && (
              <span aria-hidden="true" className="text-[var(--phosphor)]">
                ›
              </span>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}
