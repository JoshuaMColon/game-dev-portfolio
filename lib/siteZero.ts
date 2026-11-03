// Site Zero level-design media. Images live in /public/level-design/site-zero
// (web-sized WebP, plus a -thumb.webp for grids).

export type LevelImage = {
  file: string; // base name, without extension
  title: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
  credit?: string;
};

const BASE = "/level-design/site-zero";
export const fullSrc = (img: LevelImage) => `${BASE}/${img.file}.webp`;
export const thumbSrc = (img: LevelImage) => `${BASE}/${img.file}-thumb.webp`;

export const referenceImages: LevelImage[] = [
  {
    file: "ref-surface-entrance",
    title: "Surface entrance",
    caption:
      "Concept for the surface level: a secure blast door cut into the hillside, guardhouse, vehicle checkpoint, freight elevator, vent shaft and surveillance tower. The key reference for the exterior map.",
    alt: "Illustrated concept of a hillside facility entrance with a blast door, guardhouse, vehicle checkpoint and surveillance tower among pine trees",
    width: 1536,
    height: 1024,
    credit: "AI-generated concept reference",
  },
  {
    file: "ref-door-201",
    title: "Door 201 target look",
    caption:
      "Target mood for the main entrance: a concrete bunker facade, the \"Proving Grounds – Site 0\" bulk door and a guard booth overlooking the forecourt.",
    alt: "Rendered concrete bunker entrance with a large metal door labeled Proving Grounds Site 0, Door 201, and a guard booth above",
    width: 1024,
    height: 559,
  },
  {
    file: "ref-exterior-blueprint-sheet",
    title: "Exterior blueprint sheet",
    caption:
      "North and west elevations plus an isometric overview of the entrance, used to work out the facade, perimeter and approach before greyboxing.",
    alt: "Blueprint-style sheet showing north and west elevations and an isometric overview of a fortified facility entrance",
    width: 1024,
    height: 559,
  },
  {
    file: "ref-b1-administration",
    title: "B1 · Administration",
    caption:
      "Main lobby, security center, records archive, armory, freight elevator and emergency access shaft. Informs Zone A and its side rooms.",
    alt: "Isometric blueprint of an administration floor with a main lobby, security center, records archive and armory",
    width: 1536,
    height: 1024,
    credit: "AI-generated concept reference",
  },
  {
    file: "ref-b2-research-wing",
    title: "B2 · Research wing",
    caption:
      "Observation theater, labs, medical bay and specimen storage off a main corridor. Informs Zone C's close-quarters labs and mezzanine.",
    alt: "Isometric blueprint of a research wing with an observation theater, labs, medical bay and specimen storage",
    width: 1536,
    height: 1024,
    credit: "AI-generated concept reference",
  },
  {
    file: "ref-b3-containment-wing",
    title: "B3 · Containment wing",
    caption:
      "Containment chambers, observation rooms and a high-security vault around the main containment corridor, the mood target for the deepest part of the facility.",
    alt: "Isometric blueprint of a containment wing with containment cells, observation rooms and a high-security vault",
    width: 1536,
    height: 1024,
    credit: "AI-generated concept reference",
  },
];

export const floorPlan: LevelImage = {
  file: "plan-proving-grounds",
  title: "Proving Grounds · top-down plan",
  caption:
    "Plan view generated from the v10 blockout geometry. Walls in green, props and cover in grey, doors, lifts and stairs in amber. The route runs west to east.",
  alt: "Top-down blockout plan of the Proving Grounds map showing Zone A, the Armory, Zone B, Zone C, Sector L to the north and the octagonal Zone D arena",
  width: 1600,
  height: 411,
};

export type BlockoutGroup = {
  id: string;
  label: string;
  summary: string;
  images: LevelImage[];
};

const shot = (
  file: string,
  title: string,
  caption: string,
  alt: string,
): LevelImage => ({ file, title, caption, alt, width: 1600, height: 900 });

