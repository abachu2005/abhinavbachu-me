export type Project = {
  slug: string;
  name: string;
  tagline: string;
  oneLiner: string;
  href: string;
  tags: string[];
  status?: "live" | "in-progress";
  external?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "autobarcoder",
    name: "AutoBarcoder",
    tagline: "Demultiplex and cluster RNA barcodes from 96-well sequencing reads.",
    oneLiner:
      "Open-source bioinformatics tool that sorts sequencing reads back into 96 wells and clusters the variable RNA barcode between two flanks.",
    href: "/projects/autobarcoder",
    tags: ["Open source", "Bioinformatics", "Python", "DOI"],
    status: "live",
    external: [
      { label: "GitHub", href: "https://github.com/abachu2005/AutoBarcoder-OS-" },
      { label: "Zenodo DOI", href: "https://zenodo.org/badge/latestdoi/929581836" },
    ],
  },
  {
    slug: "leafcutter",
    name: "Leaf_Cutter",
    tagline: "End-to-end alternative-splicing pipeline with built-in clustering and scoring.",
    oneLiner:
      "Open-source pipeline that detects differentially spliced junctions across conditions, from raw alignments to ranked hits.",
    href: "/projects/leafcutter",
    tags: ["Open source", "Bioinformatics", "Python", "Pipeline"],
    status: "live",
  },
  {
    slug: "zebrachop",
    name: "ZebraCHOP",
    tagline: "Batch CRISPR guide design and analysis for zebrafish.",
    oneLiner:
      "Open-source command-line + web tool for designing and analyzing CRISPR experiments in zebrafish, at batch scale.",
    href: "/projects/zebrachop",
    tags: ["Open source", "CRISPR", "Python", "Zebrafish"],
    status: "live",
  },
  {
    slug: "veracare",
    name: "Veracare",
    tagline: "AI-assisted surgical care navigation for patients and providers.",
    oneLiner:
      "My startup. A platform that guides patients through their full surgical journey while giving providers a unified workspace.",
    href: "/projects/veracare",
    tags: ["Startup", "Healthcare", "React", "AI"],
    status: "live",
  },
  {
    slug: "neurotech",
    name: "Motor Engagement Signal (MES)",
    tagline: "EEG pipeline that scores motor-cortex engagement on a calibrated 0–100 scale, for stroke and SCI rehab.",
    oneLiner:
      "Open-source EEG pipeline I built with a student neurotech group: it turns one motor-imagery recording into a single calibrated 0–100 score of how strongly the patient's motor cortex is engaging.",
    href: "/projects/neurotech",
    tags: ["Open source", "Neurotech", "EEG", "PyTorch", "React"],
    status: "live",
    external: [
      { label: "Hugging Face Space", href: "https://huggingface.co/spaces/abachu2005/mes" },
    ],
  },
];

export const talks = [
  {
    slug: "izfc-2025",
    title:
      "High-throughput gene perturbation and streamlined multimodal phenotyping in zebrafish",
    venue: "19th International Zebrafish Conference · Madison, WI",
    year: "2025",
    href: "/talks/izfc-2025",
  },
];
