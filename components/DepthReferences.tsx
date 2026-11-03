"use client";

/**
 * Reference library built on React Bits "DepthCarousel" (gsap,
 * https://reactbits.dev): the active reference sits in front and the next ones
 * recede in depth behind it. Adapted for this site: phosphor theme, landscape
 * cards that show the whole image, caption + design-intent panel, counter,
 * titled arrow buttons, swipe/drag, arrow keys, horizontal-only wheel (vertical
 * page scroll is never captured), click the front card to open the lightbox,
 * and a plain fade under reduced motion.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { Lightbox } from "@/components/LevelGallery";
import { ArrowButton, CaptionPanel, Counter, prefersReducedMotion } from "@/components/CarouselParts";
import { fullSrc, type LevelImage } from "@/lib/siteZero";
import { pressable } from "@/lib/ui";

const CARD_W = 480;
const CARD_H = 320;
const DEPTH = 200;
const SPREAD = 70;
const TILT = 18;
const VISIBLE = 3;
const FALLOFF = 0.22;
const BLUR = 3;

const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b);

type Drag = { x: number; y: number; start: number; lastX: number; lastT: number; v: number; moved: boolean; id: number };

export default function DepthReferences({ images, name, group }: { images: LevelImage[]; name: string; group: string }) {
  const n = images.length;
  const root = useRef<HTMLDivElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const shades = useRef<(HTMLSpanElement | null)[]>([]);
  const pos = useRef(0);
  const focus = useRef(0);
  const tween = useRef<gsap.core.Tween | null>(null);
  const scale = useRef(1);
  const drag = useRef<Drag | null>(null);
  const dragged = useRef(false);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduced = useRef(false);
  const [active, setActive] = useState(0);
  const [stageH, setStageH] = useState(CARD_H + 48);
  const [open, setOpen] = useState(false);

  const layout = useCallback(
    (p: number) => {
      const sc = scale.current;
      // Shift the whole stack left so the front card and the cards behind it are centred together.
      const offset = -SPREAD * 0.9;
      for (let i = 0; i < n; i++) {
        const el = cards.current[i];
        if (!el) continue;
        let d = i - p;
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
        const back = Math.max(0, d);
        const shown = Math.abs(d) <= VISIBLE + 0.5;
        const tz = -DEPTH * d;
        const tx = SPREAD * d + offset;
        const ry = TILT * clamp(d, 0, 1);
        let opacity = d < 0 ? Math.max(0, 1 + d) : 1;
        if (!shown) opacity = 0;
        const brightness = Math.max(0.2, 1 - back * FALLOFF);
        const blur = Math.min(BLUR, (back / VISIBLE) * BLUR);
        el.style.transform = `translate(-50%, -50%) scale(${sc}) translateX(${tx.toFixed(2)}px) translateZ(${tz.toFixed(2)}px) rotateY(${ry.toFixed(3)}deg)`;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`;
        el.style.zIndex = String(Math.round(2000 - d * 20));
        el.style.pointerEvents = shown && opacity > 0.05 ? "auto" : "none";
        el.tabIndex = -1;
        const sh = shades.current[i];
        if (sh) sh.style.opacity = clamp(back * FALLOFF * 1.25, 0, 0.8).toFixed(3);
      }
    },
    [n],
  );

  const tweenTo = useCallback(
    (target: number, animate: boolean) => {
      tween.current?.kill();
      const proxy = { p: pos.current };
      const settle = () => {
        pos.current = ((pos.current % n) + n) % n;
        layout(pos.current);
      };
      if (!animate || reduced.current) {
        pos.current = target;
        settle();
        // Reduced motion: no depth travel, just a quick fade on the new front card.
        if (animate && stage.current) gsap.fromTo(stage.current, { opacity: 0.35 }, { opacity: 1, duration: 0.25, ease: "power1.out" });
        return;
      }
      tween.current = gsap.to(proxy, {
        p: target,
        duration: 0.7,
        ease: "power3.out",
        onUpdate: () => {
          pos.current = proxy.p;
          layout(proxy.p);
        },
        onComplete: settle,
      });
    },
    [layout, n],
  );

  const setFocus = useCallback(
    (raw: number, animate = true) => {
      const idx = ((raw % n) + n) % n;
      let delta = ((idx - pos.current) % n + n) % n;
      if (delta > n / 2) delta -= n;
      tweenTo(pos.current + delta, animate);
      focus.current = idx;
      setActive(idx);
    },
    [n, tweenTo],
  );
  const step = useCallback((s: number) => setFocus(focus.current + s), [setFocus]);

  useEffect(() => {
    reduced.current = prefersReducedMotion();
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = e.contentRect.width;
      scale.current = clamp(w / (CARD_W + SPREAD * 2 + 40), 0.5, 1);
      setStageH(Math.round(CARD_H * scale.current + 48));
      layout(pos.current);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout]);

  // Horizontal wheel / trackpad swipes only, so vertical page scrolling is never hijacked.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || open) return;
      e.preventDefault();
      tween.current?.kill();
      pos.current += clamp(e.deltaX / (CARD_W * 0.9), -0.6, 0.6);
      layout(pos.current);
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => setFocus(Math.round(pos.current)), 130);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
    };
  }, [layout, setFocus, open]);

  useEffect(() => () => void tween.current?.kill(), []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (n < 2 || (e.target as HTMLElement).closest("[data-nodrag]")) return;
    tween.current?.kill();
    drag.current = { x: e.clientX, y: e.clientY, start: pos.current, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const stepPx = Math.max(CARD_W * 0.55 * scale.current, 40);
    const dx = e.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(e.clientY - d.y) > Math.abs(dx) && Math.abs(e.clientY - d.y) > 8) {
        drag.current = null; // vertical scroll gesture: let the page scroll
        return;
      }
      if (Math.abs(dx) > 6) {
        d.moved = true;
        root.current?.setPointerCapture(d.id);
      }
    }
    if (!d.moved) return;
    const now = performance.now();
    d.v = (e.clientX - d.lastX) / Math.max(now - d.lastT, 1);
    d.lastX = e.clientX;
    d.lastT = now;
    pos.current = d.start - dx / stepPx;
    layout(pos.current);
  };
  const onPointerEnd = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      // A tap that did not move: let the click handler run, but snap back if a tween was killed.
      setFocus(Math.round(pos.current));
      return;
    }
    dragged.current = true;
    window.setTimeout(() => (dragged.current = false), 0);
    const stepPx = Math.max(CARD_W * 0.55 * scale.current, 40);
    const projected = pos.current - (d.v * 180) / stepPx;
    // One gesture moves at most two cards.
    const target = clamp(Math.round(projected), Math.round(d.start) - 2, Math.round(d.start) + 2);
    setFocus(target);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (open) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setFocus(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setFocus(n - 1);
    } else if ((e.key === "Enter" || e.key === " ") && e.target === e.currentTarget) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const img = images[active];

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_17rem]">
      <div
        ref={root}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${name}. Use the arrow keys to browse and Enter to enlarge.`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        className="relative min-w-0 cursor-grab touch-pan-y select-none overflow-hidden rounded-sm border border-[var(--line)] bg-[radial-gradient(ellipse_at_50%_55%,rgba(127,219,174,0.10),transparent_70%),#07090c] outline-none active:cursor-grabbing focus-visible:ring-1 focus-visible:ring-[var(--phosphor)] focus-visible:ring-offset-4 focus-visible:ring-offset-transparent"
        style={{ height: stageH, perspective: "1400px" }}
      >
        <div ref={stage} className="absolute inset-0 [transform-style:preserve-3d]">
          {images.map((im, i) => (
            <button
              key={im.file}
              ref={(el) => {
                cards.current[i] = el;
              }}
              type="button"
              tabIndex={-1}
              title={i === active ? `Enlarge: ${im.title}` : `Show: ${im.title}`}
              aria-label={i === active ? `Enlarge image ${i + 1} of ${n}: ${im.title}` : `Show image ${i + 1}: ${im.title}`}
              aria-hidden={i !== active}
              onClick={() => {
                if (dragged.current) return;
                if (i === focus.current) setOpen(true);
                else setFocus(i);
              }}
              className="absolute left-1/2 top-1/2 overflow-hidden rounded-[6px] border border-[#7fdbae]/25 bg-black shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75),0_0_0_1px_rgba(0,0,0,0.4)] [transform-origin:center] [will-change:transform,opacity,filter] [transform:translate(-50%,-50%)]"
              style={{ width: CARD_W, height: CARD_H, cursor: i === active ? "zoom-in" : "pointer" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP */}
              <img
                src={fullSrc(im)}
                alt={im.alt}
                width={im.width}
                height={im.height}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="pointer-events-none block h-full w-full select-none object-contain"
              />
              <span
                ref={(el) => {
                  shades.current[i] = el;
                }}
                className="pointer-events-none absolute inset-0 bg-[#05070a] opacity-0"
              />
            </button>
          ))}
        </div>

        {n > 1 && (
          <div data-nodrag>
            <ArrowButton dir="prev" label="reference" onClick={() => step(-1)} className="absolute left-2 top-1/2 z-[3000] -translate-y-1/2" />
            <ArrowButton dir="next" label="reference" onClick={() => step(1)} className="absolute right-2 top-1/2 z-[3000] -translate-y-1/2" />
          </div>
        )}
        <Counter index={active} total={n} className="absolute bottom-2 left-2 z-[3000]" />
        <div data-nodrag className="absolute bottom-1 right-1 z-[3000] flex items-center" role="group" aria-label="Choose a reference">
          {images.map((im, i) => (
            <button
              key={im.file}
              type="button"
              title={`Show: ${im.title}`}
              aria-label={`Show image ${i + 1}: ${im.title}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => setFocus(i)}
              className={`flex h-7 items-center px-[3px] ${pressable}`}
            >
              <span
                className={`block h-[6px] rounded-full transition-[width,background-color] duration-200 ${
                  i === active ? "w-5 bg-[#7fdbae]" : "w-[6px] bg-white/35 hover:bg-white/70"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <CaptionPanel img={img} eyebrow={`REFERENCE · ${active + 1} OF ${n}`} />

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <Lightbox
            images={images}
            index={active}
            group={group}
            onIndex={(i) => setFocus(i, false)}
            onClose={() => {
              setOpen(false);
              root.current?.focus();
            }}
          />,
          document.body,
        )}
    </div>
  );
}
