import type { LevelImage } from "@/lib/siteZero";

export type Iteration = {
  version: string;
  date: string; // capture date, America/New_York
  title: string;
  summary: string;
  image: LevelImage;
};

const img = (file: string, title: string, caption: string, alt: string): LevelImage => ({
  file,
  title,
  caption,
  alt,
  width: 1600,
  height: 900,
});

// Dates come from the capture timestamps of each pass's shot set.
export const iterations: Iteration[] = [
  {
    version: "v4",
    date: "Nov 1",
    title: "First full route",
    summary: "Every zone blocked in end to end: Zone A lobby, the Zone B cover hall, the Zone C range, the Zone D arena and the exterior.",
    image: img("iter-v4", "v4 · Zone B cover hall", "v4 capture: the first Zone B cover layout, seen from the entry.", "Flat-lit grey blockout hall with scattered cover blocks of different heights"),
  },
  {
    version: "v5",
    date: "Nov 1",
    title: "Arena mood",
    summary: "Zone D lighting and fog passes for the arena, plus a geometry leak check in Zone B.",
    image: img("iter-v5", "v5 · Zone D arena", "v5 capture: the arena with red accent lighting and fog.", "Dark arena blockout with tall pillars and red accent lights"),
  },
  {
    version: "v7",
    date: "Nov 2",
    title: "Zone C rebuilt",
    summary: "Zone C rebuilt around an atrium with stairs, catwalks and a mezzanine, a security office and server records. The exterior gained the bulk door and return lift.",
    image: img("iter-v7", "v7 · Zone C from the mezzanine", "v7 capture: the rebuilt Zone C atrium from the mezzanine.", "Blockout atrium seen from above with a staircase, catwalks and a red-lit room"),
  },
  {
    version: "v8",
    date: "Nov 3",
    title: "Door 201 and Sector L",
    summary: "Door 201 front matched against its reference, a sentry post and forest trail on the surface, the Sector L wing, and the first top-down plans.",
    image: img("iter-v8", "v8 · Door 201 front", "v8 capture: the Door 201 facade, framed to match the reference render.", "Greybox bunker entrance with a large door marked 201 under warm lights"),
  },
  {
    version: "v9",
    date: "Nov 3",
    title: "Checkpoint and anomalies",
    summary: "A scripted security checkpoint (gate red, scanner amber, lift green) and the first anomaly events: levitating debris, SCP-173 and the SCP-5007 door.",
    image: img("iter-v9", "v9 · Checkpoint open", "v9 capture: the checkpoint gate open and lit green, with the Zone A lift beyond.", "Green-lit security checkpoint with turnstiles and a Zone A Lift sign"),
  },
  {
    version: "v10",
    date: "Nov 3",
    title: "Routes, exits and detail",
    summary: "Flank routes F1–F3, six clearly sealed exits and a detail pass across both maps.",
    image: img("iter-v10", "v10 · F2 flank corridor", "v10 capture: inside the F2 flank corridor, with the ammo cache.", "Warm-lit narrow corridor with a small lit supply crate"),
  },
];
