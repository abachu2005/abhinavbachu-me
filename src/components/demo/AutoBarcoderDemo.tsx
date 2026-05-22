import { useEffect, useMemo, useState } from "react";
import { scenarios, type Well } from "@/data/autobarcoder";
import { cn } from "@/lib/cn";

export type AutoBarcoderPhase = "input" | "running" | "results";

export type AutoBarcoderDemoProps = {
  phase: AutoBarcoderPhase;
  /** Which well to highlight in results mode (null = nothing selected) */
  highlightWell?: { row: string; col: string } | null;
  /** Visually pulse the input panel (used in "intro" steps) */
  pulseInput?: boolean;
  /** Visually pulse the well grid (used when explaining the grid) */
  pulseGrid?: boolean;
};

const RUN_LINES = [
  "[OK]  Demultiplexing reads…",
  "[OK]  Extracting barcodes between flanks…",
  "[OK]  Clustering by Levenshtein distance…",
  "[OK]  Writing per-well summary…",
];

export default function AutoBarcoderDemo({
  phase,
  highlightWell,
  pulseInput,
  pulseGrid,
}: AutoBarcoderDemoProps) {
  const scenario = scenarios[0];
  // Running phase: animate the log lines
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
    }, 380);
    return () => window.clearInterval(id);
  }, [phase]);

  const highlighted = useMemo(() => {
    if (!highlightWell) return null;
    return (
      scenario.wells.find(
        (w) => w.row === highlightWell.row && w.col === highlightWell.col) ?? null
    );
  }, [highlightWell, scenario.wells]);

  return (
    <div className="skin-autobarcoder overflow-hidden rounded-xl border border-[var(--ab-border)]">
      {/* Header */}
      <header
        style={{
          padding: "14px 22px",
          borderBottom: "1px solid var(--ab-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontFamily: "inherit",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--ab-text)",
            }}
          >
            AutoBarcoder
          </h3>
          <div style={{ color: "var(--ab-muted)", fontSize: 11, marginTop: 2 }}>
            96-well plate RNA barcode demultiplexing &amp; clustering
          </div>
        </div>
        <span
          className={cn(
            "ab-pill",
            phase === "running" && "ab-pill-running",
            phase === "results" && "ab-pill-done")}
        >
          {phase === "input" ? "idle" : phase === "running" ? "running" : "done"}
        </span>
      </header>

      <div style={{ padding: 18, minHeight: 360 }}>
        {phase === "input" && (
          <InputView pulse={pulseInput} scenario={scenario} />
        )}
        {phase === "running" && <RunningView logIdx={logIdx} />}
        {phase === "results" && (
          <ResultsView
            scenario={scenario}
            highlighted={highlighted}
            pulseGrid={pulseGrid}
          />
        )}
      </div>
    </div>
  );
}

function InputView({
  pulse,
  scenario,
}: {
  pulse?: boolean;
  scenario: (typeof scenarios)[number];
}) {
  return (
    <div
      className={cn("ab-panel", pulse && "v-glow")}
      style={{ borderRadius: 8, padding: 16 }}
      data-tour-id="ab-input-panel"
    >
      <div className="ab-h2" style={{ marginBottom: 10 }}>
        Input
      </div>

      <label className="ab-label" style={{ margin: "0 0 4px" }}>
        Sequencing data (.fastq / .txt)
      </label>
      <div
        className="ab-file-drop has-file"
        style={{ padding: 12 }}
        data-tour-id="ab-file"
      >
        <div style={{ color: "var(--ab-text)", fontSize: 12.5 }}>
          sample_reads.txt, {scenario.totalReads} reads
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginTop: 12,
        }}
        data-tour-id="ab-barcodes"
      >
        <div>
          <label className="ab-label" style={{ margin: "4px 0" }}>
            Row barcodes
          </label>
          <textarea
            readOnly
            className="ab-textarea"
            style={{ minHeight: 64, fontSize: 11.5 }}
            value={scenario.config.rows.join("\n")}
          />
        </div>
        <div>
          <label className="ab-label" style={{ margin: "4px 0" }}>
            Column barcodes
          </label>
          <textarea
            readOnly
            className="ab-textarea"
            style={{ minHeight: 64, fontSize: 11.5 }}
            value={scenario.config.columns.join("\n")}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 10,
          marginTop: 10,
        }}
      >
        <Field label="5′ flank" value={scenario.config.startFlank} />
        <Field label="3′ flank" value={scenario.config.endFlank} />
        <Field label="bc length" value={scenario.config.expectedLen.toString()} />
        <Field
          label="edit tol"
          value={`±${scenario.config.distanceThreshold}`}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
        <button
          type="button"
          className="ab-btn"
          data-tour-id="ab-run-btn"
        >
          Run analysis
        </button>
        <button
          type="button"
          className="ab-btn ab-btn-secondary"
        >
          Try with sample data
        </button>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="ab-label" style={{ margin: "4px 0" }}>
        {label}
      </label>
      <input className="ab-input" readOnly value={value} style={{ fontSize: 12 }} />
    </div>
  );
}

