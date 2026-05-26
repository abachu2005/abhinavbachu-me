// Demo scenarios for LeafMiner.
// Shape mirrors the real pipeline output: per-gene poison-exon hits with
// developmental PSI change (delta-PSI) and adjusted p-value. Gene symbols
// are pulled from the actual LongORF_PTC+_fromClustered.tsv catalog.

export type Hit = {
  gene: string;
  /** PSI change between developmental conditions (-1 .. 1) */
  dPsi: number;
  /** -log10(adjusted p-value) */
  negLog10P: number;
  /** Junction read counts across two conditions */
  readsA: number;
  readsB: number;
  /** Stylized exon layout: list of widths (relative units), poisonIndex picks the highlighted exon */
  exons: number[];
  poisonIndex: number;
  /** Junction "arcs" between exon indices */
  junctions: { from: number; to: number; reads: number }[];
  classification: "novel" | "annotated";
  flag?: "high-confidence" | "borderline";
};

export type LeafScenario = {
  id: string;
  label: string;
  description: string;
  conditionA: string;
  conditionB: string;
  hits: Hit[];
};

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Top genes from the actual catalog (LongORF_PTC+_fromClustered.tsv).
const REAL_GENES = [
  "mybphb", "selenof", "atp5mc3b", "ela2l", "oaz1a", "hnrnpk", "ewsr1a",
  "khdrbs1a", "fam76b", "hnrnpa1b", "tardbpa", "rbmx", "hmgn3", "atp5f1d",
  "manbal", "cenatac", "srp68", "cirbpb", "smarcb1b", "ldb1a", "asb5b",
  "cahz", "selenow2a", "rtn2b", "pck2", "mta2", "selenoj", "rbm38", "oaz1b",
  "maza", "zc2hc1a", "trappc2", "mapre2", "capn1a", "dhx15", "popdc2",
  "crip2", "znf414", "ccr9a", "sft2d1", "ppil4", "tmem63bb", "pane1",
  "odam", "col9a1b", "ca9", "scinlb", "dhx9", "celf1",
];

function buildHits(seed: number, focusGenes: string[]): Hit[] {
  const rng = mulberry32(seed);
  const out: Hit[] = [];
  // Sprinkle "background" hits.
  for (let i = 0; i < REAL_GENES.length; i++) {
    const gene = REAL_GENES[i];
    if (focusGenes.includes(gene)) continue;
    const dPsi = (rng() - 0.5) * 0.6;
    const negLog10P = 0.2 + rng() * 2.5;
    const exonCount = 4 + Math.floor(rng() * 5);
    const exons = Array.from({ length: exonCount }, () => 0.5 + rng() * 1.4);
    const poisonIndex = 1 + Math.floor(rng() * (exonCount - 2));
    out.push({
      gene,
      dPsi,
      negLog10P,
      readsA: Math.floor(20 + rng() * 80),
      readsB: Math.floor(20 + rng() * 80),
      exons,
      poisonIndex,
      junctions: [
        { from: poisonIndex - 1, to: poisonIndex, reads: Math.floor(rng() * 50) },
        { from: poisonIndex, to: poisonIndex + 1, reads: Math.floor(rng() * 50) },
        { from: poisonIndex - 1, to: poisonIndex + 1, reads: Math.floor(rng() * 80) },
      ],
      classification: rng() > 0.5 ? "novel" : "annotated",
    });
  }
  // Curated "hero" hits with realistic strong signal.
  const hero: Hit[] = focusGenes.map((gene, i) => {
    const exons = [1.2, 0.7, 0.5, 1.4, 0.6, 1.1, 0.8, 1.0];
    const poisonIndex = 3;
    return {
      gene,
      dPsi: 0.42 + (i % 2 === 0 ? 1 : -1) * (0.1 + (i * 0.05)),
      negLog10P: 6.5 + i * 1.4 + rng() * 1.5,
      readsA: 110 + Math.floor(rng() * 40),
      readsB: 35 + Math.floor(rng() * 20),
      exons,
      poisonIndex,
      junctions: [
        { from: 2, to: 3, reads: 78 - i * 4 },
        { from: 3, to: 4, reads: 64 - i * 3 },
        { from: 2, to: 4, reads: 142 - i * 6 },
      ],
      classification: i % 3 === 0 ? "novel" : "annotated",
      flag: "high-confidence",
    };
  });
  return [...out, ...hero];
}

export const scenarios: LeafScenario[] = [
  {
    id: "dev-stages",
    label: "Embryo · 24 hpf vs 72 hpf",
    description:
      "Whole-embryo RNA-seq across two developmental timepoints. Looking for poison exons whose inclusion shifts as the embryo matures.",
    conditionA: "24 hpf",
    conditionB: "72 hpf",
    hits: buildHits(7, ["srsf3b", "hnrnpa1b", "tardbpa", "ewsr1a", "rbm38", "khdrbs1a"]),
  },
  {
    id: "tissue",
    label: "Adult brain vs liver",
    description:
      "Tissue-specific poison-exon usage in adult zebrafish. RNA-binding proteins and splicing factors tend to autoregulate via NMD in a tissue-dependent way.",
    conditionA: "brain",
    conditionB: "liver",
    hits: buildHits(13, ["hnrnpk", "tardbpa", "celf1", "rbmx", "mta2", "dhx15"]),
  },
];