export const blockoutGroups: BlockoutGroup[] = [
  {
    id: "surface",
    label: "Surface · L_SiteZero_Exterior",
    summary:
      "The player starts on the forecourt facing Door 201, then passes through a security checkpoint to the descent lift.",
    images: [
      {
        file: "bo-landscape-heightmap",
        title: "Terrain pass",
        caption: "Heightmap landscape blocking in the hill the facility is built into.",
        alt: "Unreal Engine viewport of a sculpted heightmap landscape with a grid overlay",
        width: 913,
        height: 891,
      },
      {
        file: "bo-facade-first-pass",
        title: "Facade first pass",
        caption: "Early greybox of the Door 201 facade, checked against the mannequin for scale.",
        alt: "Grey blockout of a building facade with a recessed doorway, with the Unreal mannequin in the foreground",
        width: 1600,
        height: 836,
      },
      shot(
        "bo-e1-ext-forecourt",
        "Forecourt",
        "Open forecourt with scattered cover, lamp posts and the perimeter beyond.",
        "Greybox exterior forecourt with low cover blocks, lamp posts and a perimeter wall under a blue sky",
      ),
      shot(
        "bo-e2-ext-serviceyard",
        "Service yard",
        "The fenced service yard on the south side, where the return freight lift from Zone D comes up.",
        "Greybox service yard with tall walls, a pillar and a raised ledge",
      ),
      shot(
        "bo-e3-ext-vestibule",
        "Vestibule",
        "A narrow, warm-lit vestibule that tightens the space before the checkpoint.",
        "Narrow greybox corridor with warm lighting leading toward a red-lit doorway",
      ),
      shot(
        "bo-e4-ext-passage-hallfront",
        "Security checkpoint",
        "Red-lit security checkpoint between Door 201 and the Zone A lift.",
        "Red-lit greybox security checkpoint with a turnstile barrier and a sign reading Security Checkpoint",
      ),
    ],
  },
  {
    id: "facility",
    label: "Facility · L_ProvingGrounds",
    summary:
      "Below ground the route runs zone by zone: Zone A lobby, the Armory, the Zone B cover hall, the Zone C research wing with Sector L to the north, then the Zone D arena.",
    images: [
      shot(
        "bo-a1-zonea-lobby",
        "Zone A · Lobby",
        "Lobby and check-in hall at the bottom of the freight elevator.",
        "Greybox lobby with check-in counters, partition walls and a red accent ceiling",
      ),
      shot(
        "bo-a2-zonea-archive",
        "Zone A · Records archive",
        "Records archive with rows of shelving off the lobby.",
        "Greybox archive room with rows of tall shelving blocks under a ceiling light",
      ),
      shot(
        "bo-b1-zoneb-hall",
        "Zone B · Cover hall",
        "Combat space built from varied-height cover, with lit doorways marking the ways out.",
        "Greybox hall filled with cover blocks of different heights, lit by green door lights and ceiling strips",
      ),
      shot(
        "bo-c1-zonec-atrium",
        "Zone C · Atrium",
        "Atrium stairs up to the mezzanine in the research wing.",
        "Greybox atrium with a staircase rising to an upper level and a green-lit doorway",
      ),
      shot(
        "bo-c2-zonec-medicalbay",
        "Zone C · Medical bay",
        "Medical bay C2-101, one of the close-quarters labs.",
        "Greybox medical bay labeled C2-101 with bed blocks, a partition and a fire extinguisher",
      ),
      shot(
        "bo-l1-sectorl-spine",
        "Sector L · Spine corridor",
        "The Sector L spine corridor, with numbered rooms off both sides.",
        "Long greybox corridor with numbered doors on both sides and yellow-striped door frames",
      ),
      shot(
        "bo-l2-sectorl-security",
        "Sector L · Security office",
        "Security office L1-101, with filing cabinets and scattered papers.",
        "Greybox security office labeled L1-101 with filing cabinets, a window and papers on the floor",
      ),
      shot(
        "bo-m1-maincorridor",
        "Main corridor",
        "Main corridor with hazard-striped door frames and stairs at the far end.",
        "Purple-lit greybox corridor with hazard-striped door frames leading to a stairwell",
      ),
      shot(
        "bo-m2-checkpoint",
        "Checkpoint",
        "Interior checkpoint by exit EX-101.",
        "Greybox checkpoint room with yellow door frames, cabinets and a sign reading EX-101",
      ),
    ],
  },
  {
    id: "route",
    label: "Routes & encounter",
    summary:
      "Optional routes give the player a choice of approach, and the critical path ends in the Zone D boss arena.",
    images: [
      shot(
        "bo-x1-f2-flankwest-closed",
        "Flank route · closed",
        "Maintenance door in the Zone B north wall, the start of the F2 flanking route.",
        "Green-lit greybox maintenance door, closed, with a push bar and yellow kick plate",
      ),
      shot(
        "bo-x2-f2-flankwest-open",
        "Flank route · open",
        "The same door open, showing the maintenance corridor behind it.",
        "Green-lit greybox maintenance door standing open onto a corridor",
      ),
      shot(
        "bo-x3-f2-flankcorridor-inside",
        "Flank corridor",
        "Inside the flanking corridor, with a supply cache along the wall.",
        "Warm-lit narrow greybox corridor with a small lit supply crate and a green door at the far end",
      ),
      shot(
        "bo-d2-zoned-arena-inside",
        "Zone D · Boss arena",
        "Octagonal boss arena built around a central containment pit and dais.",
        "Dark blue-lit octagonal arena with a raised circular dais and a glowing object at its center",
      ),
    ],
  },
];
