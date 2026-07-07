import Link from "next/link";
import { Project } from "@/lib/projects";
import StatusTag from "./StatusTag";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block border border-line rounded-md p-5 bg-graphite-900 hover:border-phosphor/50 hover:bg-graphite-800 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-display font-bold text-lg text-ink-primary group-hover:text-phosphor transition-colors">
          {project.title}
        </h3>
        <StatusTag status={project.status} />
      </div>
      <p className="text-sm text-ink-muted leading-relaxed mb-4">{project.oneLiner}</p>
      <div className="flex flex-wrap gap-1.5">
        {project.systems.slice(0, 3).map((sys) => (
          <span
            key={sys}
            className="font-mono text-[10px] text-ink-dim border border-line rounded-sm px-1.5 py-0.5"
          >
            {sys}
          </span>
        ))}
      </div>
    </Link>
  );
}
