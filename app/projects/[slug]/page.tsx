import StatusTag from "@/components/StatusTag";
import { projects } from "@/lib/projects";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  return {
    title: project ? `${project.title} — Joshua Colon` : "Project not found",
  };
}

export default function ProjectDetail({
  params,
}: {
  params: { slug: string };
}) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return notFound();

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/projects"
        className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--phosphor)]"
      >
        ← ALL PROJECTS
      </Link>

      <div className="flex items-start justify-between gap-4 mt-6 mb-2">
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">
          {project.title}
        </h1>
        <StatusTag status={project.status} />
      </div>
      <p className="text-[var(--text-muted)] text-lg mb-8">
        {project.oneLiner}
      </p>

      {project.teamProject && (
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 font-mono text-xs text-[var(--text-muted)]">
          <span className="text-[var(--phosphor)]">TEAM PROJECT</span>
          {project.institution && <span>{project.institution}</span>}
          {project.role && <span>{project.role}</span>}
        </div>
      )}

      <div className="border border-[var(--line)] rounded-md overflow-hidden bg-[var(--surface)] mb-8 shadow-sm">
        <div className="aspect-video flex items-center justify-center bg-[var(--surface-strong)]">
          {project.videoUrl ? (
            <iframe
              className="w-full h-full"
              src={project.videoUrl}
              title={`${project.title} gameplay capture`}
              allowFullScreen
            />
          ) : (
            <div className="text-center px-6">
              <div className="font-mono text-xs text-[var(--text-dim)] tracking-wider mb-2">
                CAPTURE PENDING
              </div>
              <p className="text-[var(--text-dim)] text-sm">
                Gameplay capture coming soon.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8 font-mono text-xs">
        <div>
          <div className="text-[var(--text-dim)] mb-1">ENGINE</div>
          <div className="text-[var(--text-primary)]">{project.engine}</div>
        </div>
        <div>
          <div className="text-[var(--text-dim)] mb-1">LANGUAGE</div>
          <div className="text-[var(--text-primary)]">
            {project.language.join(" / ")}
          </div>
        </div>
        <div>
          <div className="text-[var(--text-dim)] mb-1">SYSTEMS</div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {project.systems.map((s) => (
              <span
                key={s}
                className="border border-[var(--line)] rounded-sm px-1.5 py-0.5 text-[var(--text-muted)]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="prose-none text-[var(--text-muted)] leading-relaxed mb-8">
        <p>{project.description}</p>
      </div>

      {project.whatIdImprove && (
        <div className="border-l-2 border-amber/50 pl-4 mb-8">
          <div className="font-mono text-[11px] text-amber tracking-wider mb-1">
            WHAT I WOULD IMPROVE
          </div>
          <p className="text-[var(--text-muted)] text-sm">
            {project.whatIdImprove}
          </p>
        </div>
      )}

      <div className="flex gap-4 font-mono text-sm">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-phosphor hover:underline"
          >
            REPO →
          </a>
        )}
        {project.itchUrl && (
          <a
            href={project.itchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-phosphor hover:underline"
          >
            PLAY ON ITCH.IO →
          </a>
        )}
      </div>
    </section>
  );
}
