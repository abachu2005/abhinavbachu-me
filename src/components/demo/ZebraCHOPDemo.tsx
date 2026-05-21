import { useEffect, useState } from "react";
import { genes } from "@/data/zebrachop";
import { cn } from "@/lib/cn";

export type ZebraCHOPPhase = "form" | "running" | "results";

export type ZebraCHOPDemoProps = {
  phase: ZebraCHOPPhase;
  /** Which gene's results to show (defaults to first) */
  activeGeneId?: string;
  /** Which row in the table to highlight */
  highlightRank?: number | null;
};

const RUN_LINES = [
  "Resolving gene from danRer11.gene_table…",
  "Extracting sequence (twoBitToFa)…",
  "Scoring candidate sgRNAs (Doench 2016)…",
  "Off-target alignment (Bowtie)…",
  "Re-ranking by Ensembl exon structure…",
];

export default function ZebraCHOPDemo({
  phase,
  activeGeneId,
  highlightRank,
}: ZebraCHOPDemoProps) {
  const gene = genes.find((g) => g.id === (activeGeneId ?? genes[0].id)) ?? genes[0];

  const [logIdx, setLogIdx] = useState(0);
  useEffect(() => {
    if (phase !== "running") {
      setLogIdx(0);
      return;
    }
    let i = 0;
    setLogIdx(0);
    const id = window.setInterval(() => {
      i += 1;
      setLogIdx(i);
      if (i >= RUN_LINES.length) window.clearInterval(id);
    }, 360);
    return () => window.clearInterval(id);
  }, [phase]);

  return (
    <div className="skin-zebrachop overflow-hidden rounded-xl border border-[var(--zc-border)]">
      <header
        style={{
          padding: "14px 22px",
          background: "var(--zc-panel)",
          borderBottom: "1px solid var(--zc-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontFamily: "inherit", fontSize: 16, fontWeight: 600, color: "var(--zc-text)" }}>
            ZebraCHOP
          </h3>
          <div style={{ color: "var(--zc-muted)", fontSize: 12 }}>
            CRISPR gRNA design for zebrafish (Danio rerio)
          </div>
        </div>
        <span
          className={cn(
            "zc-pill",
            phase === "running" && "zc-pill-running",
            phase === "results" && "zc-pill-done",
          )}
        >
          {phase === "form" ? "idle" : phase === "running" ? "running" : "done"}
        </span>
      </header>

      <div style={{ padding: 18, minHeight: 380 }}>
        {phase === "form" && <FormView />}
        {phase === "running" && <RunningView logIdx={logIdx} />}
        {phase === "results" && (
          <ResultsView gene={gene} highlightRank={highlightRank ?? null} />
        )}
      </div>
    </div>
  );
}

function FormView() {
  return (
    <div className="zc-panel" style={{ padding: 16 }} data-tour-id="zc-form">
      <div className="zc-h2" style={{ marginBottom: 10 }}>Design guide RNAs</div>

      <label className="zc-label" style={{ margin: "4px 0" }}>Gene name(s)</label>
      <textarea
        className="zc-textarea"
        readOnly
        style={{ minHeight: 60, fontSize: 12.5 }}
        value={"rx3\ntbx16\ntbxta"}
        data-tour-id="zc-genes"
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
        <div>
          <label className="zc-label" style={{ margin: "4px 0" }}>Genome</label>
          <select className="zc-select" defaultValue="danRer11" disabled>
            <option value="danRer11">danRer11 (GRCz11)</option>
          </select>
        </div>
        <div>
          <label className="zc-label" style={{ margin: "4px 0" }}>Mode</label>
          <select className="zc-select" defaultValue="cas9" disabled>
            <option value="cas9">Cas9</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 10 }}>
        <div>
          <label className="zc-label" style={{ margin: "4px 0" }}>Guide length</label>
          <input className="zc-input" readOnly defaultValue={20} type="number" />
        </div>
        <div>
          <label className="zc-label" style={{ margin: "4px 0" }}>Scoring</label>
          <select className="zc-select" defaultValue="DOENCH_2016" disabled>
            <option value="DOENCH_2016">Doench 2016</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button type="button" className="zc-btn" data-tour-id="zc-design-btn">Design guides</button>
        <button type="button" className="zc-btn zc-btn-secondary">Load sample</button>
      </div>
    </div>
  );
}

function RunningView({ logIdx }: { logIdx: number }) {
  const progress = Math.min(100, (logIdx / RUN_LINES.length) * 100);
  return (
    <div className="zc-panel" style={{ padding: 16 }}>
      <div className="zc-h2" style={{ marginBottom: 10 }}>Designing…</div>
      <div style={{ height: 6, background: "#eef2f7", borderRadius: 99, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            background: "var(--zc-accent)",
            width: `${progress}%`,
            transition: "width 0.25s",
          }}
        />
      </div>
      <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", fontSize: 13, fontFamily: "ui-monospace, monospace" }}>
        {RUN_LINES.map((s, i) => (
          <li
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 0",
              color: i < logIdx ? "var(--zc-muted)" : i === logIdx ? "var(--zc-text)" : "#cbd5e1",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background:
                  i < logIdx ? "#16a34a" : i === logIdx ? "var(--zc-accent)" : "#cbd5e1",
              }}
            />
            {i < logIdx ? <s>{s}</s> : s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultsView({
  gene,
  highlightRank,
}: {
  gene: (typeof genes)[number];
  highlightRank: number | null;
}) {
  return (
    <div className="zc-panel" style={{ padding: 16 }} data-tour-id="zc-results">
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
        data-tour-id="zc-tabs"
      >
        {genes.map((g) => (
          <span
            key={g.id}
            data-tour-id={`zc-tab-${g.id}`}
            className={cn("zc-gene-tab", gene.id === g.id && "zc-gene-tab-active")}
          >
            {g.symbol}
          </span>
        ))}
      </div>

      <div style={{ fontSize: 12, color: "var(--zc-muted)", marginBottom: 8 }}>
        {gene.description} · {gene.chrom} · {gene.guides.length} guides
      </div>

      <div style={{ overflowX: "auto" }} data-tour-id="zc-table">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr>
              {["#", "Target sequence", "GC%", "Off-target", "Efficiency"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "6px 8px",
                    borderBottom: "1px solid var(--zc-border)",
                    background: "#f8fafc",
                    fontSize: 10.5,
                    textTransform: "uppercase",
                    color: "var(--zc-muted)",
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {gene.guides.map((g) => {
              const active = g.rank === highlightRank;
              const off = g.mm0 + g.mm1 + g.mm2 + g.mm3;
              return (
                <tr
                  key={g.seq}
                  style={{
                    background: active ? "#e0f2fe" : "transparent",
                    borderBottom: "1px solid var(--zc-border)",
                    fontFamily: "ui-monospace, monospace",
                    boxShadow: active ? "inset 3px 0 0 var(--zc-accent)" : "none",
                  }}
                >
                  <td style={{ padding: "6px 8px", color: "var(--zc-muted)" }}>{g.rank}</td>
                  <td style={{ padding: "6px 8px" }}>{g.seq}</td>
                  <td style={{ padding: "6px 8px" }}>{g.gc}</td>
                  <td style={{ padding: "6px 8px", color: off === 0 ? "#16a34a" : "var(--zc-muted)" }}>
                    {off === 0 ? "0 (clean)" : off}
                  </td>
                  <td style={{ padding: "6px 8px", color: "var(--zc-accent-2)", fontWeight: 600 }}>
                    {g.efficiency.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
