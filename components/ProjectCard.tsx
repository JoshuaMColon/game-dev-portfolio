import { Project } from "@/lib/projects";
import Link from "next/link";
import BorderGlow from "./BorderGlow";
import PixelCard from "./PixelCard";
import StatusTag from "./StatusTag";

export default function ProjectCard({ project }: { project: Project }) {
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
        <Link
          href={`/projects/${project.slug}`}
          className="relative z-10 block h-full p-5 flex flex-col justify-between"
          aria-label={`View ${project.title}`}
        >
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="font-display font-bold text-lg text-[var(--text-primary)] transition-colors">
                {project.title}
              </h3>
              <StatusTag status={project.status} />
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
              {project.oneLiner}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {project.systems.slice(0, 3).map((sys) => (
              <span
                key={sys}
                className="font-mono text-[10px] text-[var(--text-dim)] border border-[var(--line)] rounded-sm px-1.5 py-0.5"
              >
                {sys}
              </span>
            ))}
          </div>
        </Link>
      </BorderGlow>
    </PixelCard>
  );
}
