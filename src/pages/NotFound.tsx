import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-32 sm:px-8">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-accent)]">
        404
      </p>
      <h1 className="mb-4">Page not found.</h1>
      <p className="mb-8 text-[var(--color-ink-muted)]">
        Looks like there&rsquo;s nothing here. Try heading back to the homepage.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--color-accent-deep)]"
      >
        Back home
      </Link>
    </div>
  );
}
