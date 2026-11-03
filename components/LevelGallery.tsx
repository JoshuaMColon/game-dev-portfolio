"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { fullSrc, thumbSrc, type LevelImage } from "@/lib/siteZero";

type LevelGalleryProps = {
  images: LevelImage[];
  /** Grid layout: "refs" features the first image, "shots" is an even grid, "single" is one wide image. */
  layout?: "refs" | "shots" | "single";
  /** For "shots": use a two-column grid on large screens (good for 2 or 4 images). */
  twoUp?: boolean;
  /** Group name read out in the lightbox, e.g. "Reference library". */
  group: string;
};

const pressable =
  "transition-[transform,border-color,box-shadow] duration-150 ease-out active:scale-[0.97] active:brightness-110";

export default function LevelGallery({ images, layout = "shots", group, twoUp = false }: LevelGalleryProps) {
  const [open, setOpen] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  const gridClass =
    layout === "refs"
      ? "grid grid-cols-2 sm:grid-cols-3 gap-2"
      : layout === "single"
        ? "grid grid-cols-1"
        : `grid grid-cols-1 sm:grid-cols-2 ${twoUp ? "" : "lg:grid-cols-3"} gap-3`;

  return (
    <>
      <ul className={gridClass} role="list">
        {images.map((img, i) => {
          const featured = layout === "refs" && i === 0;
          // Second ref spans two columns so six refs read as 1 / 2+1 / 3 with no orphan.
          const wide = layout === "refs" && i === 1;
          return (
            <li key={img.file} className={`min-w-0 ${featured ? "col-span-full" : wide ? "col-span-2" : ""}`}>
              <button
                type="button"
                title={`Enlarge: ${img.title}`}
                aria-label={`Enlarge image: ${img.title}`}
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setOpen(i);
                }}
                className={`group flex flex-col justify-start w-full h-full text-left rounded-sm border border-[var(--line)] bg-[var(--surface-strong)] overflow-hidden hover:border-[var(--phosphor)] hover:shadow-[0_0_0_1px_var(--phosphor)] ${pressable}`}
              >
                <span
                  className={`relative block w-full overflow-hidden ${
                    layout === "single" ? "" : featured
                        ? "aspect-[3/2] sm:aspect-[21/9]"
                        : wide
                          ? "aspect-video sm:aspect-[32/9]"
                          : "aspect-video"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP, no runtime optimization needed */}
                  <img
                    src={layout === "single" ? fullSrc(img) : thumbSrc(img)}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    loading="lazy"
                    decoding="async"
                    className={`${
                      layout === "single" ? "w-full h-auto" : "absolute inset-0 w-full h-full object-cover"
                    } transition-transform duration-300 group-hover:scale-[1.03]`}
                  />
                  <span className="pointer-events-none absolute right-1.5 top-1.5 rounded-sm bg-black/60 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-[#7fdbae] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    ⤢ ENLARGE
                  </span>
                </span>
                <span className="block w-full px-2.5 py-2">
                  <span className="block font-mono text-[10px] tracking-wider text-[var(--phosphor)] uppercase">
                    {img.title}
                  </span>
                  {(layout !== "refs" || featured) && (
                    <span className="mt-1 block text-xs leading-snug text-[var(--text-muted)]">{img.caption}</span>
                  )}
                  {layout === "refs" && img.credit && (
                    <span className="mt-1 block font-mono text-[9px] tracking-wider text-[var(--text-dim)]">{img.credit}</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {open !== null &&
        typeof document !== "undefined" &&
        createPortal(
          <Lightbox
            images={images}
            index={open}
            group={group}
            onIndex={setOpen}
            onClose={() => {
              setOpen(null);
              lastTrigger.current?.focus();
            }}
          />,
          document.body
        )}
    </>
  );
}

type LightboxProps = {
  images: LevelImage[];
  index: number;
  group: string;
  onIndex: (i: number) => void;
  onClose: () => void;
};

function Lightbox({ images, index, group, onIndex, onClose }: LightboxProps) {
  const img = images[index];
  const many = images.length > 1;
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (step: number) => onIndex((index + step + images.length) % images.length),
    [index, images.length, onIndex],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" && many) go(1);
      else if (e.key === "ArrowLeft" && many) go(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, many, onClose]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  const navBtn = `flex h-11 w-11 items-center justify-center rounded-full border border-[#7fdbae]/50 bg-black/60 text-[#7fdbae] hover:bg-[#7fdbae]/15 hover:border-[#7fdbae] ${pressable}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${group}: ${img.title}`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start || !many) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          e.preventDefault();
          go(dx < 0 ? 1 : -1);
        }
      }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 font-mono text-[11px] tracking-wider text-[#8b92a0]">
        <span className="truncate">
          <span className="text-[#7fdbae]">{group.toUpperCase()}</span>
          {many && (
            <span>
              {" "}
              · {index + 1}/{images.length}
            </span>
          )}
        </span>
        <button
          ref={closeRef}
          type="button"
          title="Close (Esc)"
          aria-label="Close image viewer"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className={navBtn}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP */}
        <img
          key={img.file}
          src={fullSrc(img)}
          alt={img.alt}
          width={img.width}
          height={img.height}
          className="max-h-full max-w-full h-auto w-auto object-contain rounded-sm border border-[#2e3540] shadow-2xl"
        />
        {many && (
          <>
            <button
              type="button"
              title="Previous image (←)"
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              className={`${navBtn} absolute left-2 top-1/2 -translate-y-1/2 hidden sm:flex`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              title="Next image (→)"
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              className={`${navBtn} absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 pb-5 pt-3 text-center" onClick={(e) => e.stopPropagation()}>
        <div className="font-display text-base font-bold text-[#e8eaed]">{img.title}</div>
        <p className="mt-1 text-sm leading-relaxed text-[#8b92a0]">{img.caption}</p>
        {img.credit && <p className="mt-1 font-mono text-[10px] tracking-wider text-[#5c6472]">{img.credit}</p>}
        {many && (
          <div className="mt-3 flex items-center justify-center gap-3 sm:hidden">
            <button type="button" title="Previous image" aria-label="Previous image" onClick={() => go(-1)} className={navBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="font-mono text-[10px] text-[#5c6472]">SWIPE OR TAP OUTSIDE TO CLOSE</span>
            <button type="button" title="Next image" aria-label="Next image" onClick={() => go(1)} className={navBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
