"use client";

/**
 * Iteration log built on React Bits "AccordionGallery" (gsap,
 * https://reactbits.dev): one panel per pass, the active pass expands in
 * colour while the others stay as greyscale strips. Adapted for this site:
 * hover to expand with a mouse, tap to expand on touch, tap/click the open
 * panel for the full-screen lightbox, horizontal on desktop and a vertical
 * stack on phones, arrow keys, titled arrow buttons, counter, caption panel,
 * and an instant layout with a simple fade under reduced motion.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { Lightbox } from "@/components/LevelGallery";
import { ArrowButton, CaptionPanel, pad2, prefersReducedMotion } from "@/components/CarouselParts";
import { fullSrc, thumbSrc, type LevelImage } from "@/lib/siteZero";

type Props = {
  images: LevelImage[];
  /** Short label per panel, e.g. "v4". */
  labels: string[];
  /** Short title per panel, e.g. "First full route". */
  titles: string[];
  name: string;
  group: string;
};

const GAP = 6;
const COLLAPSED_V = 44; // collapsed row height in the phone layout
const TILT = 6;

export default function IterationAccordion({ images, labels, titles, name, group }: Props) {
  const n = images.length;
  const root = useRef<HTMLDivElement | null>(null);
  const panels = useRef<(HTMLButtonElement | null)[]>([]);
  const media = useRef<(HTMLSpanElement | null)[]>([]);
  const titleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const first = useRef(true);
  // Whether the panel was already open when the press began. A tap focuses the
  // panel (which expands it) before click fires, so click must not use `active`.
  const pressedOpen = useRef<boolean | null>(null);
  const [active, setActive] = useState(n - 1);
  const [vertical, setVertical] = useState(false);
  const [hover, setHover] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const mqV = window.matchMedia("(max-width: 639px)");
    const mqH = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      setVertical(mqV.matches);
      setHover(mqH.matches);
    };
    sync();
    mqV.addEventListener("change", sync);
    mqH.addEventListener("change", sync);
    return () => {
      mqV.removeEventListener("change", sync);
      mqH.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Size of the open panel: 16:9 of the width on phones, ~58% of the row on desktop.
  const openV = Math.round((box.w || 320) * (9 / 16));
  const heightV = openV + (n - 1) * (COLLAPSED_V + GAP);
  const openH = Math.max((box.w - GAP * (n - 1)) * 0.58, 160);

  const apply = useCallback(
    (animate: boolean) => {
      const reduce = prefersReducedMotion();
      const dur = animate && !reduce ? 0.6 : 0;
      tl.current?.kill();
      const t = gsap.timeline();
      const usable = (vertical ? heightV : box.w) - GAP * (n - 1);
      const openSize = vertical ? openV : openH;
      const rest = Math.max((usable - openSize) / Math.max(n - 1, 1), 1);
      const grow = openSize / rest;
      panels.current.forEach((p, i) => {
        if (!p) return;
        const on = i === active;
        const rot = vertical || on ? 0 : i < active ? TILT : -TILT;
        t.to(p, { flexGrow: on ? grow : 1, rotateY: rot, duration: dur, ease: "power3.out" }, 0);
        const m = media.current[i];
        if (m) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = on ? 0 : drift * openSize * 0.03;
          t.to(m, { xPercent: -50, yPercent: -50, x: vertical ? 0 : shift, y: vertical ? shift : 0, "--ag-gray": on ? 0 : 1, "--ag-dim": on ? 0 : 0.45, duration: dur, ease: "power3.out" }, 0);
        }
        const tt = titleRefs.current[i];
        if (tt) t.to(tt, { opacity: on ? 1 : 0, x: on ? 0 : -12, duration: on ? dur : dur * 0.6, ease: "power3.out" }, on ? dur * 0.15 : 0);
      });
      if (animate && reduce) {
        const m = media.current[active];
        if (m) t.fromTo(m, { opacity: 0.35 }, { opacity: 1, duration: 0.25, ease: "power1.out" }, 0);
      }
      tl.current = t;
    },
    [active, vertical, box.w, heightV, openV, openH, n],
  );

  useEffect(() => {
    if (!box.w) return;
    apply(!first.current);
    first.current = false;
  }, [apply, box.w]);

  useEffect(() => () => void tl.current?.kill(), []);

  const go = (s: number) => setActive((a) => (a + s + n) % n);

  const onKey = (e: React.KeyboardEvent) => {
    if (open) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(1);
      panels.current[(active + 1) % n]?.focus({ preventScroll: true });
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(-1);
      panels.current[(active - 1 + n) % n]?.focus({ preventScroll: true });
    }
  };

  const img = images[active];
  const mediaStyle: React.CSSProperties = vertical
    ? { width: "100%", height: openV }
    : { width: openH, height: "100%" };

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div
        ref={root}
        role="group"
        aria-roledescription="carousel"
        aria-label={name}
        onKeyDown={onKey}
        className={`flex w-full min-w-0 ${vertical ? "flex-col" : "flex-row [perspective:1400px]"}`}
        style={{ gap: GAP, height: vertical ? heightV : 300 }}
      >
        {images.map((im, i) => {
          const on = i === active;
          return (
            <button
              key={im.file}
              ref={(el) => {
                panels.current[i] = el;
              }}
              type="button"
              title={on ? `Enlarge: ${im.title}` : `${labels[i]} · ${titles[i]}${hover ? "" : " (tap to expand)"}`}
              aria-label={on ? `Enlarge ${labels[i]}: ${titles[i]}` : `Show ${labels[i]}: ${titles[i]}`}
              aria-current={on ? "true" : undefined}
              onMouseEnter={() => hover && setActive(i)}
              onPointerDown={() => (pressedOpen.current = on)}
              onFocus={() => setActive(i)}
              onClick={() => {
                const wasOpen = pressedOpen.current ?? on;
                pressedOpen.current = null;
                if (wasOpen) setOpen(true);
                else setActive(i);
              }}
              className={`group relative block min-h-0 min-w-0 flex-[1_1_0] overflow-hidden rounded-sm border bg-black text-left outline-none [transform-style:preserve-3d] active:brightness-110 focus-visible:shadow-[0_0_0_2px_var(--phosphor)] ${
                on ? "cursor-zoom-in border-[var(--phosphor)]" : "cursor-pointer border-[var(--line)] hover:border-[var(--phosphor)]"
              }`}
              style={{ willChange: "flex-grow, transform" }}
            >
              <span className="absolute inset-0 overflow-hidden">
                <span
                  ref={(el) => {
                    media.current[i] = el;
                  }}
                  className="absolute left-1/2 top-1/2 [filter:grayscale(var(--ag-gray,1))_brightness(calc(1-var(--ag-dim,0.45)))]"
                  style={{ ...mediaStyle, willChange: "transform, filter", transform: "translate(-50%, -50%)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP */}
                  <img
                    src={on || !vertical ? fullSrc(im) : thumbSrc(im)}
                    alt={im.alt}
                    width={im.width}
                    height={im.height}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="block h-full w-full select-none object-cover"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(5,7,10,0.85)_100%)]"
                />
              </span>

              {/* Version chip: always visible so collapsed strips still say what they are. */}
              <span
                aria-hidden="true"
                className={`absolute z-[2] flex items-center gap-2 font-mono text-[10px] tracking-wider ${
                  vertical && !on ? "inset-y-0 left-2.5 right-2.5" : "left-2 top-2"
                }`}
              >
                <span className={`rounded-[2px] px-1.5 py-0.5 ${on ? "bg-[#7fdbae] text-black" : "bg-black/75 text-[#7fdbae]"}`}>{labels[i]}</span>
                {vertical && !on && <span className="truncate text-[#e8eaed]/85">{titles[i].toUpperCase()}</span>}
              </span>

              <span
                aria-hidden="true"
                ref={(el) => {
                  titleRefs.current[i] = el;
                }}
                className="pointer-events-none absolute bottom-3 left-3 right-3 z-[2] flex items-center gap-2.5 opacity-0"
              >
                <span className="h-6 w-[3px] flex-none rounded-[3px] bg-[#7fdbae] shadow-[0_0_12px_rgba(127,219,174,0.6)]" />
                <span className="truncate font-mono text-[12px] uppercase tracking-wider text-[#e8eaed] [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">
                  {titles[i]}
                </span>
                <span className="ml-auto hidden flex-none rounded-sm bg-black/65 px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-[#7fdbae] group-hover:inline group-focus-visible:inline">
                  ⤢ ENLARGE
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex min-w-0 flex-col gap-2">
        <CaptionPanel img={img} eyebrow={`ITERATION · ${active + 1} OF ${n}`} className="flex-1" />
        <div className="flex items-center gap-2">
          <ArrowButton dir="prev" surface label="pass" onClick={() => go(-1)} />
          <ArrowButton dir="next" surface label="pass" onClick={() => go(1)} />
          <span className="ml-auto font-mono text-[10px] tracking-wider text-[var(--text-dim)]" aria-hidden="true">
            {pad2(active + 1)} / {pad2(n)}
          </span>
        </div>
      </div>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <Lightbox
            images={images}
            index={active}
            group={group}
            onIndex={setActive}
            onClose={() => {
              setOpen(false);
              panels.current[active]?.focus({ preventScroll: true });
            }}
          />,
          document.body,
        )}
    </div>
  );
}
