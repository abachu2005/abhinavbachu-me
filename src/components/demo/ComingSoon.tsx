import { Sparkles } from "lucide-react";

export default function ComingSoon({
  label = "Interactive demo in progress",
  body,
}: {
  label?: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-panel)] p-10 text-center">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-accent-tint)] text-[var(--color-accent-deep)]">
        <Sparkles className="h-4 w-4" />
      </span>
      <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-[var(--color-accent)]">
        {label}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-ink-muted)]">
        {body}
      </p>
    </div>
  );
}
