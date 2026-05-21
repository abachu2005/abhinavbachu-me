import type { Hit } from "@/data/leafcutter";

export default function JunctionTrack({ hit }: { hit: Hit }) {
  const total = hit.exons.reduce((s, w) => s + w, 0);
  const gap = 0.4;
  const totalWithGaps = total + gap * (hit.exons.length - 1);
  const width = 520;
  const height = 130;
  const trackY = height - 30;
  const unit = width / totalWithGaps;

  // Compute x positions for each exon
  let cursor = 0;
  const exonRects = hit.exons.map((w) => {
    const x = cursor * unit;
    const wPx = w * unit;
    cursor += w + gap;
    return { x, w: wPx, center: x + wPx / 2 };
  });

  const maxJ = Math.max(...hit.junctions.map((j) => j.reads || 1));

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-32 w-full min-w-[480px]"
        role="img"
        aria-label={`Junction diagram for ${hit.gene}`}
      >
        {/* Backbone */}
        <line
          x1={0}
          x2={width}
          y1={trackY + 6}
          y2={trackY + 6}
          stroke="var(--color-border-strong)"
          strokeWidth={1}
          strokeDasharray="2 4"
        />

        {/* Arcs */}
        {hit.junctions.map((j, i) => {
          const a = exonRects[j.from];
          const b = exonRects[j.to];
          if (!a || !b) return null;
          const x1 = a.center;
          const x2 = b.center;
          const mid = (x1 + x2) / 2;
          const span = Math.abs(x2 - x1);
          const arcHeight = Math.min(70, 24 + span * 0.18);
          const top = trackY + 4 - arcHeight;
          const skipsPoison =
            (j.from < hit.poisonIndex && j.to > hit.poisonIndex) ||
            (j.to < hit.poisonIndex && j.from > hit.poisonIndex);
          const stroke = skipsPoison
            ? "var(--color-accent)"
            : "var(--color-accent-light)";
          const strokeWidth = 1 + (j.reads / maxJ) * 3.5;
          return (
            <g key={i}>
              <path
                d={`M ${x1} ${trackY + 4} Q ${mid} ${top} ${x2} ${trackY + 4}`}
                fill="none"
                stroke={stroke}
                strokeWidth={strokeWidth}
                opacity={0.85}
              />
              <text
                x={mid}
                y={top + 2}
                textAnchor="middle"
                fontSize={10}
                fontFamily="JetBrains Mono"
                fill="var(--color-ink-muted)"
              >
                {j.reads}
              </text>
            </g>
          );
        })}

        {/* Exons */}
        {hit.exons.map((_, i) => {
          const r = exonRects[i];
          const isPoison = i === hit.poisonIndex;
          return (
            <g key={i}>
              <rect
                x={r.x}
                y={trackY}
                width={r.w}
                height={16}
                rx={2}
                fill={
                  isPoison ? "var(--color-accent)" : "var(--color-ink-subtle)"
                }
                opacity={isPoison ? 1 : 0.75}
              />
              {isPoison && (
                <text
                  x={r.center}
                  y={trackY + 30}
                  textAnchor="middle"
                  fontSize={10}
                  fontFamily="JetBrains Mono"
                  fill="var(--color-accent-deep)"
                  fontWeight={600}
                >
                  poison
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
