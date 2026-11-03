import LevelDesignCard from "@/components/LevelDesignCard";
import LevelGallery from "@/components/LevelGallery";
import StatusTag from "@/components/StatusTag";
import { blockoutGroups, floorPlan, referenceImages } from "@/lib/siteZero";

export const metadata = {
  title: "Level Design — Joshua Colon",
  description:
    "Site Zero: an SCP-inspired facility level in Unreal Engine 5, from reference library to playable blockout.",
};

const route = [
  "Forecourt",
  "Door 201",
  "Security checkpoint",
  "Descent lift",
  "Zone A",
  "Armory",
  "Zone B",
  "Zone C",
  "Zone D arena",
  "Return lift",
];

const legend = [
  { label: "Walls", swatch: "bg-[#7fdbae]" },
  { label: "Cover & props", swatch: "bg-[#2e4040] border border-[#46625e]" },
  { label: "Doors, lifts & stairs", swatch: "bg-[#d4a24c]" },
];

export default function LevelDesignPage() {
  const shotCount = blockoutGroups.reduce((n, g) => n + g.images.length, 0);

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="font-mono text-xs tracking-widest text-[var(--phosphor)] mb-3">
        LEVEL DESIGN WORKBENCH
      </div>
      <h1 className="font-display font-bold text-3xl mb-3 text-[var(--text-primary)]">
        Level Design
      </h1>
      <p className="text-[var(--text-muted)] max-w-xl mb-10">
        A visual record of the spaces I study and the playable layouts I build,
        from early reference gathering through intentional player flow.
      </p>

      {/* Level header */}
      <div className="mb-8 rounded-sm border border-[var(--line)] bg-[var(--surface)]/60 p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-dim)]">
            CURRENT LEVEL
          </span>
          <StatusTag status="in-progress" />
          <span
            className="inline-block font-mono text-[10px] tracking-wider px-2 py-0.5 border rounded-sm text-[var(--phosphor)] border-[var(--phosphor)]/40"
            title="Greybox geometry, placeholder lighting and grid materials"
          >
            BLOCKOUT · v10
          </span>
        </div>
        <h2 className="font-display font-bold text-2xl text-[var(--text-primary)] mb-2">
          Site Zero
        </h2>
        <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-3xl">
          An SCP-inspired facility level built in Unreal Engine 5 across two
          maps: a surface entrance dug into a hillside, and the Proving Grounds,
          an underground facility the player fights through zone by zone. It is
          in blockout: the layout, sightlines and pacing are being locked down
          in greybox before any art pass.
        </p>
        <ol
          className="mt-4 flex flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-[10px] tracking-wider text-[var(--text-muted)]"
          aria-label="Critical path through the level"
        >
          {route.map((stop, i) => (
            <li key={stop} className="flex items-center gap-1.5">
              <span className="rounded-sm border border-[var(--line)] bg-[var(--surface-strong)] px-1.5 py-0.5 uppercase">
                {stop}
              </span>
              {i < route.length - 1 && (
                <span aria-hidden="true" className="text-[var(--phosphor)]">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-6">
        <LevelDesignCard
          eyebrow="REFERENCE LIBRARY"
          title="Reference Images"
          description="The references Site Zero is built from: the surface entrance, the Door 201 target look and the facility floor blueprints, gathered before the first greybox and used to plan composition, scale and room types."
        >
          <div className="px-5 pb-5">
            <LevelGallery images={referenceImages} layout="refs" group="Reference library" />
          </div>
        </LevelDesignCard>

        <LevelDesignCard
          eyebrow="DEVELOPED DESIGN · WORK IN PROGRESS"
          title="Blockout"
          description="Site Zero is currently in blockout. Everything below is greybox: engine grid materials, simple meshes and placeholder lighting, built to test the route, cover and readability before art."
        >
          <div className="px-5 pb-5">
            <div className="mb-4 flex flex-wrap items-center gap-3 rounded-sm border border-dashed border-[#d4a24c]/60 bg-[#d4a24c]/10 px-3 py-2 font-mono text-[10px] tracking-wider text-[#8a5d0f] dark:text-[#d4a24c]">
              <span className="inline-block h-2 w-2 rounded-full bg-[#d4a24c] animate-pulse-dot" aria-hidden="true" />
              <span>STATUS: BLOCKOUT IN PROGRESS · LAYOUT AND LIGHTING SUBJECT TO CHANGE</span>
            </div>
            <LevelGallery images={[floorPlan]} layout="single" group="Blockout plan" />
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[10px] tracking-wider text-[var(--text-muted)]" aria-label="Plan legend">
              {legend.map((item) => (
                <li key={item.label} className="flex items-center gap-1.5">
                  <span className={`inline-block h-2.5 w-2.5 rounded-[2px] ${item.swatch}`} aria-hidden="true" />
                  {item.label.toUpperCase()}
                </li>
              ))}
            </ul>
          </div>
        </LevelDesignCard>

        {blockoutGroups.map((groupData) => (
          <section
            key={groupData.id}
            aria-labelledby={`bo-${groupData.id}`}
            className="rounded-sm border border-[var(--line)] bg-[var(--surface)]/60 p-5"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
              <h3
                id={`bo-${groupData.id}`}
                className="font-mono text-[11px] tracking-[0.2em] text-[var(--phosphor)] uppercase"
              >
                {groupData.label}
              </h3>
              <span className="font-mono text-[10px] text-[var(--text-dim)]">
                {groupData.images.length} SHOTS
              </span>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 max-w-3xl">
              {groupData.summary}
            </p>
            <LevelGallery
              images={groupData.images}
              group={groupData.label}
              twoUp={groupData.images.length % 3 !== 0 && groupData.images.length % 2 === 0}
            />
          </section>
        ))}

        <p className="font-mono text-[10px] tracking-wider text-[var(--text-dim)]">
          {shotCount} BLOCKOUT CAPTURES · v10 PASS · CLICK ANY IMAGE TO ENLARGE
        </p>
      </div>
    </section>
  );
}
