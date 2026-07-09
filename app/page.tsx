import ProjectCard from "@/components/ProjectCard";
import StatusTag from "@/components/StatusTag";
import SystemStatus from "@/components/SystemStatus";
import { flagship, supportingProjects } from "@/lib/projects";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-14">
        <div className="font-mono text-xs tracking-widest text-[var(--phosphor)] mb-4">
          GAMEPLAY PROGRAMMER · UNREAL ENGINE 5
        </div>
        <h1 className="font-display font-bold text-4xl sm:text-5xl leading-[1.1] max-w-2xl mb-5 text-[var(--text-primary)]">
          Building thoughtful gameplay systems with purpose.
        </h1>
        <p className="text-[var(--text-muted)] text-base max-w-xl leading-relaxed">
          I design and implement gameplay systems that support clear player
          experiences, from AI and combat to tools and interactive UI. I&apos;m
          currently developing a vertical slice in UE5, guiding the work from
          concept through implementation.
        </p>

        <div className="mt-12 grid md:grid-cols-[1.6fr_1fr] gap-6">
          {/* Video / placeholder panel */}
          <div className="border border-[var(--line)] rounded-md overflow-hidden bg-[var(--surface)] shadow-sm">
            <div className="aspect-video flex items-center justify-center bg-[var(--surface-strong)] relative">
              {flagship.videoUrl ? (
                <iframe
                  className="w-full h-full"
                  src={flagship.videoUrl}
                  title={`${flagship.title} gameplay capture`}
                  allowFullScreen
                />
              ) : (
                <div className="text-center px-6">
                  <div className="font-mono text-xs text-ink-dim tracking-wider mb-2">
                    CAPTURE_PENDING
                  </div>
                  <p className="text-ink-dim text-sm">
                    Gameplay capture goes here once the flagship vertical slice
                    is playable.
                  </p>
                </div>
              )}
            </div>
            <div className="p-4 flex items-center justify-between border-t border-[var(--line)]">
              <span className="font-display font-bold text-[var(--text-primary)]">
                {flagship.title}
              </span>
              <StatusTag status={flagship.status} />
            </div>
          </div>

          {/* Spec sheet */}
          <div className="border border-[var(--line)] rounded-md bg-[var(--surface)] p-5 font-mono text-xs shadow-sm">
            <div className="text-[var(--text-dim)] tracking-wider mb-4">
              PROJECT_SPEC
            </div>
            <dl className="space-y-3">
              <div>
                <dt className="text-[var(--text-dim)]">ENGINE</dt>
                <dd className="text-[var(--text-primary)] mt-0.5">
                  {flagship.engine}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--text-dim)]">LANGUAGE</dt>
                <dd className="text-[var(--text-primary)] mt-0.5">
                  {flagship.language.join(" / ")}
                </dd>
              </div>
              <div>
                <dt className="text-[var(--text-dim)]">SYSTEMS</dt>
                <dd className="mt-1 flex flex-wrap gap-1.5">
                  {flagship.systems.map((s) => (
                    <span
                      key={s}
                      className="border border-[var(--line)] rounded-sm px-1.5 py-0.5 text-[var(--text-muted)]"
                    >
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
            <Link
              href={`/projects/${flagship.slug}`}
              className="inline-block mt-6 text-[var(--phosphor)] hover:underline"
            >
              VIEW_DOSSIER →
            </Link>
          </div>
        </div>
      </section>

      <SystemStatus />

      {/* Supporting projects */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-[var(--text-primary)]">
            Supporting Systems
          </h2>
          <Link
            href="/projects"
            className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--phosphor)]"
          >
            ALL PROJECTS →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {supportingProjects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </>
  );
}
