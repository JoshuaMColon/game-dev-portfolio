import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Projects — Joshua Colon",
};

export default function ProjectsPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="font-mono text-xs tracking-widest text-[var(--phosphor)] mb-3">
        PROJECT INDEX
      </div>
      <h1 className="font-display font-bold text-3xl mb-3 text-[var(--text-primary)]">
        Projects
      </h1>
      <p className="text-[var(--text-muted)] max-w-xl mb-10">
        This collection reflects the systems I&apos;m building and refining as I
        develop the larger vertical slice. Each project is designed to
        contribute something useful and reusable to the overall experience.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
