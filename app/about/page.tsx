export const metadata = { title: "About — Joshua Colon" };

export default function About() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <div className="font-mono text-xs tracking-widest text-phosphor mb-3">ABOUT</div>
      <h1 className="font-display font-bold text-3xl mb-8">Joshua Colon</h1>

      <div className="space-y-6 text-ink-muted leading-relaxed">
        <p>
          I&apos;m a gameplay programmer building systems in Unreal Engine 5 — AI behavior,
          combat, tools, and the underlying architecture that holds a game together. I
          hold a B.S. in Game Design from Full Sail University, and I&apos;m currently
          completing a B.S. in Software Engineering.
        </p>
        <p>
          My day-to-day engineering background is in full-stack web development
          (JavaScript/TypeScript, React, Node.js, Python), which shows up in how I build
          games: componentized systems, clean version control, and UI that&apos;s actually
          usable rather than an afterthought.
        </p>
        <p>
          Before any of this, I spent twelve years across the Marine Corps and Army in
          data management, compliance, and logistics — work that&apos;s fundamentally about
          tracking state, enforcing rules, and keeping complex systems consistent. That&apos;s
          the same instinct I bring to gameplay systems now: a Behavior Tree, an
          inventory system, and a save/load pipeline are all, at their core, state you
          have to get right.
        </p>
        <p>
          I&apos;m building this portfolio solo, one finished system at a time, aiming to
          break into the industry — studio size isn&apos;t the point, doing the work well is.
        </p>
      </div>

      <div className="mt-10 font-mono text-sm">
        <a
          href="https://github.com/JoshuaMColon"
          target="_blank"
          rel="noopener noreferrer"
          className="text-phosphor hover:underline"
        >
          GITHUB →
        </a>
      </div>
    </section>
  );
}
