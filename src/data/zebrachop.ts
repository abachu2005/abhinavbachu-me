// Demo data for ZebraCHOP. The guides below are the *actual* top-ranked
// guides from ZebraCHOP/results/{rx3,tbx16,tbxta}.tsv — real output of the
// pipeline running against the danRer11 zebrafish reference.

export type Guide = {
  rank: number;
  seq: string;
  loc: string;
  strand: "+" | "-";
  gc: number;
  selfComp: number;
  mm0: number;
  mm1: number;
  mm2: number;
  mm3: number;
  efficiency: number;
};

export type GeneRun = {
  id: string;
  symbol: string;
  description: string;
  chrom: string;
  /** A simple stylized gene model: list of exon widths (relative units) */
  exons: number[];
  /** Which exon (0-indexed) is the recommended target — usually an early one */
  targetExon: number;
  guides: Guide[];
};

export const genes: GeneRun[] = [
  {
    id: "rx3",
    symbol: "rx3",
    description: "Retinal homeobox gene 3 — early eye-field specification.",
    chrom: "chr21",
    exons: [1.2, 1.6, 0.8, 1.1, 0.9],
    targetExon: 1,
    guides: [
      { rank: 1, seq: "GATCTGCCAGACGCGGATGGTGG", loc: "chr21:10756926", strand: "+", gc: 65, selfComp: 1, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 63.82 },
      { rank: 2, seq: "GGGACTGCGGACCAAGCGCGCGG", loc: "chr21:10756322", strand: "-", gc: 75, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 59.24 },
      { rank: 3, seq: "GGGAGAGACTCTGTTTCACCCGG", loc: "chr21:10756392", strand: "+", gc: 55, selfComp: 1, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 58.82 },
      { rank: 4, seq: "GGCTGGGACGGCCTGCTGAGGGG", loc: "chr21:10758584", strand: "-", gc: 75, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 56.53 },
      { rank: 5, seq: "GGGACAGTGGCCCCGATCTGGGG", loc: "chr21:10758474", strand: "-", gc: 70, selfComp: 1, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 57.06 },
      { rank: 6, seq: "GAGGCGATGCTTGTGTTTCGTGG", loc: "chr21:10758733", strand: "-", gc: 55, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 55.98 },
      { rank: 7, seq: "GGAAGGTGGTGAACGTGGTTCGG", loc: "chr21:10756994", strand: "-", gc: 55, selfComp: 1, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 48.03 },
    ],
  },
  {
    id: "tbx16",
    symbol: "tbx16",
    description: "T-box transcription factor 16 — mesoderm specification.",
    chrom: "chr8",
    exons: [0.9, 1.4, 1.1, 0.6, 1.2, 0.7],
    targetExon: 1,
    guides: [
      { rank: 1, seq: "GATCATCAGCCTGAACAATGTGG", loc: "chr8:51742870", strand: "+", gc: 45, selfComp: 1, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 69.28 },
      { rank: 2, seq: "GTGGACATGGTACCAGAAGACGG", loc: "chr8:51748678", strand: "-", gc: 50, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 66.33 },
      { rank: 3, seq: "GAAATTGTGCTTGAGGTCTGAGG", loc: "chr8:51751413", strand: "+", gc: 45, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 66.01 },
      { rank: 4, seq: "GTTGGCGGCAGCAGTGCATGTGG", loc: "chr8:51737652", strand: "-", gc: 65, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 64.62 },
      { rank: 5, seq: "GGTAGCGGTGCATAGAGTGAAGG", loc: "chr8:51742903", strand: "+", gc: 55, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 63.00 },
      { rank: 6, seq: "GTGGAATAAGGATAAGTGGGAGG", loc: "chr8:51745657", strand: "-", gc: 45, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 62.91 },
      { rank: 7, seq: "GGCTATCACCATGGAAACGTTGG", loc: "chr8:51737304", strand: "-", gc: 50, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 60.76 },
    ],
  },
  {
    id: "tbxta",
    symbol: "tbxta",
    description: "T-box transcription factor TA (no tail) — notochord and tail.",
    chrom: "chr19",
    exons: [1.0, 1.5, 0.9, 1.2, 0.8],
    targetExon: 1,
    guides: [
      { rank: 1, seq: "GTGGAGAGCGAATTTCAGAAGGG", loc: "chr19:14191446", strand: "-", gc: 45, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 71.55 },
      { rank: 2, seq: "GCATCGGGCTCCATTACAGGTGG", loc: "chr19:14188590", strand: "-", gc: 60, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 63.36 },
      { rank: 3, seq: "GTGAGAGATACTCCAGCTTGAGG", loc: "chr19:14189963", strand: "-", gc: 50, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 60.94 },
      { rank: 4, seq: "GGGCACAAACCTGGTGTTGGAGG", loc: "chr19:14188739", strand: "+", gc: 60, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 56.01 },
      { rank: 5, seq: "GGTTCTTCGATGTCCTACTCGGG", loc: "chr19:14188545", strand: "-", gc: 50, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 55.20 },
      { rank: 6, seq: "GAGATGATCCAGGCGCTGGTCGG", loc: "chr19:14191478", strand: "+", gc: 60, selfComp: 1, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 55.28 },
      { rank: 7, seq: "GTGCTCAGAGCCAGTGTCACCGG", loc: "chr19:14191008", strand: "-", gc: 60, selfComp: 0, mm0: 0, mm1: 0, mm2: 0, mm3: 0, efficiency: 53.47 },
    ],
  },
];
