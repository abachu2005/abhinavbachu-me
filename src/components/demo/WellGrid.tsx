import { useMemo } from "react";
import { cn } from "@/lib/cn";
import type { Well } from "@/data/autobarcoder";

export type WellGridProps = {
  rows: string[];
  cols: string[];
  wells: Well[];
  selected?: { row: string; col: string } | null;
  onSelect: (well: Well) => void;
};

export default function WellGrid({
  rows,
  cols,
  wells,
  selected,
  onSelect,
}: WellGridProps) {
  const map = useMemo(() => {
    const m = new Map<string, Well>();
    for (const w of wells) m.set(`${w.row}|${w.col}`, w);
    return m;
  }, [wells]);

  const maxReads = useMemo(
    () => Math.max(1, ...wells.map((w) => w.totalReads)),
    [wells],
  );

  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-1.5">
        <thead>
          <tr>
            <th />
            {cols.map((c, i) => (
              <th
                key={c}
                className="pb-1 font-mono text-[0.65rem] font-medium uppercase tracking-wider text-[var(--color-ink-subtle)]"
              >
                {i + 1}
                <div className="font-mono text-[0.6rem] text-[var(--color-ink-subtle)]">
                  {c}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, rowIdx) => (
            <tr key={r}>
              <th className="pr-2 text-right font-mono text-[0.65rem] font-medium uppercase tracking-wider text-[var(--color-ink-subtle)]">
                {String.fromCharCode(65 + rowIdx)}
                <div className="font-mono text-[0.6rem] text-[var(--color-ink-subtle)]">
                  {r}
                </div>
              </th>
              {cols.map((c) => {
                const w = map.get(`${r}|${c}`);
                if (!w) return <td key={c} />;
                const intensity = Math.max(0.08, w.totalReads / maxReads);
                const isSelected =
                  selected?.row === w.row && selected?.col === w.col;
                return (
                  <td key={c} className="p-0">
                    <button
                      type="button"
                      onClick={() => onSelect(w)}
                      title={`${w.totalReads} reads · top: ${w.variants[0]?.seq} (${w.variants[0]?.pct}%)`}
                      className={cn(
                        "relative h-12 w-12 rounded-md border transition-all",
                        isSelected
                          ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)] ring-offset-1 ring-offset-[var(--color-bg-elevated)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-accent-light)]",
                      )}
                      style={{
                        backgroundColor: `color-mix(in oklab, var(--color-accent) ${
                          intensity * 78
                        }%, var(--color-bg-elevated))`,
                      }}
                    >
                      {w.flag === "low-coverage" && (
                        <span
                          className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--color-warning)]"
                          title="Low coverage"
                        />
                      )}
                      {w.flag === "low-diversity" && (
                        <span
                          className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--color-ink-subtle)]"
                          title="Low diversity"
                        />
                      )}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
