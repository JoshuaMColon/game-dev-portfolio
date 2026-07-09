import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

export default function Nav() {
  return (
    <header className="border-b border-[var(--line)]/80 bg-[color:rgba(255,255,255,0.02)] backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/"
          className="font-display font-bold text-lg tracking-tight text-[var(--text-primary)] hover:text-[var(--phosphor)] transition-colors"
        >
          Joshua Colon
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-5 font-mono text-sm text-[var(--text-muted)]">
            <Link
              href="/projects"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Projects
            </Link>
            <Link
              href="/about"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Contact
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
