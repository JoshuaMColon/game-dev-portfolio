import { notFound } from "next/navigation";
import Link from "next/link";
import { projects } from "@/lib/projects";
import StatusTag from "@/components/StatusTag";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  return { title: project ? `${project.title} — Joshua Colon` : "Project not found" };
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) return notFound();

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <Link href="/projects" className="font-mono text-xs text-ink-muted hover:text-phosphor">
        ← ALL PROJECTS
      </Link>

      <div className="flex items-start justify-between gap-4 mt-6 mb-2">
        <h1 className="font-display font-bold text-3xl">{project.title}</h1>
        <StatusTag status={project.status} />
      </div>
      <p className="text-ink-muted text-lg mb-8">{project.oneLiner}</p>

      <div className="border border-line rounded-md overflow-hidden bg-graphite-900 mb-8">
        <div className="aspect-video flex items-center justify-center bg-graphite-800">
          {project.videoUrl ? (
            <iframe
              className="w-full h-full"
              src={project.videoUrl}
              title={`${project.title} gameplay capture`}
              allowFullScreen
            />
          ) : (
            <div className="text-center px-6">
              <div className="font-mono text-xs text-ink-dim tracking-wider mb-2">
                CAPTURE_PENDING
              </div>
              <p className="text-ink-dim text-sm">Gameplay capture coming soon.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8 font-mono text-xs">
        <div>
          <div className="text-ink-dim mb-1">ENGINE</div>
          <div className="text-ink-primary">{project.engine}</div>
        </div>
        <div>
          <div className="text-ink-dim mb-1">LANGUAGE</div>
          <div className="text-ink-primary">{project.language.join(" / ")}</div>
        </div>
        <div>
          <div className="text-ink-dim mb-1">SYSTEMS</div>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {project.systems.map((s) => (
              <span key={s} className="border border-line rounded-sm px-1.5 py-0.5 text-ink-muted">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="prose-none text-ink-muted leading-relaxed mb-8">
        <p>{project.description}</p>
      </div>

      {project.whatIdImprove && (
        <div className="border-l-2 border-amber/50 pl-4 mb-8">
          <div className="font-mono text-[11px] text-amber tracking-wider mb-1">
            WHAT_I_D_IMPROVE
          </div>
          <p className="text-ink-muted text-sm">{project.whatIdImprove}</p>
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
            PLAY →
          </a>
        )}
      </div>
    </section>
  );
}
