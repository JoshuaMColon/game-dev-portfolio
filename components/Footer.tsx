export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)]/80 mt-24">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs text-[var(--text-dim)]">
        <span>© {new Date().getFullYear()} Joshua Colon</span>
        <div className="flex gap-5">
          <a
            href="https://github.com/JoshuaMColon"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--phosphor)] transition-colors"
          >
            GITHUB
          </a>
          <a
            href="/contact"
            className="hover:text-[var(--phosphor)] transition-colors"
          >
            CONTACT
          </a>
        </div>
      </div>
    </footer>
  );
}
