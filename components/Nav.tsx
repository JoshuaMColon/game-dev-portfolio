import Link from "next/link";
import GooeyNav from "./GooeyNav";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

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
        <div className="flex items-center gap-4 min-w-0">
          <div className="min-w-0">
            <GooeyNav items={navItems} />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
