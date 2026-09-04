import LevelDesignCard from "@/components/LevelDesignCard";

export const metadata = {
  title: "Level Design — Joshua Colon",
};

const referenceImages = [
  {
    label: "Flow study",
    src: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=85",
  },
  {
    label: "Material study",
    src: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=85",
  },
  {
    label: "Scale study",
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=85",
  },
];

export default function LevelDesignPage() {
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

      <div className="grid lg:grid-cols-2 gap-4 items-stretch">
        <LevelDesignCard
          eyebrow="REFERENCE LIBRARY"
          title="Reference Images"
          description="Visual notes for composition, scale, lighting, and navigational rhythm before a blockout begins."
        >
          <div className="grid grid-cols-2 gap-2 px-5 pb-5">
            {referenceImages.map((image, index) => (
              <div
                key={image.label}
                className={`relative overflow-hidden rounded-sm border border-[var(--line)] bg-[var(--surface-strong)] ${
                  index === 0 ? "col-span-2 aspect-[2.2/1]" : "aspect-[1.25/1]"
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${image.src})` }}
                  role="img"
                  aria-label={image.label}
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1.5 font-mono text-[10px] text-white">
                  {image.label}
                </div>
              </div>
            ))}
          </div>
        </LevelDesignCard>

        <LevelDesignCard
          eyebrow="DEVELOPED DESIGN"
          title="Playable Blockout"
          description="A developed encounter space shaped around readable entrances, a strong focal point, and a deliberate loop through the room."
        >
          <div className="mx-5 mb-5 aspect-[4/3] rounded-sm border border-[var(--line)] bg-[#10151a] p-3">
            <div className="h-full border border-dashed border-[#4e7c72] p-3 relative">
              <div className="absolute left-3 top-3 right-1/3 h-1/4 border border-[#7fdbae]/70 bg-[#22473e]/70" />
              <div className="absolute right-3 top-1/4 w-1/4 h-1/2 border border-[#d4a24c]/70 bg-[#4b3920]/80" />
              <div className="absolute left-1/4 bottom-3 w-1/3 h-1/4 border border-[#7eb8d6]/70 bg-[#234052]/80" />
              <div className="absolute left-1/3 top-1/2 w-1/4 h-1/5 border border-[#e8eaed]/60 bg-[#66717c]/50" />
              <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-[#7fdbae]/50" />
              <div className="absolute left-1/2 inset-y-0 border-l border-dashed border-[#7fdbae]/50" />
              <div className="absolute left-2 bottom-2 font-mono text-[9px] tracking-wider text-[#7fdbae]">
                ENTRY
              </div>
              <div className="absolute right-2 top-2 font-mono text-[9px] tracking-wider text-[#d4a24c]">
                FOCAL POINT
              </div>
              <div className="absolute right-2 bottom-2 font-mono text-[9px] tracking-wider text-[#7eb8d6]">
                LOOP RETURN
              </div>
            </div>
          </div>
        </LevelDesignCard>
      </div>
    </section>
  );
}
