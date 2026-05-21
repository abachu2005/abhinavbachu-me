// Demo scenario for the MES (Motor Engagement Signal) personal-site demo.
// Mirrors the real MES app on localhost: an EEG recording of right-hand motor
// imagery (16-channel sensorimotor montage @ 125 Hz), with per-trial MES
// values, an ERD scalp topomap, and a lateralization index.

export type MesChannel = {
  // Sensor name (10-20 nomenclature)
  channel: string;
  // Head-circle coordinates (unit disk, +x = right ear, +y = nose)
  x: number;
  y: number;
  // ERD value in [-1, 1]: negative = desynchronization (task activation),
  // positive = synchronization (resting / suppression).
  value: number;
};

export type MesScenario = {
  id: string;
  label: string;
  description: string;
  config: {
    task: string;
    targetLimb: string;
    headset: string;
    sampleRate: number;
    channels: number;
    bands: string;
  };
  // 24 per-trial MES values (0-100). Healthy right-hand MI → strong, stable engagement.
  mesPerTrial: number[];
  mesMean: number;
  mesMedian: number;
  mesStd: number;
  nTrials: number;
  lateralization: number; // [-1, +1], positive = contralateral dominance
  // ERD scalp topomap on the production 16-ch montage.
  topomap: MesChannel[];
};

// Production OpenBCI Cyton+Daisy sensorimotor montage, laid out on the unit
// head circle. (Approximations of standard 10-20 positions.)
const MONTAGE: Array<Omit<MesChannel, "value">> = [
  { channel: "Fpz", x: 0.00, y: 0.95 },
  { channel: "Fz",  x: 0.00, y: 0.45 },
  { channel: "FC3", x: -0.30, y: 0.25 },
  { channel: "FCz", x: 0.00, y: 0.22 },
  { channel: "FC4", x: 0.30, y: 0.25 },
  { channel: "C3",  x: -0.42, y: 0.00 },
  { channel: "C1",  x: -0.18, y: 0.00 },
  { channel: "Cz",  x: 0.00, y: 0.00 },
  { channel: "C2",  x: 0.18, y: 0.00 },
  { channel: "C4",  x: 0.42, y: 0.00 },
  { channel: "CP3", x: -0.30, y: -0.25 },
  { channel: "CPz", x: 0.00, y: -0.22 },
  { channel: "CP4", x: 0.30, y: -0.25 },
  { channel: "T7",  x: -0.85, y: 0.00 },
  { channel: "T8",  x: 0.85, y: 0.00 },
  { channel: "Pz",  x: 0.00, y: -0.55 },
];

// Hand-tuned ERD pattern for a right-hand motor-imagery trial:
// big negative (red) over the LEFT motor strip (C3, C1, FC3, CP3),
// near-zero on midline, weak positive on the right hemisphere.
const ERD_VALUES: Record<string, number> = {
  Fpz: 0.05, Fz: -0.08, FC3: -0.55, FCz: -0.18, FC4: -0.05,
  C3:  -0.92, C1: -0.62, Cz: -0.28, C2: -0.05, C4: 0.08,
  CP3: -0.48, CPz: -0.12, CP4: 0.02, T7: -0.10, T8: 0.10, Pz: -0.05,
};

// 24 per-trial MES values for a typical strong-engagement session.
// Mean ~72, std ~9, slight upward trend across the session.
const MES_PER_TRIAL = [
  58.4, 62.1, 65.7, 68.0, 60.5, 70.2, 73.8, 71.4,
  66.9, 75.1, 78.2, 72.6, 69.8, 74.5, 80.1, 76.3,
  71.0, 73.9, 77.4, 82.0, 79.6, 75.8, 78.1, 81.3,
];

function mean(xs: number[]) { return xs.reduce((a, b) => a + b, 0) / xs.length; }
function std(xs: number[]) {
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
}
function median(xs: number[]) {
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export const scenarios: MesScenario[] = [
  {
    id: "p0042-right-hand",
    label: "P-0042 · right-hand motor imagery",
    description:
      "Healthy participant, 24 trials of cued right-hand grasp imagery. " +
      "Strong contralateral ERD over the left motor strip; stable MES around 72/100.",
    config: {
      task: "Right hand — motor imagery",
      targetLimb: "Right hand",
      headset: "OpenBCI Cyton+Daisy",
      sampleRate: 125,
      channels: 16,
      bands: "mu (8-13 Hz), beta (13-30 Hz)",
    },
    mesPerTrial: MES_PER_TRIAL,
    mesMean: mean(MES_PER_TRIAL),
    mesMedian: median(MES_PER_TRIAL),
    mesStd: std(MES_PER_TRIAL),
    nTrials: MES_PER_TRIAL.length,
    lateralization: 0.48,
    topomap: MONTAGE.map((m) => ({ ...m, value: ERD_VALUES[m.channel] ?? 0 })),
  },
];
