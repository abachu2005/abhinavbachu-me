import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { scenarios, type MesChannel } from "@/data/mes";
import { cn } from "@/lib/cn";

export type MesPhase = "input" | "running" | "gauge" | "topo";

export type MesDemoProps = {
  phase: MesPhase;
  /** Highlight trial index (0-based) in the per-trial trace, e.g. for a "this is the best trial" callout. */
  highlightTrial?: number | null;
};

const STAGES = [
  "Loading EDF · resampling to 125 Hz…",
  "Mapping 64-ch → 16-ch sensorimotor montage…",
  "Epoching trials & ICA artifact reject…",
  "Computing bandpower (μ 8-13, β 13-30 Hz)…",
  "ERD / MRCP / lateralization / Riemannian…",
  "Scoring per-trial MES (calibrated 0-100)…",
];

export default function MesDemo({ phase, highlightTrial = null }: MesDemoProps) {
  const scenario = scenarios[0];

  // Animated progress + stage indexing during the "running" phase.
  const [progress, setProgress] = useState(0);
  const [stageIdx, setStageIdx] = useState(0);
  useEffect(() => {
    if (phase !== "running") {
      setProgress(0);
      setStageIdx(0);
      return;
    }
    let p = 0;
    let s = 0;
    const id = window.setInterval(() => {
      p = Math.min(100, p + 2.4);
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
    <div className="skin-mes overflow-hidden rounded-xl border border-[var(--mes-border)]">
      <header
        style={{
          padding: "14px 22px",
          background: "var(--mes-surface)",
          borderBottom: "1px solid var(--mes-border)",
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
              fontSize: 16,
              fontWeight: 600,
              color: "var(--mes-text)",
            }}
          >
            MES, Motor Engagement Signal
          </h3>
          <div style={{ color: "var(--mes-muted)", fontSize: 12, marginTop: 2 }}>
            EEG → per-trial engagement score · {scenario.config.channels}-ch · {scenario.config.sampleRate} Hz
          </div>
        </div>
        <span
          className={cn(
            "mes-badge",
            phase === "input" && "mes-badge-idle",
            phase === "running" && "mes-badge-running",
            (phase === "gauge" || phase === "topo") && "mes-badge-done")}
        >
          {phase === "input" ? "idle" : phase === "running" ? "running" : "done"}
        </span>
      </header>

      <div style={{ padding: 18, minHeight: 380 }}>
        {phase === "input" && <InputView scenario={scenario} />}
        {phase === "running" && <RunningView progress={progress} stageIdx={stageIdx} />}
        {phase === "gauge" && (
          <GaugeView scenario={scenario} highlightTrial={highlightTrial} />
        )}
        {phase === "topo" && <TopoView scenario={scenario} />}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 1. Input
// ----------------------------------------------------------------------------

function InputView({ scenario }: { scenario: (typeof scenarios)[number] }) {
  return (
    <div className="mes-card" data-tour-id="mes-form">
      <h2>Upload session</h2>

      <label className="mes-label">EEG recording (.edf / .bdf / .txt)</label>
      <div className="mes-file-drop has-file" data-tour-id="mes-file">
        <div style={{ color: "var(--mes-text)", fontSize: 13, fontWeight: 500 }}>
          P0042_session08_right-hand.edf
        </div>
        <div style={{ color: "var(--mes-muted)", fontSize: 11, marginTop: 2 }}>
          12.4 MB · 64-ch raw, will be mapped to the 16-ch montage
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 6 }}>
        <div>
          <label className="mes-label">Task</label>
          <select className="mes-select" defaultValue="right_hand" data-tour-id="mes-task">
            <option value="right_hand">{scenario.config.task}</option>
            <option value="left_hand">Left hand, motor imagery</option>
            <option value="feet">Feet, motor imagery</option>
            <option value="gait">Gait, motor imagery</option>
          </select>
        </div>
        <div>
          <label className="mes-label">Target limb</label>
          <input className="mes-input" readOnly value={scenario.config.targetLimb} />
        </div>
      </div>

      <label className="mes-label">Headset</label>
      <input className="mes-input" readOnly value={scenario.config.headset} />
      <p className="mes-hint">Spatially mapped to the 16-channel sensorimotor montage @ {scenario.config.sampleRate} Hz.</p>

      <button
        type="button"
        className="mes-btn"
        style={{ width: "100%", marginTop: 14 }}
        data-tour-id="mes-run-btn"
      >
        Upload &amp; process
      </button>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 2. Running
// ----------------------------------------------------------------------------

function RunningView({ progress, stageIdx }: { progress: number; stageIdx: number }) {
  return (
    <div className="mes-card">
      <h2>Processing · {Math.round(progress)}%</h2>
      <div className="mes-progress-track">
        <div className="mes-progress-fill" style={{ width: `${Math.max(2, progress)}%` }} />
        <div
          style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 600, color: "var(--mes-text)",
            pointerEvents: "none",
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
              display: "flex", alignItems: "center", gap: 10, padding: "6px 0",
              color: i < stageIdx ? "var(--mes-muted)" : i === stageIdx ? "var(--mes-text)" : "#adb5bd",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            <span
              style={{
                width: 8, height: 8, borderRadius: "50%",
                background: i < stageIdx ? "#198754" : i === stageIdx ? "var(--mes-accent)" : "#adb5bd",
              }}
            />
            {i < stageIdx ? <s>{s}</s> : s}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 3. Gauge + per-trial trace
// ----------------------------------------------------------------------------

function GaugeView({
  scenario,
  highlightTrial,
}: {
  scenario: (typeof scenarios)[number];
  highlightTrial: number | null;
}) {
  return (
    <div className="mes-card" data-tour-id="mes-gauge-card">
      <h2>Session report · {scenario.label.split(" · ")[0]}</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(180px, 220px) 1fr",
          gap: 22,
          alignItems: "center",
        }}
      >
        <div data-tour-id="mes-gauge">
          <Gauge value={scenario.mesMean} />
          <div
            style={{
              textAlign: "center",
              marginTop: 8,
              fontSize: 11,
              color: "var(--mes-muted)",
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Strong engagement
          </div>
        </div>

        <div data-tour-id="mes-trace">
          <div
            style={{
              fontSize: 11,
              color: "var(--mes-muted)",
              textTransform: "uppercase",
              letterSpacing: 0.6,
              marginBottom: 6,
              fontWeight: 600,
            }}
          >
            MES across {scenario.nTrials} trials
          </div>
          <Trace values={scenario.mesPerTrial} highlight={highlightTrial} />
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <PillStat k="median" v={scenario.mesMedian.toFixed(1)} />
            <PillStat k="std" v={scenario.mesStd.toFixed(1)} />
            <PillStat k="trials" v={String(scenario.nTrials)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  const fill =
    v >= 70 ? "#c2410c" : v >= 40 ? "#ea580c" : v >= 20 ? "#f59e0b" : "#9ca3af";
  const CIRC = 2 * Math.PI * 42;
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 200, aspectRatio: "1 / 1", margin: "0 auto" }}>
      <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%" }}>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#e9ecef" strokeWidth="9" />
        <motion.circle
          cx="50" cy="50" r="42" fill="none" stroke={fill} strokeWidth="9" strokeLinecap="round"
          transform="rotate(-90 50 50)"
          initial={{ strokeDasharray: `0 ${CIRC}` }}
          animate={{ strokeDasharray: `${(v / 100) * CIRC} ${CIRC}` }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />
      </svg>
      <div
        style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 700, color: "var(--mes-text)", lineHeight: 1 }}>
          {v.toFixed(1)}
        </div>
        <div
          style={{
            fontSize: 10, textTransform: "uppercase", letterSpacing: 1.2,
            color: "var(--mes-muted)", marginTop: 4, fontWeight: 600,
          }}
        >
          MES
        </div>
      </div>
    </div>
  );
}

function Trace({ values, highlight }: { values: number[]; highlight: number | null }) {
  const W = 320;
  const H = 110;
  const PAD = 8;
  const xs = values.map((_, i) => PAD + (i * (W - 2 * PAD)) / (values.length - 1));
  const ys = values.map((v) => PAD + (1 - v / 100) * (H - 2 * PAD));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${ys[i].toFixed(2)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: H, display: "block" }}>
      <line x1={PAD} x2={W - PAD} y1={PAD + (H - 2 * PAD) / 2} y2={PAD + (H - 2 * PAD) / 2}
        stroke="#dee2e6" strokeDasharray="3 3" />
      <motion.path
        d={path}
        fill="none"
        stroke="#c2410c"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      {xs.map((x, i) => (
        <circle
          key={i} cx={x} cy={ys[i]}
          r={highlight === i ? 4 : 2.4}
          stroke="#c2410c" strokeWidth={1.6} fill="#fff"
        />
      ))}
      {[0, 50, 100].map((tick) => (
        <text key={tick}
          x={2} y={PAD + (1 - tick / 100) * (H - 2 * PAD) + 3}
          fontSize={8} fill="#94a3b8"
          fontFamily="ui-monospace, monospace"
        >{tick}</text>
      ))}
    </svg>
  );
}

function PillStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="mes-pill-stat">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 4. Topomap + lateralization
// ----------------------------------------------------------------------------

function TopoView({ scenario }: { scenario: (typeof scenarios)[number] }) {
  return (
    <div className="mes-card" data-tour-id="mes-topo-card">
      <h2>Neural signatures</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(200px, 240px) 1fr",
          gap: 22,
          alignItems: "center",
        }}
      >
        <div data-tour-id="mes-topo">
          <Topomap channels={scenario.topomap} />
          <div
            style={{
              marginTop: 8,
              textAlign: "center",
              fontSize: 11,
              color: "var(--mes-muted)",
              textTransform: "uppercase",
              letterSpacing: 0.6,
              fontWeight: 600,
            }}
          >
            μ-band ERD topomap
          </div>
        </div>

        <div data-tour-id="mes-lateral">
          <div
            style={{
              fontSize: 11,
              color: "var(--mes-muted)",
              textTransform: "uppercase",
              letterSpacing: 0.6,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Lateralization index
          </div>
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: "var(--mes-accent)",
              lineHeight: 1,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            {(scenario.lateralization >= 0 ? "+" : "") +
              scenario.lateralization.toFixed(2)}
          </div>
          <LateralBar v={scenario.lateralization} />
          <p
            style={{
              marginTop: 10,
              fontSize: 12,
              color: "var(--mes-muted)",
              lineHeight: 1.5,
            }}
          >
            +1 = full contralateral dominance, −1 = ipsilateral.
            Right-hand imagery should drive the <b>left</b> motor strip, and it does.
          </p>
        </div>
      </div>
    </div>
  );
}

// RdBu_r-ish diverging palette (low = blue, mid = white, high = red).
const STOPS = [
  "#053061", "#2166ac", "#4393c3", "#92c5de", "#f7f7f7",
  "#f4a582", "#d6604d", "#b2182b", "#67001f",
];

function hex(h: string): [number, number, number] {
  const v = h.replace("#", "");
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

function lerpColor(t: number): string {
  const x = Math.max(0, Math.min(1, t)) * (STOPS.length - 1);
  const i = Math.floor(x);
  const f = x - i;
  if (i >= STOPS.length - 1) return STOPS[STOPS.length - 1];
  const a = hex(STOPS[i]);
  const b = hex(STOPS[i + 1]);
  return `rgb(${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)})`;
}

function Topomap({ channels }: { channels: MesChannel[] }) {
  // ERD values are negative for activation; invert so that "more activation" reads warm.
  const vals = channels.map((c) => -c.value);
  const vmin = Math.min(...vals, -1);
  const vmax = Math.max(...vals, 1);
  const range = Math.max(1e-6, vmax - vmin);
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 220, aspectRatio: "1 / 1", margin: "0 auto" }}>
      <svg viewBox="-1.25 -1.25 2.5 2.5" style={{ width: "100%", height: "100%" }}>
        <circle cx="0" cy="0" r="1" fill="#fafbfc" stroke="#cbd5e1" strokeWidth="0.02" />
        <path d="M -0.1 1 L 0 1.12 L 0.1 1" fill="none" stroke="#cbd5e1" strokeWidth="0.02" />
        <ellipse cx="-1" cy="0" rx="0.06" ry="0.18" fill="none" stroke="#cbd5e1" strokeWidth="0.02" />
        <ellipse cx="1"  cy="0" rx="0.06" ry="0.18" fill="none" stroke="#cbd5e1" strokeWidth="0.02" />
        {channels.map((c, i) => {
          const t = (vals[i] - vmin) / range;
          return (
            <g key={c.channel}>
              <circle cx={c.x} cy={c.y} r="0.11"
                fill={lerpColor(t)} stroke="#1f2933" strokeWidth="0.012" />
              <text x={c.x} y={c.y + 0.025} fontSize="0.085" textAnchor="middle"
                fill={t > 0.25 && t < 0.75 ? "#1f2933" : "white"}
                fontFamily="ui-sans-serif" fontWeight="600">
                {c.channel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function LateralBar({ v }: { v: number }) {
  const clamped = Math.max(-1, Math.min(1, v));
  const pct = clamped * 50; // signed percent from center
  return (
    <div style={{ marginTop: 10 }}>
      <div
        style={{
          position: "relative", height: 10, background: "#e9ecef",
          borderRadius: 99, overflow: "hidden",
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.abs(pct)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{
            position: "absolute", top: 0, bottom: 0,
            background: "var(--mes-accent)",
            left: clamped >= 0 ? "50%" : undefined,
            right: clamped < 0 ? "50%" : undefined,
          }}
        />
        <div style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: 1, background: "#9ca3af" }} />
      </div>
      <div
        style={{
          display: "flex", justifyContent: "space-between",
          fontSize: 10, color: "var(--mes-muted)", marginTop: 3,
          fontFamily: "ui-monospace, monospace",
        }}
      >
        <span>ipsi −1</span><span>0</span><span>contra +1</span>
      </div>
    </div>
  );
}
