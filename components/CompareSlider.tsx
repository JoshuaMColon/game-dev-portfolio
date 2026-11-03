"use client";

import { useCallback, useRef, useState } from "react";
import { pressable } from "@/lib/ui";

type Side = { src: string; alt: string; label: string };

type CompareSliderProps = {
  before: Side;
  after: Side;
  width: number;
  height: number;
  /** Accessible name for the slider, e.g. "Door 201 reference vs blockout". */
  name: string;
};

/** Drag, tap, or use the arrow keys to wipe between two aligned images. */
export default function CompareSlider({ before, after, width, height, name }: CompareSliderProps) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);

  const fromClient = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 2;
    let next: number | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = pos - step;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") next = pos + step;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 100;
    else if (e.key === "PageDown") next = pos - 10;
    else if (e.key === "PageUp") next = pos + 10;
    if (next !== null) {
      e.preventDefault();
      setPos(Math.min(100, Math.max(0, next)));
    }
  };

  const chip = `rounded-sm border px-2 py-1 font-mono text-[10px] tracking-wider ${pressable}`;

  return (
    <figure className="m-0">
      <div
        ref={box}
        className="relative select-none overflow-hidden rounded-sm border border-[var(--line)] bg-black touch-pan-y"
        style={{ aspectRatio: `${width} / ${height}` }}
        onPointerDown={(e) => {
          dragging.current = true;
          (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
          fromClient(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && fromClient(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        title="Drag or tap to compare. Arrow keys move the divider when focused."
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP */}
        <img src={after.src} alt={after.alt} width={width} height={height} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP */}
          <img src={before.src} alt={before.alt} width={width} height={height} loading="lazy" decoding="async" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <span className="pointer-events-none absolute left-2 top-2 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-[#e8eaed]">
          {before.label}
        </span>
        <span className="pointer-events-none absolute right-2 top-2 rounded-sm bg-black/70 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-[#7fdbae]">
          {after.label}
        </span>
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="absolute inset-y-0 -left-px w-0.5 bg-[#7fdbae] shadow-[0_0_8px_rgba(127,219,174,0.8)]" />
        </div>
        <div
          role="slider"
          tabIndex={0}
          aria-label={name}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% ${before.label}`}
          onKeyDown={onKey}
          title="Drag, or use ← → (Shift for bigger steps), to move the divider"
          className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border border-[#7fdbae] bg-black/70 text-[#7fdbae] transition-transform duration-150 active:scale-95"
          style={{ left: `${pos}%` }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <figcaption className="mt-2 flex flex-wrap items-center gap-1.5">
        <button type="button" onClick={() => setPos(100)} title={`Show only: ${before.label}`} className={`${chip} border-[var(--line)] text-[var(--text-muted)] hover:border-[var(--phosphor)]`}>
          {before.label}
        </button>
        <button type="button" onClick={() => setPos(50)} title="Split the view 50 / 50" className={`${chip} border-[var(--line)] text-[var(--text-muted)] hover:border-[var(--phosphor)]`}>
          50 / 50
        </button>
        <button type="button" onClick={() => setPos(0)} title={`Show only: ${after.label}`} className={`${chip} border-[var(--line)] text-[var(--text-muted)] hover:border-[var(--phosphor)]`}>
          {after.label}
        </button>
      </figcaption>
    </figure>
  );
}
