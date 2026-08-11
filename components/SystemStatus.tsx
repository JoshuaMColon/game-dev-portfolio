type Signal = "active" | "building" | "planned";

const SIGNAL_STYLES: Record<
  Signal,
  { dot: string; label: string; text: string }
> = {
  active: {
    dot: "bg-[var(--phosphor)] animate-pulse-dot",
    label: "ACTIVE",
    text: "text-[var(--phosphor)]",
  },
  building: {
    dot: "bg-amber animate-pulse-dot",
    label: "BUILDING",
    text: "text-amber",
  },
  planned: {
    dot: "bg-[var(--text-dim)]",
    label: "PLANNED",
    text: "text-[var(--text-dim)]",
  },
};

const CATEGORIES: { name: string; signal: Signal; note: string }[] = [
  {
    name: "AI & Behavior",
    signal: "active",
    note: "Behavior Tree · Perception",
  },
  {
    name: "Gameplay Systems",
    signal: "building",
    note: "Inventory · Save/Load",
  },
  { name: "Tools & UI", signal: "building", note: "UMG · HUD" },
  { name: "VFX & Rendering", signal: "planned", note: "Niagara · Materials" },
];

export default function SystemStatus() {
  return (
    <section
      aria-label="Current build status by system"
      className="border-y border-[var(--line)]/80 bg-[color:rgba(255,255,255,0.03)]"
    >
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="font-mono text-xs text-[var(--text-dim)] mb-4 tracking-wider">
          SYSTEM STATUS LOG
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const style = SIGNAL_STYLES[cat.signal];
            return (
              <div key={cat.name} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`inline-block w-1.5 h-1.5 rounded-full ${style.dot}`}
                  />
                  <span className="font-mono text-[11px] tracking-wider text-[var(--text-muted)]">
                    {cat.name.toUpperCase()}
                  </span>
                </div>
                <span className={`font-mono text-[11px] ${style.text}`}>
                  {style.label}
                </span>
                <span className="font-mono text-[11px] text-[var(--text-dim)]">
                  {cat.note}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