function RunningView({ logIdx }: { logIdx: number }) {
  const progress = Math.min(100, (logIdx / RUN_LINES.length) * 100);
  return (
    <div className="ab-panel" style={{ borderRadius: 8, padding: 16 }}>
      <div className="ab-h2" style={{ marginBottom: 10 }}>
        Results
      </div>
      <div className="ab-progress" style={{ marginBottom: 14 }}>
        <div
          style={{
            height: "100%",
            background: "var(--ab-accent)",
            width: `${progress}%`,
            transition: "width 0.25s",
          }}
        />
      </div>
      <pre
        style={{
          margin: 0,
          background: "var(--ab-panel-2)",
          border: "1px solid var(--ab-border)",
          borderRadius: 6,
          padding: 14,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 12,
          minHeight: 160,
          color: "var(--ab-text)",
          lineHeight: 1.7,
        }}
      >
        {RUN_LINES.slice(0, logIdx + 1).map((l, i) => (
          <div
            key={i}
            style={{
              color:
                i < logIdx
                  ? "#86efac"
                  : i === logIdx
                    ? "var(--ab-text)"
                    : "var(--ab-muted)",
            }}
          >
            {l}
          </div>
        ))}
        {logIdx < RUN_LINES.length && (
          <div style={{ color: "var(--ab-muted)" }}>
            <span style={{ display: "inline-block", animation: "blink 1s steps(2) infinite" }}>▎</span>
          </div>
        )}
        <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
      </pre>
    </div>
  );
}

function ResultsView({
  scenario,
  highlighted,
  pulseGrid,
}: {
  scenario: (typeof scenarios)[number];
  highlighted: Well | null;
  pulseGrid?: boolean;
}) {
  const rows = scenario.config.rows;
  const cols = scenario.config.columns;
  return (
    <div className="ab-panel" style={{ borderRadius: 8, padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div className="ab-h2" style={{ marginBottom: 0 }}>
          Per-well coverage map
        </div>
        <div style={{ fontSize: 11, color: "var(--ab-muted)" }}>
          {scenario.totalReads} reads · {scenario.wells.length} wells
        </div>
      </div>

      <div
        className={cn(pulseGrid && "v-glow")}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols.length}, 1fr)`,
          gap: 4,
          maxWidth: 360,
        }}
        data-tour-id="ab-grid"
      >
        {scenario.wells.map((w) => {
          const isSelected =
            highlighted?.row === w.row && highlighted?.col === w.col;
          const flagged = w.flag === "low-coverage";
          const label = `${String.fromCharCode(65 + rows.indexOf(w.row))}${cols.indexOf(w.col) + 1}`;
          return (
            <div
              key={`${w.row}-${w.col}`}
              title={`${w.row} × ${w.col}, ${w.totalReads} reads`}
              data-tour-id={`ab-well-${label}`}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 4,
                background: flagged ? "#4a1f1f" : "#1f4a2c",
                border: isSelected
                  ? "2px solid var(--ab-accent)"
                  : "2px solid transparent",
                color: "var(--ab-text)",
                fontSize: 9,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isSelected
                  ? "0 0 0 4px rgba(59, 130, 246, 0.25)"
                  : "none",
                transition: "box-shadow 0.2s, border-color 0.2s",
              }}
            >
              {label}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 14, marginTop: 14, fontSize: 11, color: "var(--ab-muted)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "#1f4a2c" }} />
          clean
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "#4a1f1f" }} />
          contaminated
        </span>
      </div>

      {highlighted && (
        <div
          data-tour-id="ab-variants"
          style={{
            background: "var(--ab-panel-2)",
            border: "1px solid var(--ab-border)",
            borderRadius: 6,
            padding: 12,
            marginTop: 14,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 12,
            color: "var(--ab-text)",
            lineHeight: 1.6,
          }}
        >
          <div style={{ marginBottom: 6 }}>
            <b>
              {String.fromCharCode(65 + rows.indexOf(highlighted.row))}
              {cols.indexOf(highlighted.col) + 1}
            </b>{" "}
            (row={highlighted.row}, col={highlighted.col}) ·{" "}
            {highlighted.totalReads} reads
            {highlighted.flag === "low-coverage" && (
              <span style={{ color: "#fca5a5", marginLeft: 8 }}>
                contaminated
              </span>
            )}
          </div>
          {highlighted.flag === "low-coverage" ? (
            <i style={{ color: "var(--ab-muted)" }}>
              contaminated, no high-confidence barcodes
            </i>
          ) : (
            highlighted.variants.map((v) => (
              <div key={v.seq}>
                {v.seq}, {v.pct.toFixed(2)}%
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
