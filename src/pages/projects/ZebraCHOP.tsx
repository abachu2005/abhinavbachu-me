import { useState } from "react";
import PageShell, { Section } from "@/components/layout/PageShell";
import InstallSection from "@/components/layout/InstallSection";
import GuidedDemo, {
  Glossary,
  type GuideStep,
} from "@/components/demo/GuidedDemo";
import ZebraCHOPDemo, { type ZebraCHOPPhase } from "@/components/demo/ZebraCHOPDemo";
import { genes } from "@/data/zebrachop";

export default function ZebraCHOP() {
  const [phase, setPhase] = useState<ZebraCHOPPhase>("form");
  const [activeGene, setActiveGene] = useState<string>(genes[0].id);
  const [highlightRank, setHighlightRank] = useState<number | null>(null);

  const steps: GuideStep[] = [
    {
      id: "intro",
      title: "The catch with CRISPR",
      body: (
        <>
          <p>
            <Glossary
              term="CRISPR"
              def="A molecular tool that lets researchers cut DNA at a precise location they choose."
            />{" "}
            is famous for being precise, but only if you pick the right{" "}
            <Glossary
              term="guide RNA"
              def="A short ~20-letter RNA sequence that tells the CRISPR scissors which spot in the genome to cut."
            />
            . A bad guide either misses the target or cuts somewhere it
            shouldn't.
          </p>
          <p>
            ZebraCHOP picks good guides for the zebrafish genome
            automatically.
          </p>
        </>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("form");
        setActiveGene(genes[0].id);
        setHighlightRank(null);
      },
    },
    {
      id: "genes",
      target: "zc-genes",
      placement: "right",
      title: "Paste a gene name (or three)",
      body: (
        <p>
          That's the entire required input. Genome, scoring model, and
          guide length default to what's correct for zebrafish.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("form");
        setHighlightRank(null);
      },
    },
    {
      id: "design",
      target: "zc-design-btn",
      placement: "top",
      title: "Click Design guides",
      body: (
        <p>
          ZebraCHOP looks up each gene, pulls its DNA, scores every
          possible 20-letter guide with the{" "}
          <Glossary
            term="Doench 2016 model"
            def="A machine-learning model trained on real CRISPR experiments that predicts how effectively a given guide RNA will cut its target."
          />, and checks the whole genome for{" "}
          <Glossary
            term="off-targets"
            def="Other places in the genome that look similar to the intended cut site, which CRISPR might accidentally cut."
          />
          .
        </p>
      ),
      advance: "click",
      onEnter: () => {
        setPhase("form");
        setHighlightRank(null);
      },
    },
    {
      id: "running",
      title: "Designing guides…",
      body: (
        <p>
          Five stages: gene lookup → sequence retrieval → Doench scoring →
          off-target search → exon-aware re-ranking. Click Next when ready.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("running");
        setHighlightRank(null);
      },
    },
    {
      id: "rx3-results",
      target: "zc-table",
      placement: "left",
      title: "Top guides for rx3",
      body: (
        <p>
          These are the real top-ranked guides for <strong>rx3</strong>, a
          zebrafish eye-development gene. The #1 guide has zero off-targets
          and the highest predicted efficiency in this gene, exactly what
          you want.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("results");
        setActiveGene("rx3");
        setHighlightRank(1);
      },
    },
    {
      id: "switch-tbx16",
      target: "zc-tab-tbx16",
      placement: "top",
      title: "Click tbx16 to switch genes",
      body: (
        <p>
          Each gene gets its own ranked guide table. Go ahead, click the
          tbx16 tab.
        </p>
      ),
      advance: "click",
      onEnter: () => {
        setPhase("results");
        setActiveGene("rx3");
        setHighlightRank(null);
      },
    },
    {
      id: "tbx16-results",
      target: "zc-table",
      placement: "left",
      title: "tbx16, a mesoderm master regulator",
      body: (
        <p>
          tbx16's #1 guide has a higher predicted{" "}
          <Glossary
            term="efficiency"
            def="Doench-2016 score, roughly 0–100. Higher = the CRISPR cut is more likely to succeed in a real experiment."
          />{" "}
          than rx3's, and also zero off-targets. A strong experimental
          candidate.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("results");
        setActiveGene("tbx16");
        setHighlightRank(1);
      },
    },
    {
      id: "payoff",
      title: "What this saves a lab",
      body: (
        <p>
          Before ZebraCHOP, designing zebrafish CRISPR guides meant
          stitching together half a dozen tools, three reference downloads,
          and a long series of judgment calls. Now it's one paste of a
          gene name → a ranked, off-target-clean table → ready to order.
          Used today by the Wellik Lab at Northwestern.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("results");
      },
    },
  ];

  return (
    <PageShell
      eyebrow="Open source"
      title="ZebraCHOP"
      tagline="A clean, modern guide-RNA designer for zebrafish CRISPR experiments. Type a gene name in, get a ranked list of guides out."
      role="Solo developer · lead author"
      timeline="2024 – 2025"
      externalLinks={[
        { label: "GitHub", href: "https://github.com/abachu2005/ZebraCHOP" },
        { label: "PyPI", href: "https://pypi.org/project/zebrachop/" },
        { label: "Zenodo DOI", href: "https://doi.org/10.5281/zenodo.20297752" },
      ]}
    >
      <Section title="What it is, in one paragraph">
        <p>
          CRISPR is only useful if you pick a good guide RNA, short DNA tags
          that aim the molecular scissors. Bad guides miss the target, cut the
          wrong place, or do nothing. ZebraCHOP automates the whole guide-design
          workflow for the zebrafish genome: gene lookup, sequence retrieval,
          Doench-2016 scoring, off-target detection, and re-ranking by exon
          structure. The user pastes a gene name; the tool returns a clean,
          off-target-free, ranked list ready to order.
        </p>
      </Section>

      <Section title="Try it">
        <GuidedDemo
          kicker="Guided walkthrough"
          preview={
            <ZebraCHOPDemo
              phase={phase}
              activeGeneId={activeGene}
              highlightRank={highlightRank}
            />
          }
          steps={steps}
        />
      </Section>

      <InstallSection
        packageName="zebrachop"
        pypiUrl="https://pypi.org/project/zebrachop/"
        biocondaUrl="https://github.com/bioconda/bioconda-recipes/pull/65644"
        setupCommand="python3 bin/zebrachop-setup   # from a git clone"
        webCommand="zebrachop-web"
        note="The PyPI package ships the FastAPI frontend. The legacy CHOPCHOP engine (Python 2) is included in the git checkout and launched as a subprocess."
      />

      <Section title="What I built">
        <ul className="list-disc space-y-2 pl-5 text-[var(--color-ink-muted)] marker:text-[var(--color-accent)]">
          <li>End-to-end FastAPI pipeline: gene table → twoBitToFa → Doench 2016 → Bowtie off-targets → Ensembl-aware re-ranking.</li>
          <li>Vanilla-JS web UI with batched gene input, sortable results, and TSV/CSV export.</li>
          <li>Reproducible Docker image with the zebrafish reference baked in.</li>
          <li>Currently in active use at the Wellik Lab at Northwestern.</li>
        </ul>
      </Section>

      <Section title="Stack">
        <div className="flex flex-wrap gap-2">
          {["Python", "FastAPI", "Bowtie", "twoBitToFa", "Doench 2016", "Ensembl REST", "JavaScript", "PyPI", "Bioconda", "Docker"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-2.5 py-1 text-xs text-[var(--color-ink-muted)]"
            >
              {t}
            </span>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
