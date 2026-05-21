import { cn } from "@/lib/cn";

export type Scenario = {
  id: string;
  label: string;
  description?: string;
};

export type ScenarioPickerProps = {
  scenarios: Scenario[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
};

export default function ScenarioPicker({
  scenarios,
  value,
  onChange,
  disabled,
}: ScenarioPickerProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {scenarios.map((s) => {
        const selected = value === s.id;
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onChange(s.id)}
            disabled={disabled}
            className={cn(
              "group rounded-lg border px-4 py-3 text-left transition-all",
              "disabled:cursor-not-allowed disabled:opacity-60",
              selected
                ? "border-[var(--color-accent)] bg-[var(--color-accent-tint)] shadow-[var(--shadow-soft)]"
                : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-border-strong)]",
            )}
          >
            <p
              className={cn(
                "text-sm font-medium",
                selected ? "text-[var(--color-accent-deep)]" : "text-[var(--color-ink)]",
              )}
            >
              {s.label}
            </p>
            {s.description && (
              <p className="mt-1 text-xs text-[var(--color-ink-muted)]">
                {s.description}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
