import { FileText, Quote, Download, FileEdit } from "lucide-react";
import PageShell, { Section } from "@/components/layout/PageShell";
import SlideDeck from "@/components/demo/SlideDeck";

const slideImages = Array.from(
  { length: 17 },
  (_, i) => `/assets/talks/izfc/slides/slide-${String(i + 1).padStart(2, "0")}.png`,
);

const slideCaptions = [
  "Title — High-throughput gene perturbation and streamlined multimodal phenotyping in zebrafish.",
  "Exigence — CRISPR is scalable in zebrafish, but phenotyping isn't; most workflows don't link phenotype to genotype.",
  "Introduction — a scalable pipeline that combines MIC-Drop CRISPR with automated imaging and a plate-wide barcoding system.",
  "Experimental workflow overview.",
  "MIC-Drop — scalable F0 CRISPR perturbation (Parvez et al. 2021 Science; Parvez, Brandt & Peterson 2023 Nature Protocols).",
  "MCAM imaging — full 96-well Z-stack in under a minute, 0.9 gigapixels total at 3.2 μm resolution (Thomson et al. 2022 eLife).",
  "CNN-based morphological segmentation — UNet trained on 7 regions, per-pixel masks evaluated with IoU.",
  "Morphological metric outputs — tail length, head area, yolk diameter, with plate-wide reproducibility.",
  "Behavioral assay design — spontaneous and stimulus-based (flash, vibration) with IR tracking and pose estimation.",
  "Behavioral metric design — baseline and stimulus responses per larva, mutants vs wild-type, t-tests with FDR correction.",
  "Behavioral fingerprinting.",
  "Barcode demultiplexing — assigns sequencing reads to wells and outputs the dominant genotype per larva.",
  "Edit-distance clustering on barcodes.",
  "Genotype–phenotype mapping.",
  "Discussion — high-throughput, standardized phenotyping; results match manual annotations; compares favorably to DanioVision, VAST, Zebrabox.",
  "Acknowledgements — Parvez Lab, Ramona Optics, Peterson Lab, CCM & Aquatics Facility, NIH.",
  "Questions?",
];

