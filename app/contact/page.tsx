export const metadata = { title: "Contact — Joshua Colon" };

export default function Contact() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <div className="font-mono text-xs tracking-widest text-phosphor mb-3">CONTACT</div>
      <h1 className="font-display font-bold text-3xl mb-6">Get in touch</h1>
      <p className="text-ink-muted leading-relaxed mb-8">
        Open to gameplay programming roles, junior positions, and small-studio teams.
        Reach out directly — replace the details below with your own.
      </p>
      <dl className="space-y-4 font-mono text-sm">
        <div>
          <dt className="text-ink-dim text-xs mb-1">EMAIL</dt>
          <dd>
            <a href="mailto:you@example.com" className="text-phosphor hover:underline">
              you@example.com
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-ink-dim text-xs mb-1">LINKEDIN</dt>
          <dd>
            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="text-phosphor hover:underline"
            >
              linkedin.com/in/your-profile
            </a>
          </dd>
        </div>
        <div>
          <dt className="text-ink-dim text-xs mb-1">GITHUB</dt>
          <dd>
            <a
              href="https://github.com/JoshuaMColon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-phosphor hover:underline"
            >
              github.com/JoshuaMColon
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
