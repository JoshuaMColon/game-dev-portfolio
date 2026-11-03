"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Lightbox } from "@/components/LevelGallery";
import { iterations } from "@/lib/iterations";
import { thumbSrc } from "@/lib/siteZero";
import { pressable } from "@/lib/ui";

export default function IterationLog() {
  const [open, setOpen] = useState<number | null>(null);
  const last = useRef<HTMLButtonElement | null>(null);
  const images = iterations.map((it) => it.image);

  return (
    <>
      <ol className="relative space-y-3 border-l border-[var(--line)] pl-5" aria-label="Blockout iterations, oldest first">
        {iterations.map((it, i) => (
          <li key={it.version} className="relative">
            <span
              className={`absolute -left-[26px] top-3 h-2.5 w-2.5 rounded-full border-2 ${
                i === iterations.length - 1
                  ? "border-[var(--phosphor)] bg-[var(--phosphor)]"
                  : "border-[var(--phosphor)] bg-[var(--surface)]"
              }`}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-3 rounded-sm border border-[var(--line)] bg-[var(--surface-strong)]/60 p-3 sm:flex-row sm:items-start">
              <button
                type="button"
                title={`Enlarge: ${it.image.title}`}
                aria-label={`Enlarge image: ${it.image.title}`}
                onClick={(e) => {
                  last.current = e.currentTarget;
                  setOpen(i);
                }}
                className={`group relative block aspect-video w-full shrink-0 overflow-hidden rounded-sm border border-[var(--line)] hover:border-[var(--phosphor)] sm:w-44 ${pressable}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP */}
                <img
                  src={thumbSrc(it.image)}
                  alt={it.image.alt}
                  width={640}
                  height={360}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                />
              </button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2 font-mono text-[10px] tracking-wider">
                  <span className="text-[var(--phosphor)]">{it.version.toUpperCase()}</span>
                  <span className="text-[var(--text-dim)]">{it.date.toUpperCase()}</span>
                  {i === iterations.length - 1 && <span className="text-[#8a5d0f] dark:text-[#d4a24c]">SHOWN ON THIS PAGE</span>}
                </div>
                <div className="mt-0.5 font-display text-sm font-bold text-[var(--text-primary)]">{it.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{it.summary}</p>
              </div>
            </div>
          </li>
        ))}
        <li className="relative">
          <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full border-2 border-dashed border-[#d4a24c] bg-[var(--surface)] animate-pulse-dot" aria-hidden="true" />
          <p className="font-mono text-[10px] leading-relaxed tracking-wider text-[var(--text-muted)]">
            <span className="text-[#8a5d0f] dark:text-[#d4a24c]">NEXT · v11–v13 IN PROGRESS</span> · Later passes already
            exist in the editor, including weapon pickup and arena combat work. Captures will be added once they are reviewed.
          </p>
        </li>
      </ol>
      {open !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <Lightbox
            images={images}
            index={open}
            group="Iteration log"
            onIndex={setOpen}
            onClose={() => {
              setOpen(null);
              last.current?.focus();
            }}
          />,
          document.body,
        )}
    </>
  );
}
