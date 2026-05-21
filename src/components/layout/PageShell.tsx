import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";

type ExternalLinkItem = { label: string; href: string };

export type PageShellProps = {
  eyebrow?: string;
  title: string;
  tagline: string;
  role?: string;
  timeline?: string;
  externalLinks?: ExternalLinkItem[];
  children: ReactNode;
};

export default function PageShell({
  eyebrow,
  title,
  tagline,
  role,
  timeline,
  externalLinks,
  children,
}: PageShellProps) {
  return (
    <div className="mx-auto max-w-4xl px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] print:hidden"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </Link>

      <header className="mt-8 v-slide-up">
        {eyebrow && (
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-balance">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-[var(--color-ink-muted)]">
          {tagline}
        </p>
        {(role || timeline || externalLinks?.length) && (
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {role && (
              <span className="inline-flex items-center gap-2 text-[var(--color-ink-muted)]">
                <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" />
                {role}
              </span>
            )}
            {timeline && (
              <span className="text-[var(--color-ink-muted)]">{timeline}</span>
            )}
            {externalLinks?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--color-accent)] hover:text-[var(--color-accent-deep)]"
              >
                {l.label}
                <ExternalLink className="h-3 w-3" />
              </a>
            ))}
          </div>
        )}
      </header>

      <div className="mt-12 space-y-14">{children}</div>
    </div>
  );
}

export function Section({
  title,
  children,
  className,
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      {title && (
        <h2 className="mb-4 text-[1.35rem]">{title}</h2>
      )}
      <div className="text-[var(--color-ink)] [&_p]:text-[var(--color-ink-muted)]">
        {children}
      </div>
    </section>
  );
}
