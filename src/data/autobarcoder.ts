// Demo scenarios for AutoBarcoder.
// Shape mirrors a real run: 4-row x 4-column plate, each well = top barcode variants
// with read counts + percentages. Inspired by AutoBarcoder-OS sample_data/.

export type Variant = { seq: string; count: number; pct: number };
export type Well = {
  row: string;
  col: string;
  totalReads: number;
  variants: Variant[];
  flag?: "low-coverage" | "low-diversity";
};

export type AutoBarcoderScenario = {
  id: string;
  label: string;
  description: string;
  config: {
    rows: string[];
    columns: string[];
    startFlank: string;
    endFlank: string;
    expectedLen: number;
    distanceThreshold: number;
  };
  totalReads: number;
  wells: Well[];
  fastaPreview: string[];
};

const cleanConfig = {
  rows: ["AAACGT", "AATTGG", "ACGTAC", "ACTGAA"],
  columns: ["CCGTAA", "CCGGTT", "CGAGCT", "CTACGG"],
  startFlank: "CAGCTG",
  endFlank: "GGATCC",
  expectedLen: 8,
  distanceThreshold: 2,
};

// Deterministic pseudo-random for reproducible "real-looking" data.
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ALPHABET = ["A", "C", "G", "T"];
function randomSeq(rng: () => number, len: number) {
  let s = "";
  for (let i = 0; i < len; i++) s += ALPHABET[Math.floor(rng() * 4)];
  return s;
}

function buildWells(opts: {
  rows: string[];
  cols: string[];
  baseReads: number;
  noiseProfile: "clean" | "noisy";
  seed: number;
}): Well[] {
  const rng = mulberry32(opts.seed);
  const wells: Well[] = [];
  for (const r of opts.rows) {
    for (const c of opts.cols) {
      const isNoisy = opts.noiseProfile === "noisy";
      // Random total reads with some scatter; noisy scenario has more dropouts.
      const dropChance = isNoisy ? 0.18 : 0.04;
      const dropped = rng() < dropChance;
      const totalReads = dropped
        ? Math.floor(opts.baseReads * (0.05 + rng() * 0.15))
        : Math.floor(opts.baseReads * (0.85 + rng() * 0.3));

      // Two dominant variants + a low-rate noise tail.
      const top1 = randomSeq(rng, 8);
      const top2 = randomSeq(rng, 8);
      const top3 = randomSeq(rng, 8);

      let top1Pct =
        isNoisy && rng() < 0.25
          ? 0.42 + rng() * 0.18
          : 0.58 + rng() * 0.22;
      let top2Pct = (1 - top1Pct) * (0.55 + rng() * 0.25);
      let top3Pct = (1 - top1Pct - top2Pct) * (0.4 + rng() * 0.4);
      const tail = 1 - top1Pct - top2Pct - top3Pct;

      // Renormalize so percentages sum to 100.
      const sum = top1Pct + top2Pct + top3Pct + tail;
      top1Pct /= sum;
      top2Pct /= sum;
      top3Pct /= sum;

      const variants: Variant[] = [
        {
          seq: top1,
          count: Math.round(totalReads * top1Pct),
          pct: +(top1Pct * 100).toFixed(1),
        },
        {
          seq: top2,
          count: Math.round(totalReads * top2Pct),
          pct: +(top2Pct * 100).toFixed(1),
        },
        {
          seq: top3,
          count: Math.round(totalReads * top3Pct),
          pct: +(top3Pct * 100).toFixed(1),
        },
      ];

      const flag: Well["flag"] = dropped
        ? "low-coverage"
        : top1Pct > 0.85
          ? "low-diversity"
          : undefined;

      wells.push({ row: r, col: c, totalReads, variants, flag });
    }
  }
  return wells;
}

const fastaCleanPreview = [
  "NNNAATTGGNNNCAGCTGAATGTTTAGGATCCNNCCGTAANN",
  "NNNAAACGTNNNCAGCTGACCTATTTGGATCCNNCGAGCTNN",
  "NNNACGTACNNNCAGCTGTCGTAGGCGGATCCNNCCGTAANN",
  "NNNACTGAANNNCAGCTGCCGCAACGGGATCCNNCTACGGNN",
  "NNNAATTGGNNNCAGCTGGCGTGAATGGATCCNNCGAGCTNN",
  "NNNAAACGTNNNCAGCTGTCGTCCGTGGATCCNNCTACGGNN",
];

const fastaNoisyPreview = [
  "NNNAAACGTNNNCAGCTGACTTATCGGGATCCNNCCGGTTNN",
  "NNNAAAGGTNNNCAGCTGACTTATCGGGATCCNNCCGGTTNN  # 1-nt row error",
  "NNNACGTACNNNCAGCTGTTACTTATGGATCCNNCGAGCTNN",
  "NNNACTGAANNNCAGCNGCCGCAACGGGATCCNNCTACGGNN  # flank mismatch",
  "NNNAATTGGNNNCAGCTGGCGTGAATGGATCCNNCGAACCTNN # 1-nt col error",
  "NNNACGTACNNNCAGCTGTGCTGGTNGGATCCNNCGAGCTNN  # N in barcode",
];

export const scenarios: AutoBarcoderScenario[] = [
  {
    id: "clean",
    label: "Single 4×4 plate · clean reads",
    description:
      "16 wells, ~25 reads each, two dominant barcodes per well with light edit noise.",
    config: cleanConfig,
    totalReads: 345,
    wells: buildWells({
      rows: cleanConfig.rows,
      cols: cleanConfig.columns,
      baseReads: 22,
      noiseProfile: "clean",
      seed: 1234,
    }),
    fastaPreview: fastaCleanPreview,
  },
  {
    id: "noisy",
    label: "Multi-plate · with dropouts",
    description:
      "Same plate, but with a handful of low-coverage wells and pipetting errors that show up as flank mismatches.",
    config: cleanConfig,
    totalReads: 312,
    wells: buildWells({
      rows: cleanConfig.rows,
      cols: cleanConfig.columns,
      baseReads: 22,
      noiseProfile: "noisy",
      seed: 4242,
    }),
    fastaPreview: fastaNoisyPreview,
  },
];
