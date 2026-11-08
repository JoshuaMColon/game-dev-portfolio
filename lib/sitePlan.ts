// Overlay data for the Proving Grounds plan. Coordinates are Unreal
// centimeters from a geometry probe: +X east along the route, +Y north.
// The base image covers X -1600..13420 and Y -1420..2370.

export const PLAN_BOUNDS = { x0: -1600, x1: 13420, y0: -1420, y1: 2370 };
export const PLAN_W = PLAN_BOUNDS.x1 - PLAN_BOUNDS.x0; // 15020
export const PLAN_H = PLAN_BOUNDS.y1 - PLAN_BOUNDS.y0; // 3790

// SVG y grows downward, so I flip Y against the north edge of the image.
// That keeps north up in the viewBox without baking the flip into the data.
export const toPlan = (x: number, y: number): [number, number] => [x - PLAN_BOUNDS.x0, PLAN_BOUNDS.y1 - y];
/** World XY to % of the plan box, for HTML labels. */
export const toPct = (x: number, y: number) => {
  const [px, py] = toPlan(x, y);
  return { left: `${(px / PLAN_W) * 100}%`, top: `${(py / PLAN_H) * 100}%` };
};

type Pt = [number, number];

export const criticalPath: Pt[] = [
  [-1170, 0], [1000, 0], [1760, 0], [2830, 0], [3900, 0], [5220, 0], [6540, 0], [7070, 0],
];
// Through the arena the player moves freely around the containment cell,
// so this stretch is drawn dashed instead of as a single forced line.
export const arenaPath: Pt[] = [[7070, 0], [7500, 0], [7700, 640], [8310, 760], [8920, 640], [9120, 0], [9570, 0]];
export const exitPath: Pt[] = [[9570, 0], [10385, 0], [11500, 0], [12120, 0], [12990, 0]];

export type Route = { id: string; label: string; points: Pt[]; note: string };
export const optionalRoutes: Route[] = [
  {
    id: "F1",
    label: "F1",
    points: [[2300, -650], [1970, -650], [1680, -650], [1550, -650], [930, -650]],
    note: "Zone B west egress → emergency shaft → one-way door into the Records Archive",
  },
  {
    id: "F2",
    label: "F2",
    points: [[2150, 560], [2150, 890], [3520, 890], [3520, 560]],
    note: "Maintenance corridor behind the Zone B north wall, with an ammo cache",
  },
  {
    id: "F3",
    label: "F3",
    points: [[5400, -500], [5400, -810], [5400, -970]],
    note: "Emergency shelter C-1 off the atrium: med-kit and staff roster",
  },
  {
    id: "SL",
    label: "Sector L",
    points: [[6890, 0], [6890, 890], [6890, 1530], [5400, 1530]],
    note: "Optional Light Containment wing north of the Zone C→D stairs; its west exit is sealed",
  },
];

export type Sightline = { from: Pt; to: Pt; clear: boolean; label: string };
// Raycast against the blockout at eye height (floor + 160 cm). clear
// is a dotted line; a miss gets the cross mark in the overlay.
export const sightlines: Sightline[] = [
  { from: [-830, 0], to: [310, 0], clear: true, label: "Lift doors → lobby and Armory door" },
  { from: [1980, 0], to: [3580, 0], clear: true, label: "Zone B entry → centre enemy position" },
  { from: [1980, 0], to: [3580, -450], clear: true, label: "Zone B entry → south enemy position" },
  { from: [1980, 0], to: [3580, 450], clear: false, label: "Zone B entry → north enemy position, broken by high cover" },
  { from: [4110, 0], to: [6300, 0], clear: true, label: "Zone C centre line across the atrium" },
  { from: [7070, 0], to: [7880, 0], clear: true, label: "Arena door → containment cell door" },
  { from: [9570, 0], to: [11180, 0], clear: true, label: "Arena exit shutter → exit checkpoint" },
];

export type Marker = { at: Pt; label: string; upper?: boolean };
export const enemyPositions: Marker[] = [
  { at: [3580, -450], label: "Zone B" }, { at: [3580, 0], label: "Zone B" }, { at: [3580, 450], label: "Zone B" },
  { at: [3420, 650], label: "Zone B" }, { at: [3420, -650], label: "Zone B" },
  { at: [4440, 650], label: "Zone C" }, { at: [5300, 0], label: "Zone C" }, { at: [5800, -710], label: "Zone C mezzanine", upper: true },
  { at: [6150, 600], label: "Zone C mezzanine", upper: true }, { at: [6150, -560], label: "Zone C" },
  { at: [4700, -550], label: "Zone C" }, { at: [6000, 450], label: "Zone C" },
];
export const bossMarkers: Marker[] = [
  { at: [7360, 0], label: "Seal trigger: arena door closes behind the player" },
  { at: [7990, 0], label: "Anomaly spawn point" },
];
export const anomalies: Marker[] = [
  { at: [4260, 500], label: "Observation theater events" },
  { at: [5560, 1140], label: "SCP-173 cell" },
  { at: [10650, 191], label: "SCP-5007 door" },
];
export const pickups: Marker[] = [
  { at: [1000, 0], label: "Gear pickup (Armory)" },
  { at: [1765, -800], label: "Maintenance log (F1)" },
  { at: [2850, 950], label: "Ammo cache (F2)" },
  { at: [5480, -1060], label: "Med-kit (F3)" },
  { at: [5470, -895], label: "Shelter roster (F3)" },
];
export const sealedExits: Marker[] = [
  { at: [6120, -779], label: "S1 Zone C east lift" },
  { at: [11075, -414], label: "S2 main-corridor lift" },
  { at: [5262, 1545], label: "S3 Sector L west exit" },
  { at: [8310, 1249], label: "S4 Zone D north exit" },
  { at: [8310, -1249], label: "S5 Zone D south exit" },
  { at: [1680, -838], label: "F1 shaft surface hatch" },
];

export const zoneLabels: { at: Pt; label: string }[] = [
  { at: [-300, 1180], label: "ZONE A" },
  { at: [1040, 480], label: "ARMORY" },
  { at: [2830, 1250], label: "ZONE B" },
  { at: [4600, -1250], label: "ZONE C" },
  { at: [6130, 2300], label: "SECTOR L" },
  { at: [9250, -1330], label: "ZONE D · ARENA" },
  { at: [10900, 820], label: "MAIN CORRIDOR" },
  { at: [12650, 420], label: "EXIT LIFT" },
];
