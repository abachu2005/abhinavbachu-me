export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] py-10 text-sm text-[var(--color-ink-muted)] print:hidden">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 sm:flex-row sm:items-center sm:px-8">
        <p className="font-serif text-[var(--color-ink)]">
          Abhinav Bachu &middot; <span className="text-[var(--color-ink-muted)]">{new Date().getFullYear()}</span>
        </p>
        <div className="flex gap-5">
          <a href="https://github.com/abachu2005" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="mailto:abhinav.bachu.med@gmail.com">Email</a>
        </div>
      </div>
    </footer>
  );
}
