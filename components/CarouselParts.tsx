// Shared chrome for the level-design viewers: arrows, counter, caption.
// The caption is aria-live so a slide change is announced without moving focus.
import type { LevelImage } from "@/lib/siteZero";
import { pressable } from "@/lib/ui";

/** Shared pieces for the Level Design carousels (MorphSlider, DepthCarousel, AccordionGallery). */

export const ArrowIcon = ({ dir }: { dir: "prev" | "next" }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Round phosphor arrow button. Always dark-on-image, so it reads in both themes. */
export const arrowBtn = `flex h-11 w-11 items-center justify-center rounded-full border border-[#7fdbae]/60 bg-black/65 text-[#7fdbae] backdrop-blur-sm hover:border-[#7fdbae] hover:bg-[#7fdbae]/20 hover:shadow-[0_0_12px_rgba(127,219,174,0.35)] ${pressable}`;

/** Themed arrow button for use on page surfaces (not over an image). */
export const surfaceArrowBtn = `flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--phosphor)] hover:border-[var(--phosphor)] hover:shadow-[0_0_0_1px_var(--phosphor)] ${pressable}`;

export function ArrowButton({
  dir,
  onClick,
  className = "",
  surface = false,
  label = "image",
}: {
  dir: "prev" | "next";
  onClick: () => void;
  className?: string;
  surface?: boolean;
  label?: string;
}) {
  const prev = dir === "prev";
  return (
    <button
      type="button"
      title={prev ? `Previous ${label} (←)` : `Next ${label} (→)`}
      aria-label={prev ? `Previous ${label}` : `Next ${label}`}
      onClick={(e) => {
        // The arrow sits on top of the slide. Without this, the click
        // falls through and opens the lightbox instead of changing images.
        e.stopPropagation();
        onClick();
      }}
      className={`${surface ? surfaceArrowBtn : arrowBtn} ${className}`}
    >
      <ArrowIcon dir={dir} />
    </button>
  );
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

export function Counter({ index, total, className = "" }: { index: number; total: number; className?: string }) {
  return (
    <span
      className={`pointer-events-none rounded-sm bg-black/65 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-[#e8eaed] ${className}`}
      aria-hidden="true"
    >
      {pad2(index + 1)} / {pad2(total)}
    </span>
  );
}

export function CaptionPanel({
  img,
  eyebrow,
  className = "",
}: {
  img: LevelImage;
  eyebrow: string;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-sm border border-[var(--line)] bg-[var(--surface-strong)]/70 p-3 ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="font-mono text-[10px] tracking-wider text-[var(--text-dim)]">{eyebrow}</div>
      <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[var(--phosphor)]">{img.title}</div>
      <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">{img.caption}</p>
      {img.intent && (
        <p className="mt-2 border-l-2 border-[#d4a24c]/70 pl-2 text-xs leading-relaxed text-[var(--text-muted)]">
          <span className="font-mono text-[9px] tracking-wider text-[#8a5d0f] dark:text-[#d4a24c]">DESIGN INTENT · </span>
          {img.intent}
        </p>
      )}
      {img.credit && <p className="mt-2 font-mono text-[9px] tracking-wider text-[var(--text-dim)]">{img.credit}</p>}
    </div>
  );
}

// Checked at call time. The viewers read this before starting a WebGL
// wipe or a depth/accordion travel, and fall back to a fade.
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
