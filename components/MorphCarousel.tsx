"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Lightbox } from "@/components/LevelGallery";
import dynamic from "next/dynamic";
import type { MorphTransition } from "@/components/MorphStage";

// ogl stays out of the first load. MorphStage is imported only after
// the carousel nears the viewport, and never when reduced motion is on.
const MorphStage = dynamic(() => import("@/components/MorphStage"), { ssr: false });
import { ArrowButton, CaptionPanel, Counter, prefersReducedMotion } from "@/components/CarouselParts";
import { fullSrc, thumbSrc, type LevelImage } from "@/lib/siteZero";
import { pressable } from "@/lib/ui";

export type CarouselGroup = {
  id: string;
  /** Short tab label, e.g. "Surface". */
  tab: string;
  /** Full name read out in the lightbox, e.g. "Surface · L_SiteZero_Exterior". */
  label: string;
  summary?: string;
  images: LevelImage[];
  /** Optional short labels for the thumbnail strip (e.g. "v4"). */
  stripLabels?: string[];
};

type MorphCarouselProps = {
  groups: CarouselGroup[];
  /** Accessible name for the whole carousel. */
  name: string;
  transition?: MorphTransition;
};

/**
 * Blockout captures, one tab per map. The slide is a plain img; the WebGL
 * shear covers it only once MorphStage is ready. I fall back to a fade when
 * WebGL is missing or the visitor prefers reduced motion. Click opens the
 * shared lightbox on this same index.
 */
