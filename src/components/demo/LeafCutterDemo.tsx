import { useEffect, useMemo, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import JunctionTrack from "@/components/demo/JunctionTrack";
import { scenarios, type Hit } from "@/data/leafcutter";
import { cn } from "@/lib/cn";

const SIG = 1.3;
const DPSI = 0.2;

export type LeafCutterPhase = "submit" | "running" | "volcano" | "junction";

export type LeafCutterDemoProps = {
  phase: LeafCutterPhase;
  highlightGene?: string | null;
};

const STAGES = [
  "QC + adapter trimming…",
  "STAR alignment…",
  "LeafCutter2 intron clustering…",
  "Classifying PR / UP / NE / IN…",
  "Quasi-binomial GLM + NMD rerank…",
];

export default function LeafCutterDemo({
  phase,
  highlightGene,
}: LeafCutterDemoProps) {
  const scenario = scenarios[0];
  const sortedHits = useMemo(
    () => [...scenario.hits].sort((a, b) => b.negLog10P - a.negLog10P),
    [scenario.hits]);
  const defaultHit = sortedHits.find((h) => h.flag === "high-confidence");
  const hit: Hit | undefined =
    sortedHits.find((h) => h.gene === highlightGene) ?? defaultHit;

  const [stageIdx, setStageIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (phase !== "running") {
      setStageIdx(0);
      setProgress(0);
      return;
    }
    let p = 0;
    let s = 0;
    const id = window.setInterval(() => {
      p = Math.min(100, p + 3);
      setProgress(p);
      const newS = Math.min(STAGES.length - 1, Math.floor((p / 100) * STAGES.length));
      if (newS !== s) {
        s = newS;
        setStageIdx(newS);
      }
      if (p >= 100) window.clearInterval(id);
    }, 60);
    return () => window.clearInterval(id);
  }, [phase]);

  return (
    <div className="skin-leafcutter overflow-hidden rounded-xl border border-[var(--lc-border)]">
      <header
        style={{
          padding: "14px 22px",
          background: "var(--lc-surface)",
          borderBottom: "1px solid var(--lc-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={{ margin: 0, fontFamily: "inherit", fontSize: 16, fontWeight: 600, color: "var(--lc-text)" }}>
            LeafCutter Pipeline
          </h3>
          <div style={{ color: "var(--lc-muted)", fontSize: 12 }}>
            Submit junction data, run locally or on Slurm, view results
          </div>
        </div>
        <span
          className={cn(
            "lc-badge",
            phase === "submit" && "lc-badge-queued",
            phase === "running" && "lc-badge-running",
            (phase === "volcano" || phase === "junction") && "lc-badge-succeeded")}
        >
          {phase === "submit"
            ? "ready"
            : phase === "running"
              ? "running"
              : "succeeded"}
        </span>
      </header>

      <div style={{ padding: 18, minHeight: 380 }}>
        {phase === "submit" && <SubmitView scenario={scenario} />}
        {phase === "running" && (
          <RunningView progress={progress} stageIdx={stageIdx} />
        )}
        {phase === "volcano" && (
          <VolcanoView hits={sortedHits} selectedGene={hit?.gene ?? null} />
        )}
        {phase === "junction" && hit && (
          <JunctionView hit={hit} scenario={scenario} />
        )}
      </div>
    </div>
  );
}

function SubmitView({ scenario }: { scenario: (typeof scenarios)[number] }) {
  return (
    <div className="lc-card" style={{ marginBottom: 0 }} data-tour-id="lc-form">
      <h2>Pipeline Inputs</h2>
      <label className="lc-label">Comparison</label>
      <div
        data-tour-id="lc-comparison"
        style={{
          padding: 12,
          border: "2px solid var(--lc-accent)",
          background: "#e7f0ff",
          borderRadius: 6,
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        {scenario.label}
        <div
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "var(--lc-muted)",
            marginTop: 4,
          }}
        >
          {scenario.description}
        </div>
      </div>

      <label className="lc-label">STAR SJ.out.tab files</label>
      <input
        className="lc-input"
        readOnly
        value={`${scenario.conditionA}.SJ.out.tab, ${scenario.conditionB}.SJ.out.tab`}
      />
      <p className="lc-hint">Splice-junction output from the STAR aligner.</p>

      <label className="lc-label">Samples TSV</label>
      <input className="lc-input" readOnly value="samples.tsv" />
      <p className="lc-hint">Two-column file mapping each sample to its condition.</p>

      <button
        type="button"
        className="lc-btn"
        style={{ width: "100%", marginTop: 14 }}
        data-tour-id="lc-submit-btn"
      >
        Submit Job
      </button>
    </div>
  );
}

function RunningView({ progress, stageIdx }: { progress: number; stageIdx: number }) {
  return (
    <div className="lc-card" style={{ marginBottom: 0 }}>
      <h2>Job · running</h2>
      <div className="lc-progress-track">
        <div
          className="lc-progress-fill"
          style={{ width: `${Math.max(2, progress)}%` }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {Math.round(progress)}%
        </div>
      </div>
      <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none", fontSize: 13 }}>
        {STAGES.map((s, i) => (
          <li
            key={s}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 0",
              color: i < stageIdx ? "var(--lc-muted)" : i === stageIdx ? "var(--lc-text)" : "#adb5bd",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background:
                  i < stageIdx
                    ? "#198754"
                    : i === stageIdx
                      ? "var(--lc-accent)"
                      : "#adb5bd",
              }}
            />
            {i < stageIdx ? <s>{s}</s> : s}
          </li>
        ))}
      </ul>
    </div>
  );
}

function VolcanoView({ hits, selectedGene }: { hits: Hit[]; selectedGene: string | null }) {
  const data = hits.map((h) => ({
    gene: h.gene,
    x: h.dPsi,
    y: h.negLog10P,
    sig: h.negLog10P >= SIG && Math.abs(h.dPsi) >= DPSI,
    flag: h.flag,
  }));
  return (
    <div className="lc-card" style={{ marginBottom: 0 }} data-tour-id="lc-volcano">
      <h2>Results · Volcano plot</h2>
      <div style={{ height: 280, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 12, right: 16, bottom: 28, left: 4 }}>
            <XAxis
              type="number"
              dataKey="x"
              domain={[-0.7, 0.7]}
              tick={{ fontSize: 11, fill: "#6c757d" }}
              tickLine={false}
              axisLine={{ stroke: "#dee2e6" }}
              label={{ value: "ΔPSI (B − A)", position: "insideBottom", offset: -8, style: { fontSize: 11, fill: "#6c757d" } }}
            />
            <YAxis
              type="number"
              dataKey="y"
              tick={{ fontSize: 11, fill: "#6c757d" }}
              tickLine={false}
              axisLine={{ stroke: "#dee2e6" }}
              label={{ value: "−log₁₀(padj)", angle: -90, position: "insideLeft", offset: 16, style: { fontSize: 11, fill: "#6c757d", textAnchor: "middle" } }}
            />
            <ZAxis range={[42, 42]} />
            <ReferenceLine y={SIG} stroke="#dee2e6" strokeDasharray="3 3" />
            <ReferenceLine x={-DPSI} stroke="#dee2e6" strokeDasharray="3 3" />
            <ReferenceLine x={DPSI} stroke="#dee2e6" strokeDasharray="3 3" />
            <Tooltip
              contentStyle={{ background: "white", border: "1px solid #dee2e6", borderRadius: 4, fontSize: 12 }}
              formatter={((value: number, name: string) =>
                name === "x" ? [value.toFixed(2), "ΔPSI"] : [value.toFixed(2), "−log₁₀p"]) as never}
              labelFormatter={((_: unknown, payload: { payload?: { gene?: string } }[]) =>
                payload?.[0]?.payload?.gene ?? "") as never}
            />
            <Scatter data={data}>
              {data.map((d) => (
                <Cell
                  key={d.gene}
                  fill={
                    d.gene === selectedGene
                      ? "#0b5ed7"
                      : d.flag === "high-confidence"
                        ? "#0d6efd"
                        : d.sig
                          ? "#6ea8fe"
                          : "#adb5bd"
                  }
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <p style={{ margin: "6px 0 0", fontSize: 11, color: "var(--lc-muted)" }}>
        Each dot is one gene. Dots in the upper-right and upper-left corners are the most interesting hits.
      </p>
    </div>
  );
}

function JunctionView({
  hit,
  scenario,
}: {
  hit: Hit;
  scenario: (typeof scenarios)[number];
}) {
  return (
    <div className="lc-card" style={{ marginBottom: 0 }} data-tour-id="lc-junction">
      <h2>Junction view · {hit.gene}</h2>
      <div style={{ display: "flex", gap: 16, fontSize: 12, marginBottom: 12 }}>
        <Stat label="gene" value={hit.gene} />
        <Stat label="ΔPSI" value={`${hit.dPsi >= 0 ? "+" : ""}${hit.dPsi.toFixed(2)}`} />
        <Stat label="−log₁₀p" value={hit.negLog10P.toFixed(2)} />
        <Stat label="reads" value={`${hit.readsA} → ${hit.readsB}`} />
      </div>
      <JunctionTrack hit={hit} />
      <p style={{ marginTop: 10, fontSize: 12, color: "var(--lc-muted)" }}>
        The poison exon is the highlighted block. The thick arc skipping it
        is the healthy transcript; the two thinner arcs going through it
        produce the unstable NMD-target isoform, which is{" "}
        {hit.dPsi >= 0 ? "higher" : "lower"} in {scenario.conditionB} than{" "}
        {scenario.conditionA}.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, textTransform: "uppercase", color: "var(--lc-muted)", letterSpacing: 0.5 }}>
        {label}
      </div>
      <div style={{ fontFamily: "ui-monospace, monospace", fontWeight: 600 }}>{value}</div>
    </div>
  );
}
