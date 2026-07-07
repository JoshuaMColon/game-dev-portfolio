import { ProjectStatus } from "@/lib/projects";

const STATUS_META: Record<ProjectStatus, { label: string; className: string }> = {
  flagship: { label: "FLAGSHIP", className: "text-phosphor border-phosphor/40" },
  "in-progress": { label: "IN PROGRESS", className: "text-amber border-amber/40" },
  planned: { label: "PLANNED", className: "text-ink-dim border-line" },
  complete: { label: "COMPLETE", className: "text-phosphor border-phosphor/40" },
};

export default function StatusTag({ status }: { status: ProjectStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-block font-mono text-[10px] tracking-wider px-2 py-0.5 border rounded-sm ${meta.className}`}
    >
      {meta.label}
    </span>
  );
}
