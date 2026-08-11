import DecryptedText from "../../components/DecryptedText";

export const metadata = { title: "About — Joshua Colon" };

export default function About() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <div className="font-mono text-xs tracking-widest text-[var(--phosphor)] mb-3">
        ABOUT
      </div>
      <h1 className="font-display font-bold text-3xl mb-8 text-[var(--text-primary)]">
        Joshua Colon
      </h1>

      <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
        <p>
          <DecryptedText
            text="I'm a gameplay programmer focused on building systems that feel intentional, reliable, and easy to extend. My work centers on Unreal Engine 5, with emphasis on AI behavior, combat logic, interactive tools, and the underlying architecture that supports a polished experience."
            animateOn="hover"
            className="text-[var(--text-muted)]"
            encryptedClassName="text-[var(--text-muted)] opacity-80"
          />
        </p>
        <p>
          <DecryptedText
            text="I also bring a strong software engineering background from full-stack web development, which shapes the way I approach game systems: modular design, maintainable code, and thoughtful implementation from the start."
            animateOn="hover"
            className="text-[var(--text-muted)]"
            encryptedClassName="text-[var(--text-muted)] opacity-80"
          />
        </p>
        <p>
          <DecryptedText
            text="Before moving into game development, I spent twelve years in data management, compliance, and logistics across the Marine Corps and Army. That experience strengthened my approach to state management, rules-driven systems, and clear, dependable engineering practices."
            animateOn="hover"
            className="text-[var(--text-muted)]"
            encryptedClassName="text-[var(--text-muted)] opacity-80"
          />
        </p>
        <p>
          <DecryptedText
            text="I'm building this portfolio one complete system at a time, with a focus on craftsmanship and long-term growth as I work toward contributing to a strong development team."
            animateOn="hover"
            className="text-[var(--text-muted)]"
            encryptedClassName="text-[var(--text-muted)] opacity-80"
          />
        </p>
      </div>

      <div className="mt-10 font-mono text-sm">
        <a
          href="https://github.com/JoshuaMColon"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--phosphor)] hover:underline"
        >
          GITHUB →
        </a>
      </div>
    </section>
  );
}
