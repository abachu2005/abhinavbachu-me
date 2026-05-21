import type { GeneRun, Guide } from "@/data/zebrachop";

export default function GeneTrack({
  gene,
  selectedGuide,
}: {
  gene: GeneRun;
  selectedGuide: Guide | null;
}) {
  const width = 540;
  const height = 110;
  const trackY = 60;
  const total = gene.exons.reduce((s, w) => s + w, 0);
  const gap = 0.5;
  const totalWithGaps = total + gap * (gene.exons.length - 1);
  const unit = (width - 20) / totalWithGaps;

  let cursor = 10;
  const exonRects = gene.exons.map((w) => {
    const x = cursor;
    const wPx = w * unit;
    cursor += wPx + gap * unit;
    return { x, w: wPx, center: x + wPx / 2 };
  });

  // Place guides along the gene. Each guide gets pseudo-positioned across the
  // exons based on its rank, biased toward the target exon (early exons).
  const guidePositions = gene.guides.slice(0, 7).map((g, i) => {
    const target = exonRects[gene.targetExon];
    // Spread across nearby region; rank 1 closest to target center.
    const jitter = ((i % 4) - 1.5) * (target.w * 0.18);
    const xShift = (i > 4 ? exonRects[3]?.center ?? target.center : target.center) + jitter;
    return { guide: g, x: Math.max(12, Math.min(width - 12, xShift)) };
  });

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-28 w-full min-w-[480px]"
        role="img"
        aria-label={`Gene model for ${gene.symbol}`}
      >
        {/* Backbone */}
        <line
          x1={10}
          x2={width - 10}
          y1={trackY + 8}
          y2={trackY + 8}
          stroke="var(--color-border-strong)"
          strokeWidth={1}
        />

        {/* Exons */}
        {gene.exons.map((_, i) => {
          const r = exonRects[i];
          const isTarget = i === gene.targetExon;
          return (
            <g key={i}>
              <rect
                x={r.x}
                y={trackY}
                width={r.w}
                height={16}
                rx={2}
                fill={
                  isTarget ? "var(--color-accent)" : "var(--color-ink-subtle)"
                }
                opacity={isTarget ? 1 : 0.72}
              />
              <text
                x={r.center}
                y={trackY + 32}
                textAnchor="middle"
                fontSize={9}
                fontFamily="JetBrains Mono"
                fill="var(--color-ink-subtle)"
              >
                exon {i + 1}
              </text>
            </g>
          );
        })}

        {/* Guides as ticks above the gene */}
        {guidePositions.map(({ guide, x }) => {
          const selected = selectedGuide?.seq === guide.seq;
          const y2 = trackY - 4;
          const y1 = trackY - 22;
          return (
            <g key={guide.seq}>
              <line
                x1={x}
                x2={x}
                y1={y1}
                y2={y2}
                stroke={
                  selected
                    ? "var(--color-accent-deep)"
                    : "var(--color-accent-light)"
                }
                strokeWidth={selected ? 2 : 1.2}
              />
              <circle
                cx={x}
                cy={y1 - 2}
                r={selected ? 5 : 3.5}
                fill={
                  selected
                    ? "var(--color-accent-deep)"
                    : "var(--color-accent-light)"
                }
              />
              <text
                x={x}
                y={y1 - 7}
                textAnchor="middle"
                fontSize={9}
                fontFamily="JetBrains Mono"
                fill={
                  selected
                    ? "var(--color-accent-deep)"
                    : "var(--color-ink-muted)"
                }
                fontWeight={selected ? 700 : 500}
              >
                {guide.rank}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
