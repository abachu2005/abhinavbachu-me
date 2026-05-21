import { cn } from "@/lib/cn";

export type NarrationItem = {
  title: string;
  body: string;
};

export default function NarrationRail({
  items,
  active,
  onSelect,
}: {
  items: NarrationItem[];
  active: number;
  onSelect?: (i: number) => void;
}) {
  return (
    <aside className="space-y-2">
      {items.map((item, i) => {
        const isActive = i === active;
        return (
          <button
            key={item.title}
            type="button"
            onClick={() => onSelect?.(i)}
            className={cn(
              "block w-full rounded-lg border p-3 text-left transition-all",
              isActive
                ? "border-[var(--color-accent)] bg-[var(--color-accent-tint)]"
                : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]",
            )}
          >
            <p className="flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-wider text-[var(--color-ink-subtle)]">
              <span
                className={cn(
                  "inline-block h-1.5 w-1.5 rounded-full",
                  isActive ? "bg-[var(--color-accent)]" : "bg-[var(--color-border-strong)]",
                )}
              />
              Step {i + 1}
            </p>
            <p
              className={cn(
                "mt-1.5 text-sm font-medium",
                isActive ? "text-[var(--color-accent-deep)]" : "text-[var(--color-ink)]",
              )}
            >
              {item.title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
              {item.body}
            </p>
          </button>
        );
      })}
    </aside>
  );
}
