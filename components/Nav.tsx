import Link from "next/link";
import GooeyNav from "./GooeyNav";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Level Design", href: "/level-design" },
  { label: "Contact", href: "/contact" },
];

// Site chrome. The order classes keep the theme toggle beside the name
// on small screens (links wrap to their own row) and slide it to the end at lg.
export default function Nav() {
  return (
    <header className="border-b border-[var(--line)]/80 bg-[color:rgba(255,255,255,0.02)] backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <Link
          href="/"
          title="Home"
          className="order-1 font-display font-bold text-lg tracking-tight text-[var(--text-primary)] hover:text-[var(--phosphor)] transition-colors"
        >
          Joshua Colon
        </Link>
        <div className="order-3 w-full min-w-0 lg:order-2 lg:ml-auto lg:w-auto">
          <GooeyNav items={navItems} />
        </div>
        <div className="order-2 lg:order-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
