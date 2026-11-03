"use client";

import { useState } from "react";
import { fullSrc, floorPlan } from "@/lib/siteZero";
import {
  PLAN_H,
  PLAN_W,
  anomalies,
  arenaPath,
  bossMarkers,
  criticalPath,
  enemyPositions,
  exitPath,
  optionalRoutes,
  pickups,
  sealedExits,
  sightlines,
  toPct,
  toPlan,
  zoneLabels,
} from "@/lib/sitePlan";
import { pressable } from "@/lib/ui";

type LayerId = "path" | "routes" | "sight" | "enc" | "pickups" | "sealed";

const LAYERS: { id: LayerId; label: string; hint: string; swatch: React.ReactNode }[] = [
  {
    id: "path",
    label: "Critical path",
    hint: "The required route from the lift arrival to the freight lift out",
    swatch: <span className="block h-[3px] w-5 rounded bg-[#f2f4f3] dark:bg-white" />,
  },
  {
    id: "routes",
    label: "Optional routes",
    hint: "Flanks F1–F3 and the optional Sector L wing",
    swatch: <span className="block h-0 w-5 border-t-[3px] border-dashed border-[#38bdf8]" />,
  },
  {
    id: "sight",
    label: "Sightlines",
    hint: "Eye-height lines raycast against the blockout geometry: solid = clear, crossed = blocked",
    swatch: <span className="block h-0 w-5 border-t-2 border-dotted border-[#f472b6]" />,
  },
  {
    id: "enc",
    label: "Encounters",
    hint: "Placeholder enemy positions, the boss arena triggers and scripted anomaly events",
    swatch: <span className="block h-2.5 w-2.5 rotate-45 bg-[#ef4444]" />,
  },
  {
    id: "pickups",
    label: "Pickups",
    hint: "Gear, ammo, med-kit and lore pickups",
    swatch: <span className="block h-2.5 w-2.5 rounded-full bg-[#d4a24c]" />,
  },
  {
    id: "sealed",
    label: "Sealed exits",
    hint: "Exits that are visibly sealed so the player reads them as closed",
    swatch: <span className="block h-2.5 w-2.5 border-2 border-[#ef4444] bg-transparent" />,
  },
];

const pts = (p: [number, number][]) => p.map(([x, y]) => toPlan(x, y).join(",")).join(" ");

