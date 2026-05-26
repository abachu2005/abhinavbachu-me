import { useState } from "react";
import PageShell, { Section } from "@/components/layout/PageShell";
import InstallSection from "@/components/layout/InstallSection";
import GuidedDemo, {
  Glossary,
  type GuideStep,
} from "@/components/demo/GuidedDemo";
import LeafCutterDemo, {
  type LeafCutterPhase,
} from "@/components/demo/LeafCutterDemo";
import { scenarios } from "@/data/leafcutter";

export default function LeafCutter() {
  const [phase, setPhase] = useState<LeafCutterPhase>("submit");
  const [highlight, setHighlight] = useState<string | null>(null);

  const scenario = scenarios[0];
  const hero = scenario.hits.find((h) => h.flag === "high-confidence");

  const steps: GuideStep[] = [
    {
      id: "intro",
      title: "Why we'd look for “poison exons”",
      body: (
        <>
          <p>
            Most cells have a quality-control system that destroys broken
            RNA before it becomes a faulty protein. It's called{" "}
            <Glossary
              term="nonsense-mediated decay"
              def="NMD. A cellular safety mechanism that detects broken or premature-stop RNA messages and deletes them before they're translated."
            />
            .
          </p>
          <p>
            Cells secretly <em>weaponize</em> this system: they splice in a
            tiny "poison exon" that intentionally trips the alarm, which
            dials the gene down. LeafMiner finds these poison exons
            automatically.
          </p>
        </>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("submit");
        setHighlight(null);
      },
    },
    {
      id: "comparison",
      target: "lc-comparison",
      placement: "top",
      title: "Pick a comparison",
      body: (
        <p>
          The researcher chooses two conditions to compare. Here, zebrafish
          embryos at two developmental time points. LeafMiner handles all
          the alignment, reference downloads, and junction counting itself.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("submit");
        setHighlight(null);
      },
    },
    {
      id: "submit",
      target: "lc-submit-btn",
      placement: "top",
      title: "Submit the job",
      body: (
        <p>
          Click <strong>Submit Job</strong> and LeafMiner starts the
          pipeline. On the cluster a full ENA project runs for hours; this
          demo finishes in seconds.
        </p>
      ),
      advance: "click",
      onEnter: () => {
        setPhase("submit");
        setHighlight(null);
      },
    },
    {
      id: "running",
      title: "The pipeline runs",
      body: (
        <>
          <p>
            LeafMiner chains five tools: quality-control,{" "}
            <Glossary
              term="STAR alignment"
              def="An RNA-seq read aligner that maps short DNA reads to a reference genome and reports the splice junctions it sees."
            />, LeafCutter2 junction clustering, productive/unproductive
            classification, and a statistical test.
          </p>
          <p>Click Next when the run finishes.</p>
        </>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("running");
        setHighlight(null);
      },
    },
    {
      id: "volcano",
      target: "lc-volcano",
      placement: "left",
      title: "Reading the volcano plot",
      body: (
        <>
          <p>
            Each dot is one gene's candidate poison exon. The x-axis is{" "}
            <Glossary
              term="ΔPSI"
              def="Change in 'Percent Spliced In', how much more (or less) the poison exon is included in condition B compared to A."
            />{" "}
            and the y-axis is statistical significance.
          </p>
          <p>
            Dots in the upper-right and upper-left corners are the hits
            worth following up on.
          </p>
        </>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("volcano");
        setHighlight(null);
      },
    },
    {
      id: "junction",
      target: "lc-junction",
      placement: "left",
      title: hero ? `A top hit: ${hero.gene}` : "A top hit",
      body: hero ? (
        <p>
          This is <strong>{hero.gene}</strong>. Rectangles are exons, arcs
          are splice junctions. The highlighted exon is the poison one, and
          the cell {hero.dPsi >= 0 ? "includes it more" : "skips it more"}{" "}
          in {scenario.conditionB} than {scenario.conditionA}, dialing the
          gene {hero.dPsi >= 0 ? "down" : "up"}.
        </p>
      ) : (
        <p>The junction view shows exons (blocks) and splice junctions (arcs) so the alternative isoform is visible at a glance.</p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("junction");
        setHighlight(hero?.gene ?? null);
      },
    },
    {
      id: "payoff",
      title: "Why this matters",
      body: (
        <p>
          Zebrafish have 25,000+ genes. Hand-curating poison exons in a
          single dataset is a months-long project. LeafMiner shrinks that
          to a button press. The first publicly available end-to-end tool
          for it.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("junction");
        setHighlight(hero?.gene ?? null);
      },
    },
  ];

  return (
    <PageShell
      eyebrow="Open source"
      title="LeafMiner"
      tagline="Finds hidden “poison exons” in zebrafish RNA-sequencing data, automatically. The first publicly available end-to-end pipeline for it."
      role="Solo developer · lead author"
      timeline="2024 – 2025"
      externalLinks={[
        { label: "GitHub", href: "https://github.com/abachu2005/LeafMiner" },
        { label: "PyPI", href: "https://pypi.org/project/leafcutter2-pipeline/" },
        { label: "Zenodo DOI", href: "https://zenodo.org/badge/latestdoi/1170208699" },
      ]}
    >
      <Section title="What it is, in one paragraph">
        <p>
          Cells sometimes deliberately splice broken-looking RNA so the
          quality-control machinery destroys it: a clever way to dial a
          gene down. The spliced-in fragment is called a "poison exon."
          LeafMiner is an end-to-end pipeline that finds these in
          zebrafish RNA-seq data automatically, runs the statistics, and
          ranks the hits for the wet lab. Goes from an ENA project ID to a
          ready-to-screen candidate list with no human in the loop. Installable
          from PyPI as <code>leafcutter2-pipeline</code>.
        </p>
      </Section>

      <Section title="Try it">
        <GuidedDemo
          kicker="Guided walkthrough"
          preview={
            <LeafCutterDemo phase={phase} highlightGene={highlight} />
          }
          steps={steps}
        />
      </Section>

      <InstallSection
        packageName="leafcutter2-pipeline"
        pypiUrl="https://pypi.org/project/leafcutter2-pipeline/"
        biocondaUrl="https://github.com/bioconda/bioconda-recipes/pull/65643"
        setupCommand="leafcutter2-pipeline --help"
        webCommand="leafcutter2-web"
        note="For full ENA-scale runs, clone the repo and use the interactive setup wizard (python3 bin/leafcutter-setup)."
      />

      <Section title="What I built">
        <ul className="list-disc space-y-2 pl-5 text-[var(--color-ink-muted)] marker:text-[var(--color-accent)]">
          <li>The full pipeline: reference setup → STAR → LeafCutter2 → classification → statistical test → ranking.</li>
          <li>Two execution modes: local for small jobs, Quest Slurm via SSH for full ENA projects.</li>
          <li>FastAPI + vanilla-JS web app with a setup wizard and live job status.</li>
          <li>Statistical layer: quasi-binomial GLM with Spearman cross-validation to guard against overfitting.</li>
        </ul>
      </Section>

      <Section title="Stack">
        <div className="flex flex-wrap gap-2">
          {["Python", "FastAPI", "STAR", "LeafCutter2", "samtools", "regtools", "pandas", "scipy", "statsmodels", "PyPI", "Bioconda", "Slurm", "Docker", "GitHub Actions"].map((t) => (
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
