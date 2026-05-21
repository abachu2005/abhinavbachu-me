import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export type FakeProgressProps = {
  active: boolean;
  steps: string[];
  /** total duration in ms */
  duration?: number;
  onComplete?: () => void;
};

export default function FakeProgress({
  active,
  steps,
  duration = 1500,
  onComplete,
}: FakeProgressProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setStepIndex(0);
      return;
    }
    const perStep = duration / steps.length;
    let i = 0;
    setStepIndex(0);
    const t = setInterval(() => {
      i += 1;
      if (i >= steps.length) {
        clearInterval(t);
        setTimeout(() => onComplete?.(), 80);
        return;
      }
      setStepIndex(i);
    }, perStep);
    return () => clearInterval(t);
  }, [active, duration, steps.length, onComplete]);

  if (!active) return null;

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
      <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-panel)]">
        <div
          className="v-shimmer h-full rounded-full bg-[var(--color-accent)]"
          style={{
            width: `${((stepIndex + 1) / steps.length) * 100}%`,
            transition: "width 240ms ease",
          }}
        />
      </div>
      <ul className="space-y-1.5 font-mono text-xs">
        {steps.map((s, i) => (
          <li
            key={s}
            className={cn(
              "flex items-center gap-2 transition-opacity",
              i > stepIndex && "opacity-40",
            )}
          >
            <span
              className={cn(
                "inline-block h-1.5 w-1.5 rounded-full",
                i < stepIndex
                  ? "bg-[var(--color-accent)]"
                  : i === stepIndex
                    ? "bg-[var(--color-accent)] v-glow"
                    : "bg-[var(--color-border-strong)]",
              )}
            />
            <span
              className={cn(
                i < stepIndex
                  ? "text-[var(--color-ink-muted)] line-through"
                  : "text-[var(--color-ink)]",
              )}
            >
              {s}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