export default function AnnotatedPlan() {
  const [on, setOn] = useState<Record<LayerId, boolean>>({
    path: true,
    routes: true,
    sight: true,
    enc: true,
    pickups: true,
    sealed: true,
  });
  const toggle = (id: LayerId) => setOn((s) => ({ ...s, [id]: !s[id] }));

  return (
    <figure className="m-0">
      <div className="mb-3 flex flex-wrap gap-1.5" role="group" aria-label="Plan layers">
        {LAYERS.map((l) => (
          <button
            key={l.id}
            type="button"
            aria-pressed={on[l.id]}
            title={`${on[l.id] ? "Hide" : "Show"} ${l.label.toLowerCase()}: ${l.hint}`}
            onClick={() => toggle(l.id)}
            className={`flex min-h-[36px] items-center gap-2 rounded-sm border px-2.5 py-1.5 font-mono text-[10px] tracking-wider uppercase ${pressable} ${
              on[l.id]
                ? "border-[var(--phosphor)]/60 bg-[var(--surface-strong)] text-[var(--text-primary)]"
                : "border-[var(--line)] bg-transparent text-[var(--text-dim)] line-through decoration-1"
            } hover:border-[var(--phosphor)]`}
          >
            <span className={`flex w-5 items-center justify-center ${on[l.id] ? "" : "opacity-40"}`} aria-hidden="true">
              {l.swatch}
            </span>
            {l.label}
          </button>
        ))}
      </div>

      <p className="mb-1.5 font-mono text-[9px] tracking-wider text-[var(--text-dim)] md:hidden" aria-hidden="true">
        SWIPE SIDEWAYS TO PAN THE PLAN →
      </p>
      <div
        className="overflow-x-auto rounded-sm border border-[var(--line)] bg-[#0b0f0f]"
        tabIndex={0}
        aria-label="Annotated top-down plan of the Proving Grounds. Scroll sideways on small screens."
      >
        <div className="relative min-w-[880px]">
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized static WebP */}
          <img
            src={fullSrc(floorPlan)}
            alt={floorPlan.alt}
            width={floorPlan.width}
            height={floorPlan.height}
            loading="lazy"
            decoding="async"
            className="block h-auto w-full select-none"
            draggable={false}
          />
          <svg
            viewBox={`0 0 ${PLAN_W} ${PLAN_H}`}
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <defs>
              <marker id="ap-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" fill="#f2f4f3" />
              </marker>
              <marker id="ap-arrow-b" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" fill="#38bdf8" />
              </marker>
            </defs>

            {on.sight &&
              sightlines.map((s, i) => {
                const [x1, y1] = toPlan(...s.from);
                const [x2, y2] = toPlan(...s.to);
                const mx = (x1 + x2) / 2;
                const my = (y1 + y2) / 2;
                return (
                  <g key={i}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#f472b6"
                      strokeWidth={2}
                      strokeDasharray={s.clear ? "1 5" : "6 6"}
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      opacity={s.clear ? 0.95 : 0.6}
                    />
                    <circle cx={x1} cy={y1} r={45} fill="#f472b6" />
                    {!s.clear && (
                      <path
                        d={`M${mx - 70} ${my - 70} L${mx + 70} ${my + 70} M${mx + 70} ${my - 70} L${mx - 70} ${my + 70}`}
                        stroke="#f472b6"
                        strokeWidth={2.5}
                        vectorEffect="non-scaling-stroke"
                      />
                    )}
                  </g>
                );
              })}

            {on.routes &&
              optionalRoutes.map((r) => (
                <polyline
                  key={r.id}
                  points={pts(r.points)}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  strokeDasharray="8 6"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  markerEnd="url(#ap-arrow-b)"
                />
              ))}

            {on.path && (
              <g fill="none" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke">
                <polyline points={pts(criticalPath)} stroke="#000" strokeOpacity={0.5} strokeWidth={7} vectorEffect="non-scaling-stroke" />
                <polyline points={pts(criticalPath)} stroke="#f2f4f3" strokeWidth={3.5} vectorEffect="non-scaling-stroke" />
                <polyline points={pts(arenaPath)} stroke="#f2f4f3" strokeWidth={3} strokeDasharray="4 7" vectorEffect="non-scaling-stroke" />
                <polyline points={pts(exitPath)} stroke="#000" strokeOpacity={0.5} strokeWidth={7} vectorEffect="non-scaling-stroke" />
                <polyline points={pts(exitPath)} stroke="#f2f4f3" strokeWidth={3.5} vectorEffect="non-scaling-stroke" markerEnd="url(#ap-arrow)" />
              </g>
            )}

            {on.sealed &&
              sealedExits.map((m) => {
                const [x, y] = toPlan(...m.at);
                return (
                  <g key={m.label}>
                    <rect x={x - 85} y={y - 85} width={170} height={170} fill="#0b0f0f" stroke="#ef4444" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
                    <path d={`M${x - 50} ${y - 50} L${x + 50} ${y + 50} M${x + 50} ${y - 50} L${x - 50} ${y + 50}`} stroke="#ef4444" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                  </g>
                );
              })}

            {on.pickups &&
              pickups.map((m) => {
                const [x, y] = toPlan(...m.at);
                return <circle key={m.label} cx={x} cy={y} r={62} fill="#d4a24c" stroke="#0b0f0f" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />;
              })}

            {on.enc && (
              <g>
                {enemyPositions.map((m, i) => {
                  const [x, y] = toPlan(...m.at);
                  return (
                    <rect
                      key={i}
                      x={x - 55}
                      y={y - 55}
                      width={110}
                      height={110}
                      transform={`rotate(45 ${x} ${y})`}
                      fill={m.upper ? "#0b0f0f" : "#ef4444"}
                      stroke="#ef4444"
                      strokeWidth={2.5}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
                {bossMarkers.map((m) => {
                  const [x, y] = toPlan(...m.at);
                  return (
                    <circle key={m.label} cx={x} cy={y} r={110} fill="none" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
                  );
                })}
                {anomalies.map((m) => {
                  const [x, y] = toPlan(...m.at);
                  return (
                    <path
                      key={m.label}
                      d={`M${x} ${y - 110} L${x + 100} ${y + 75} L${x - 100} ${y + 75} Z`}
                      fill="#c084fc"
                      stroke="#0b0f0f"
                      strokeWidth={1.5}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </g>
            )}

            {on.path && (
              <g>
                {[toPlan(-1170, 0)].map(([x, y]) => (
                  <circle key="start" cx={x} cy={y} r={120} fill="#7fdbae" stroke="#0b0f0f" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                ))}
                {[toPlan(12990, 0)].map(([x, y]) => (
                  <rect key="end" x={x - 120} y={y - 120} width={240} height={240} fill="#7fdbae" stroke="#0b0f0f" strokeWidth={2} vectorEffect="non-scaling-stroke" />
                ))}
              </g>
            )}
          </svg>

          {/* HTML labels stay crisp at any zoom */}
          <div className="pointer-events-none absolute inset-0 font-mono text-[9px] tracking-wider">
            {zoneLabels.map((z) => (
              <span
                key={z.label}
                style={toPct(...z.at)}
                className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[2px] bg-[#0b0f0f]/85 px-1 text-[#9fe8c4]"
              >
                {z.label}
              </span>
            ))}
            {on.routes &&
              optionalRoutes.map((r) => {
                const [x, y] = r.points[Math.floor(r.points.length / 2)];
                const pos = r.id === "F2" ? { x: 2830, y: 1050 } : r.id === "SL" ? { x: 6890, y: 1250 } : r.id === "F1" ? { x: 1300, y: -820 } : { x: 5150, y: -1000 };
                return (
                  <span
                    key={r.id}
                    style={toPct(pos.x ?? x, pos.y ?? y)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[2px] bg-[#0b0f0f]/85 px-1 text-[#7dd3fc]"
                  >
                    {r.label}
                  </span>
                );
              })}
            {on.path && (
              <>
                <span style={toPct(-1500, -330)} className="absolute -translate-y-1/2 whitespace-nowrap rounded-[2px] bg-[#0b0f0f]/85 px-1 text-[#f2f4f3]">
                  START · LIFT
                </span>
                <span style={toPct(13330, -330)} className="absolute -translate-x-full -translate-y-1/2 whitespace-nowrap rounded-[2px] bg-[#0b0f0f]/85 px-1 text-[#f2f4f3]">
                  EXIT → SURFACE
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <figcaption className="mt-3 grid gap-x-6 gap-y-1.5 font-mono text-[10px] tracking-wider text-[var(--text-muted)] sm:grid-cols-2 lg:grid-cols-3">
        <span className="flex items-center gap-2">
          <span className="block h-[3px] w-5 rounded bg-[var(--text-primary)]" aria-hidden="true" />
          CRITICAL PATH (DASHED = FREE MOVEMENT IN ARENA)
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-0 w-5 border-t-[3px] border-dashed border-[#38bdf8]" aria-hidden="true" />
          OPTIONAL ROUTES F1 · F2 · F3 · SECTOR L
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-0 w-5 border-t-2 border-dotted border-[#f472b6]" aria-hidden="true" />
          SIGHTLINE, RAYCAST CLEAR (✕ = BLOCKED)
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-2.5 w-2.5 rotate-45 bg-[#ef4444]" aria-hidden="true" />
          PLACEHOLDER ENEMY POSITION (HOLLOW = MEZZANINE)
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-2.5 w-2.5 rounded-full border-2 border-dashed border-[#ef4444]" aria-hidden="true" />
          BOSS SEAL TRIGGER · SPAWN POINT
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-0 w-0 border-x-[5px] border-b-[9px] border-x-transparent border-b-[#c084fc]" aria-hidden="true" />
          SCRIPTED ANOMALY EVENT
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-2.5 w-2.5 rounded-full bg-[#d4a24c]" aria-hidden="true" />
          PICKUP
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-2.5 w-2.5 border-2 border-[#ef4444]" aria-hidden="true" />
          SEALED EXIT
        </span>
        <span className="flex items-center gap-2">
          <span className="block h-2.5 w-5 bg-[#7fdbae]" aria-hidden="true" />
          WALLS · <span className="inline-block h-2.5 w-2.5 bg-[#2e4040] border border-[#46625e]" aria-hidden="true" /> COVER ·{" "}
          <span className="inline-block h-2.5 w-2.5 bg-[#d4a24c]" aria-hidden="true" /> DOORS
        </span>
      </figcaption>

      <details className="mt-4 rounded-sm border border-[var(--line)] bg-[var(--surface-strong)]/60 px-3 py-2 text-sm text-[var(--text-muted)]">
        <summary
          className={`cursor-pointer select-none font-mono text-[10px] tracking-wider text-[var(--phosphor)] ${pressable}`}
          title="Show the plan's routes, sightline checks and sealed exits as text"
        >
          PLAN NOTES · ROUTES, SIGHTLINE CHECKS, SEALED EXITS
        </summary>
        <div className="mt-2 grid gap-4 sm:grid-cols-3">
          <div>
            <div className="mb-1 font-mono text-[10px] tracking-wider text-[var(--text-dim)]">OPTIONAL ROUTES</div>
            <ul className="space-y-1 text-xs leading-snug">
              {optionalRoutes.map((r) => (
                <li key={r.id}>
                  <span className="font-mono text-[var(--text-primary)]">{r.label}</span> · {r.note}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-1 font-mono text-[10px] tracking-wider text-[var(--text-dim)]">SIGHTLINES (EYE HEIGHT)</div>
            <ul className="space-y-1 text-xs leading-snug">
              {sightlines.map((s) => (
                <li key={s.label}>
                  <span className={`font-mono ${s.clear ? "text-[var(--phosphor)]" : "text-[#b45309] dark:text-[#f59e0b]"}`}>
                    {s.clear ? "CLEAR" : "BLOCKED"}
                  </span>{" "}
                  · {s.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-1 font-mono text-[10px] tracking-wider text-[var(--text-dim)]">SEALED EXITS</div>
            <ul className="space-y-1 text-xs leading-snug">
              {sealedExits.map((m) => (
                <li key={m.label}>{m.label}</li>
              ))}
            </ul>
          </div>
        </div>
      </details>
    </figure>
  );
}
