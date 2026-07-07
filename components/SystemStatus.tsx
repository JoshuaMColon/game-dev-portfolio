type Signal = "active" | "building" | "planned";

const SIGNAL_STYLES: Record<Signal, { dot: string; label: string; text: string }> = {
  active: { dot: "bg-phosphor animate-pulse-dot", label: "ACTIVE", text: "text-phosphor" },
  building: { dot: "bg-amber animate-pulse-dot", label: "BUILDING", text: "text-amber" },
  planned: { dot: "bg-ink-dim", label: "PLANNED", text: "text-ink-dim" },
};

const CATEGORIES: { name: string; signal: Signal; note: string }[] = [
  { name: "AI & Behavior", signal: "active", note: "Behavior Tree · Perception" },
  { name: "Gameplay Systems", signal: "building", note: "Inventory · Save/Load" },
  { name: "Tools & UI", signal: "building", note: "UMG · HUD" },
  { name: "VFX & Rendering", signal: "planned", note: "Niagara · Materials" },
];

export default function SystemStatus() {
  return (
    <section aria-label="Current build status by system" className="border-y border-line/60">
      <div className="max-w-5xl mx-auto px-6 py-6">
        <div className="font-mono text-xs text-ink-dim mb-4 tracking-wider">
          SYSTEM_STATUS.LOG
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
                  <span className="font-mono text-[11px] tracking-wider text-ink-muted">
                    {cat.name.toUpperCase()}
                  </span>
                </div>
                <span className={`font-mono text-[11px] ${style.text}`}>{style.label}</span>
                <span className="font-mono text-[11px] text-ink-dim">{cat.note}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
