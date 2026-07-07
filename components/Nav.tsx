import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-line/60">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link
          href="/"
          className="font-display font-bold text-lg tracking-tight text-ink-primary hover:text-phosphor transition-colors"
        >
          Joshua Colon
        </Link>
        <nav className="flex items-center gap-6 font-mono text-sm text-ink-muted">
          <Link href="/projects" className="hover:text-ink-primary transition-colors">
            Projects
          </Link>
          <Link href="/about" className="hover:text-ink-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-ink-primary transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
