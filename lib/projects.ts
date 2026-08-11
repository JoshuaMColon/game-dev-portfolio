export type ProjectStatus = "flagship" | "in-progress" | "planned" | "complete";

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  status: ProjectStatus;
  engine: string;
  language: string[];
  systems: string[];
  description: string;
  whatIdImprove?: string;
  videoUrl?: string; // YouTube embed URL, add once you have a capture
  githubUrl?: string;
  itchUrl?: string;
  featured?: boolean;
};

// Edit this file as each project moves forward.
// status: "flagship" | "in-progress" | "planned" | "complete"
export const projects: Project[] = [
  {
    slug: "scp-tps",
    title: "SCP_TPS",
    oneLiner:
      "Third-person vertical slice — a patrolling AI threat, niagara built hazard effect, and a full core gameplay loop.",
    status: "in-progress",
    engine: "Unreal Engine 5",
    language: ["C++", "Blueprint"],
    systems: ["AI Behavior Tree", "Niagara VFX", "Player Controller", "UI/HUD"],
    description:
      "A third-person vertical slice built around a single enemy encounter. The enemy uses a Behavior Tree driven patrol/detect/chase/attack loop, paired with a custom Niagara system as both a visual signature and an environmental hazard. Version-controlled with Git + Git LFS through the UE5 Git Beta plugin.",
    githubUrl: "https://github.com/JoshuaMColon",
    featured: true,
  },
  {
    slug: "ai-combat-system",
    title: "AI Combat System",
    oneLiner:
      "A single enemy archetype with a full C++-driven behavior tree: patrol, investigate, chase, attack, flee.",
    status: "in-progress",
    engine: "Unreal Engine 5",
    language: ["C++"],
    systems: ["Behavior Tree", "Blackboard", "State Machine", "Perception"],
    description:
      "Core decision logic for an AI enemy written in C++ against UE5's Behavior Tree and Blackboard framework, rather than left entirely in Blueprint. Covers patrol, player detection via AI Perception, chase, attack, and a low-health flee state.",
    githubUrl: "https://github.com/JoshuaMColon",
  },
  {
    slug: "inventory-system",
    title: "Inventory & Interaction System",
    oneLiner:
      "Pickup, equip, and use items through a UMG hotbar UI, persisted across level transitions.",
    status: "planned",
    engine: "Unreal Engine 5",
    language: ["C++", "Blueprint"],
    systems: ["UMG UI", "Component Architecture", "Level Persistence"],
    description:
      "An item pickup and equip system with a drag/drop-capable UMG hotbar, built as a reusable actor component so it can be dropped into other projects. State persists across level transitions.",
    githubUrl: "https://github.com/JoshuaMColon",
  },
  {
    slug: "save-load-system",
    title: "Save / Load System",
    oneLiner:
      "Serializes player state and world state — which enemies are down, which items are gone — across sessions.",
    status: "planned",
    engine: "Unreal Engine 5",
    language: ["C++"],
    systems: ["Save Game Serialization", "World State Tracking"],
    description:
      "A save/load system covering player stats and inventory as well as world state — enemy defeats and item pickups persist correctly on reload. A small but common gap in solo portfolios, and a real signal of engineering follow-through.",
    githubUrl: "https://github.com/JoshuaMColon",
  },
];

export const flagship = projects.find((p) => p.featured) ?? projects[0];
export const supportingProjects = projects.filter((p) => !p.featured);
