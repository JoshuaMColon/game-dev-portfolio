import BorderGlow from "./BorderGlow";
import PixelCard from "./PixelCard";

type LevelDesignCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function LevelDesignCard({
  eyebrow,
  title,
  description,
  children,
}: LevelDesignCardProps) {
  return (
    <PixelCard variant="pink" className="w-full h-full">
      <BorderGlow
        edgeSensitivity={30}
        glowColor="40 80 80"
        backgroundColor="rgba(18, 15, 23, 0.25)"
        borderRadius={28}
        glowRadius={40}
        glowIntensity={1}
        coneSpread={25}
        animated={false}
        colors={["#c084fc", "#f472b6", "#38bdf8"]}
        fillOpacity={0.25}
        className="w-full h-full"
      >
        <article className="relative z-10 h-full flex flex-col">
          <div className="p-5 pb-4">
            <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--phosphor)] mb-2">
              {eyebrow}
            </div>
            <h2 className="font-display font-bold text-xl text-[var(--text-primary)] mb-2">
              {title}
            </h2>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {description}
            </p>
          </div>
          {children}
        </article>
      </BorderGlow>
    </PixelCard>
  );
}
