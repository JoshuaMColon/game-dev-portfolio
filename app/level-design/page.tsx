import Link from "next/link";
import AnnotatedPlan from "@/components/AnnotatedPlan";
import CompareSlider from "@/components/CompareSlider";
import IterationLog from "@/components/IterationLog";
import LevelDesignCard from "@/components/LevelDesignCard";
import LevelGallery from "@/components/LevelGallery";
import RouteWalkthrough from "@/components/RouteWalkthrough";
import StatusTag from "@/components/StatusTag";
import { blockoutGroups, referenceImages, type LevelImage } from "@/lib/siteZero";
import { pressable } from "@/lib/ui";

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

const CMP = "/level-design/site-zero";

const zoneAPlanPair: LevelImage[] = [
  {
    file: "ref-b1-administration",
    title: "B1 · Administration reference",
    caption: "The administration floor blueprint: lobby, security center, records archive, armory and emergency shaft.",
    alt: "Isometric blueprint of an administration floor with a main lobby, security center, records archive and armory",
    width: 1536,
    height: 1024,
    credit: "AI-generated concept reference",
  },
  {
    file: "cmp-zonea-plan-v8",
    title: "Zone A · blockout plan (v8)",
    caption: "Top-down capture of the Zone A blockout laid out from that blueprint: a central lobby with the side rooms arranged around it.",
    alt: "Top-down capture of a greybox floor with a central lobby and side rooms, one lit red",
    width: 1600,
    height: 900,
  },
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
        <p className="mt-3 text-sm text-[var(--text-muted)]">
          Site Zero is the level for my third-person shooter{" "}
          <Link
            href="/projects/scp-tps"
            title="Open the SCP_TPS project page"
            className={`inline-block font-mono text-xs tracking-wider text-[var(--phosphor)] underline-offset-4 hover:underline ${pressable}`}
          >
            SCP_TPS →
          </Link>
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
          eyebrow="ROUTE WALKTHROUGH"
          title="The route, start to finish"
          description="A walkthrough of the critical path built from the v10 blockout captures, in the order the player reaches them: surface, Zones A to D with the F2 flank and Sector L detours, then out through the main corridor to the service yard."
        >
          <div className="px-5 pb-5">
            <RouteWalkthrough />
          </div>
        </LevelDesignCard>

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
          eyebrow="REFERENCE → BLOCKOUT"
          title="From reference to greybox"
          description="How the references turned into geometry. The Door 201 capture was framed to match the target render, so the two line up for a direct comparison; the Zone A plan is shown next to the blueprint it was laid out from."
        >
          <div className="space-y-5 px-5 pb-5">
            <div>
              <h3 className="mb-2 font-mono text-[11px] tracking-[0.2em] text-[var(--phosphor)]">DOOR 201 · REFERENCE VS BLOCKOUT</h3>
              <CompareSlider
                name="Door 201: reference render versus blockout capture"
                width={1024}
                height={576}
                before={{
                  src: `${CMP}/cmp-door-201-ref.webp`,
                  alt: "Reference render of a concrete bunker entrance with a large metal door marked Door 201 and a guard booth",
                  label: "REFERENCE",
                }}
                after={{
                  src: `${CMP}/cmp-door-201-v8.webp`,
                  alt: "Greybox blockout of the same entrance, with the door marked 201 under warm lights",
                  label: "BLOCKOUT · v8",
                }}
              />
            </div>
            <div>
              <h3 className="mb-2 font-mono text-[11px] tracking-[0.2em] text-[var(--phosphor)]">ZONE A · BLUEPRINT VS PLAN</h3>
              <LevelGallery images={zoneAPlanPair} group="Reference to blockout" twoUp />
            </div>
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
            <h3 className="mb-2 font-mono text-[11px] tracking-[0.2em] text-[var(--phosphor)]">
              PROVING GROUNDS · ANNOTATED PLAN
            </h3>
            <AnnotatedPlan />
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

        <section
          aria-labelledby="iteration-log"
          className="rounded-sm border border-[var(--line)] bg-[var(--surface)]/60 p-5"
        >
          <h3 id="iteration-log" className="mb-1 font-mono text-[11px] tracking-[0.2em] text-[var(--phosphor)]">
            ITERATION LOG · v4 → v10
          </h3>
          <p className="mb-4 max-w-3xl text-sm leading-relaxed text-[var(--text-muted)]">
            Each pass is scripted, rebuilt and re-captured, so the level moves forward in clear steps.
          </p>
          <IterationLog />
        </section>

        <p className="font-mono text-[10px] tracking-wider text-[var(--text-dim)]">
          {shotCount} BLOCKOUT CAPTURES · v10 PASS · CLICK ANY IMAGE TO ENLARGE
        </p>
      </div>
    </section>
  );
}