export default function MorphCarousel({ groups, name, transition = "shear" }: MorphCarouselProps) {
  const uid = useId();
  const [gi, setGi] = useState(0);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(false);
  const [dir, setDir] = useState(1);
  const [gl, setGl] = useState<"off" | "loading" | "ready" | "failed">("off");
  const [pointer, setPointer] = useState<[number, number] | undefined>(undefined);
  const root = useRef<HTMLDivElement | null>(null);
  const strip = useRef<HTMLUListElement | null>(null);
  const slideBtn = useRef<HTMLButtonElement | null>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const group = groups[gi];
  const images = group.images;
  const img = images[index];
  const many = images.length > 1;

  const go = useCallback(
    (step: number) => {
      setDir(step < 0 ? -1 : 1);
      setIndex((i) => (i + step + images.length) % images.length);
    },
    [images.length],
  );
  const goTo = useCallback(
    (i: number) => {
      setDir(i < index ? -1 : 1);
      setIndex(i);
    },
    [index],
  );

  // WebGL only once the carousel is near the viewport, and never for reduced motion.
  useEffect(() => {
    if (seen && gl === "off" && !prefersReducedMotion()) setGl("loading");
  }, [seen, gl]);
  const urls = useMemo(() => images.map(fullSrc), [images]);
  const webgl = gl === "loading" || gl === "ready";

  // Only start preloading neighbours once the carousel has been near the viewport.
  useEffect(() => {
    const el = root.current;
    if (!el || seen) return;
    // 300px of lead so the chunk and the neighbour frames are ready
    // before the carousel actually scrolls into view.
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  useEffect(() => {
    if (!seen || !many) return;
    for (const n of [index + 1, index - 1]) {
      const p = new Image();
      p.src = fullSrc(images[(n + images.length) % images.length]);
    }
  }, [seen, index, images, many]);

  // Keep the active thumbnail visible without scrolling the page.
  useEffect(() => {
    const s = strip.current;
    const active = s?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!s || !active) return;
    const left = active.offsetLeft - (s.clientWidth - active.offsetWidth) / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
  }, [index, gi]);

  const onKey = (e: React.KeyboardEvent) => {
    if (!many || open) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(images.length - 1);
    }
  };

  const panelId = `${uid}-panel`;

  return (
    <div
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label={name}
      tabIndex={0}
      onKeyDown={onKey}
      className="rounded-sm outline-none focus-visible:ring-1 focus-visible:ring-[var(--phosphor)] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
    >
      {groups.length > 1 && (
        <div role="tablist" aria-label={`${name} groups`} className="mb-3 flex flex-wrap gap-1.5">
          {groups.map((g, i) => (
            <button
              key={g.id}
              id={`${uid}-tab-${g.id}`}
              type="button"
              role="tab"
              aria-selected={i === gi}
              aria-controls={panelId}
              title={`Show ${g.label} (${g.images.length} images)`}
              onClick={() => {
                if (i === gi) return;
                setGi(i);
                setIndex(0);
                setDir(1);
                // New group, new textures. Drop back to loading so the
                // previous map's canvas doesn't shear over the new one.
                if (gl === "ready") setGl("loading");
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault();
                  e.stopPropagation();
                  const n = (i + (e.key === "ArrowRight" ? 1 : -1) + groups.length) % groups.length;
                  setGi(n);
                  setIndex(0);
                  setDir(1);
                  if (gl === "ready") setGl("loading");
                  document.getElementById(`${uid}-tab-${groups[n].id}`)?.focus();
                }
              }}
              tabIndex={i === gi ? 0 : -1}
              className={`flex min-h-[36px] items-center gap-2 rounded-sm border px-3 py-1.5 font-mono text-[10px] tracking-wider ${pressable} ${
                i === gi
                  ? "border-[var(--phosphor)] bg-[var(--phosphor)]/15 text-[var(--text-primary)]"
                  : "border-[var(--line)] text-[var(--text-muted)] hover:border-[var(--phosphor)]"
              }`}
            >
              {g.tab.toUpperCase()}
              <span className="text-[var(--text-dim)]">{g.images.length}</span>
            </button>
          ))}
        </div>
      )}

      <div id={panelId} role={groups.length > 1 ? "tabpanel" : undefined} aria-labelledby={groups.length > 1 ? `${uid}-tab-${group.id}` : undefined}>
        {group.summary && (
          <p className="mb-3 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)]">{group.summary}</p>
        )}

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_17rem]">
          {/* Slide */}
          <div
            className="relative overflow-hidden rounded-sm border border-[var(--line)] bg-black touch-pan-y"
            onPointerDown={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setPointer([(e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height]);
            }}
            onTouchStart={(e) => {
              touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }}
            onTouchEnd={(e) => {
              const start = touch.current;
              touch.current = null;
              if (!start || !many) return;
              const dx = e.changedTouches[0].clientX - start.x;
              const dy = e.changedTouches[0].clientY - start.y;
              if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
            }}
          >
            <button
              ref={slideBtn}
              type="button"
              title={`Enlarge: ${img.title}`}
              aria-label={`Enlarge image ${index + 1} of ${images.length}: ${img.title}`}
              onClick={() => setOpen(true)}
              className="group relative block aspect-video w-full cursor-zoom-in"
            >
              {/* The img is the real slide and the fallback. The canvas only
                  covers it once the stage is ready; until then the fade plays here. */}
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP */}
              <img
                key={img.file}
                src={fullSrc(img)}
                alt={img.alt}
                width={img.width}
                height={img.height}
                loading="lazy"
                decoding="async"
                draggable={false}
                className={`absolute inset-0 h-full w-full object-contain ${gl === "ready" ? "" : "animate-[carouselFade_280ms_ease-out] motion-reduce:animate-none"}`}
              />
              {webgl && (
                <span className={`absolute inset-0 transition-opacity duration-300 ${gl === "ready" ? "opacity-100" : "opacity-0"}`}>
                  <MorphStage
                    key={group.id}
                    urls={urls}
                    index={index}
                    dir={dir}
                    transition={transition}
                    pointer={pointer}
                    onReady={() => setGl("ready")}
                    onFail={() => setGl("failed")}
                  />
                </span>
              )}
              <span className="pointer-events-none absolute right-2 top-2 rounded-sm bg-black/65 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-[#7fdbae] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                ⤢ ENLARGE
              </span>
            </button>
            {many && (
              <>
                <ArrowButton dir="prev" onClick={() => go(-1)} className="absolute left-2 top-1/2 -translate-y-1/2" />
                <ArrowButton dir="next" onClick={() => go(1)} className="absolute right-2 top-1/2 -translate-y-1/2" />
              </>
            )}
            <Counter index={index} total={images.length} className="absolute bottom-2 left-2" />
          </div>

          <CaptionPanel img={img} eyebrow={`${group.tab.toUpperCase()} · ${index + 1} OF ${images.length}`} />
        </div>

        {/* Thumbnail strip uses the small WebP. This row is always in the layout,
            so I don't pull a full frame for every capture up front. */}
        {many && (
          <ul
            ref={strip}
            className="mt-2 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]"
            aria-label={`${group.tab} images`}
          >
            {images.map((im, i) => (
              <li key={im.file} className="shrink-0">
                <button
                  type="button"
                  title={`Show: ${im.title}`}
                  aria-label={`Show image ${i + 1}: ${im.title}`}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => goTo(i)}
                  className={`relative block h-12 w-[5.25rem] overflow-hidden rounded-sm border sm:h-14 sm:w-24 ${pressable} ${
                    i === index
                      ? "border-[var(--phosphor)] shadow-[0_0_0_1px_var(--phosphor)]"
                      : "border-[var(--line)] opacity-60 hover:opacity-100 hover:border-[var(--phosphor)]"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP */}
                  <img
                    src={thumbSrc(im)}
                    alt=""
                    width={640}
                    height={360}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {group.stripLabels?.[i] && (
                    <span className="absolute bottom-0.5 left-0.5 rounded-[2px] bg-black/75 px-1 font-mono text-[9px] tracking-wider text-[#7fdbae]">
                      {group.stripLabels[i]}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          // Same lightbox as the grids, on this index, so arrowing inside
          // it moves the carousel underneath and close returns here.
          <Lightbox
            images={images}
            index={index}
            group={group.label}
            onIndex={(i) => {
              setDir(i < index ? -1 : 1);
              setIndex(i);
            }}
            onClose={() => {
              setOpen(false);
              slideBtn.current?.focus();
            }}
          />,
          document.body,
        )}
    </div>
  );
}