export default function Izfc2025() {
  const vimeoWatch = "https://vimeo.com/1103906567/25f0d6bda6";
  const slidesPdf = "/assets/talks/izfc/slides.pdf";
  const localMp4 = "/assets/talks/izfc/talk.mp4";

  return (
    <PageShell
      eyebrow="Talk · 19th IZFC · July 9–13, 2025 · Madison, WI"
      title="High-throughput gene perturbation and streamlined multimodal phenotyping in zebrafish"
      tagline="Oral presentation at the 19th International Zebrafish Conference on a pipeline that links MIC-Drop CRISPR screens to automated morphological and behavioral phenotyping in 96-well plates."
      role="Presenting author · Parvez Lab, Northwestern Feinberg School of Medicine"
      timeline="Presented July 2025"
    >
      <Section title="Authors">
        <p className="text-[var(--color-ink-muted)]">
          <strong className="text-[var(--color-ink)]">Abhinav Bachu</strong>
          <span className="text-[var(--color-accent)]">*</span>, John Efromson
          <span className="text-[var(--color-accent)]">*</span>, Claire Stockard,
          Randall Peterson, Saba Parvez.
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--color-ink-subtle)]">
          <span className="text-[var(--color-accent)]">*</span> Equal contribution.
          Parvez Lab, Department of Cell &amp; Developmental Biology, Northwestern
          University Feinberg School of Medicine, in collaboration with Ramona
          Optics and the Peterson Lab (University of Utah).
        </p>
      </Section>

      <Section title="Abstract">
        <p>
          CRISPR has made gene editing in zebrafish scalable, but phenotyping
          hasn&rsquo;t kept up &mdash; morphological and behavioral readouts are
          still collected manually or with low-throughput tools, and most
          workflows don&rsquo;t link phenotype directly back to genotype at
          scale.
        </p>
        <p>
          This talk presents an end-to-end pipeline that connects genotype to
          phenotype in zebrafish at 96-well plate scale. We combine{" "}
          <strong>MIC-Drop</strong> for multiplexed F0 CRISPR perturbation,{" "}
          <strong>MCAM gigapixel imaging</strong> (full 96-well Z-stacks in
          under a minute at 3.2&nbsp;&micro;m resolution), <strong>UNet-based
          morphological segmentation</strong> across seven anatomical regions,
          and <strong>IR-tracked behavioral assays</strong> (spontaneous,
          flash, and vibration responses) into a single workflow.
        </p>
        <p>
          A plate-wide barcoding system then demultiplexes post-phenotyping
          sequencing reads back to individual wells and clusters them by edit
          distance, so every larva&rsquo;s morphological and behavioral
          fingerprint is linked to its dominant genotype. The platform is
          modular and cost-effective, removes major bottlenecks in zebrafish
          reverse-genetics, and reproduces manual annotations while comparing
          favorably to existing tools like DanioVision, VAST, and Zebrabox.
        </p>
      </Section>

      <Section title="Recording">
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-black shadow-[var(--shadow-soft)]">
          <video
            controls
            preload="metadata"
            poster="/assets/talks/izfc/poster.svg"
            src={localMp4}
            className="aspect-video w-full bg-black"
          />
        </div>
        <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
          Also available on Vimeo &middot;{" "}
          <a href={vimeoWatch} target="_blank" rel="noreferrer">
            watch on Vimeo
          </a>{" "}
          &middot;{" "}
          <a href={localMp4} download>
            download MP4
          </a>
          .
        </p>
      </Section>

      <Section title="Slides">
        <SlideDeck
          kicker="17 slides · arrow keys to navigate"
          slides={slideImages}
          captions={slideCaptions}
        />
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <a
            href={slidesPdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-[var(--color-accent-deep)] hover:underline"
          >
            <FileText className="h-4 w-4" /> Open full PDF
          </a>
          <a
            href={slidesPdf}
            download
            className="inline-flex items-center gap-1.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            <Download className="h-4 w-4" /> Download (2.2&nbsp;MB &middot; 17 slides)
          </a>
        </div>
      </Section>

      <Section title="Manuscript">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
          <div className="flex items-start gap-3">
            <FileEdit className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
            <div className="space-y-2 text-[var(--color-ink-muted)]">
              <p>
                <span className="inline-flex items-center rounded-full border border-[var(--color-accent-tint)] bg-[var(--color-accent-tint)] px-2 py-0.5 text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[var(--color-accent-deep)]">
                  In preparation
                </span>
              </p>
              <p>
                <em className="text-[var(--color-ink)]">
                  Bachu A
                  <span className="text-[var(--color-accent)]">*</span>,
                  Efromson J
                  <span className="text-[var(--color-accent)]">*</span>,
                  Stockard C, Peterson R, Parvez S.
                </em>{" "}
                This talk previewed an upcoming manuscript from the Parvez Lab
                (Northwestern Feinberg) and collaborators at Ramona Optics and
                the Peterson Lab (University of Utah).
              </p>
              <p className="text-sm">
                A preprint and DOI will be linked here once posted. Reach out
                if you&rsquo;d like to discuss the work before then.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Citation">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
          <p className="flex items-start gap-2 font-serif text-[var(--color-ink)]">
            <Quote className="mt-1 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
            <span>
              Bachu A, Efromson J, Stockard C, Peterson R, Parvez S.{" "}
              <em>
                High-throughput gene perturbation and streamlined multimodal
                phenotyping in zebrafish.
              </em>{" "}
              Oral presentation, 19th International Zebrafish Conference,
              Madison, WI, July 2025.
            </span>
          </p>
        </div>
      </Section>
    </PageShell>
  );
}
