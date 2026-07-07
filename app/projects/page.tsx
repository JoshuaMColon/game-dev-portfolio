import { projects } from "@/lib/projects";
import ProjectCard from "@/components/ProjectCard";

export const metadata = {
  title: "Projects — Joshua Colon",
};

export default function ProjectsPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="font-mono text-xs tracking-widest text-phosphor mb-3">
        PROJECT_INDEX
      </div>
      <h1 className="font-display font-bold text-3xl mb-3">All Projects</h1>
      <p className="text-ink-muted max-w-xl mb-10">
        Each project below stands on its own, and most feed directly into the flagship
        vertical slice as they&apos;re completed.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}
