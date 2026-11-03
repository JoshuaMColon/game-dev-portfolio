import ImageCarousel from "@/components/ImageCarousel";
import { iterations } from "@/lib/iterations";

export default function IterationLog() {
  const images = iterations.map((it, i) => ({
    ...it.image,
    title: `${it.version} · ${it.date} · ${it.title}`,
    caption: it.summary,
    credit: i === iterations.length - 1 ? "The captures on this page are from this pass." : it.image.caption,
  }));
  return (
    <>
      <ImageCarousel
        name="Blockout iteration log, oldest first"
        groups={[
          {
            id: "iterations",
            tab: "Iteration",
            label: "Iteration log",
            images,
            stripLabels: iterations.map((it) => it.version),
          },
        ]}
      />
      <p className="mt-3 font-mono text-[10px] leading-relaxed tracking-wider text-[var(--text-muted)]">
        <span className="text-[#8a5d0f] dark:text-[#d4a24c]">NEXT · v11–v13 IN PROGRESS</span> · Later passes already exist
        in the editor, including weapon pickup and arena combat work. Captures will be added once they are reviewed.
      </p>
    </>
  );
}
