import { useState } from "react";
import PageShell, { Section } from "@/components/layout/PageShell";
import InstallSection from "@/components/layout/InstallSection";
import GuidedDemo, { Glossary, type GuideStep } from "@/components/demo/GuidedDemo";
import AutoBarcoderDemo, {
  type AutoBarcoderPhase,
} from "@/components/demo/AutoBarcoderDemo";
import { scenarios } from "@/data/autobarcoder";

export default function AutoBarcoder() {
  const [phase, setPhase] = useState<AutoBarcoderPhase>("input");
  const [highlight, setHighlight] = useState<{ row: string; col: string } | null>(null);
  const [pulseInput, setPulseInput] = useState(false);
  const [pulseGrid, setPulseGrid] = useState(false);

  const sample = scenarios[0];
  const rows = sample.config.rows;
  const cols = sample.config.columns;
  const cleanWell = sample.wells.find((w) => !w.flag) ?? sample.wells[0];
  const flagWell = sample.wells.find((w) => w.flag === "low-coverage") ?? null;
  const cleanLabel = `${String.fromCharCode(65 + rows.indexOf(cleanWell.row))}${cols.indexOf(cleanWell.col) + 1}`;
  const flagLabel = flagWell
    ? `${String.fromCharCode(65 + rows.indexOf(flagWell.row))}${cols.indexOf(flagWell.col) + 1}`
    : null;

  const steps: GuideStep[] = [
    {
      id: "intro",
      title: "What is AutoBarcoder?",
      body: (
        <>
          <p>
            Biology labs run experiments on plates with 96 little wells,
            8 rows by 12 columns, each containing a different sample. To
            save money, they sequence all 96 wells together and get back{" "}
            <em>one giant text file</em> with the reads mixed up.
          </p>
          <p>
            AutoBarcoder is my tool that un-mixes that file: it sorts every
            read back to the well it came from. Click <strong>Next</strong>{" "}
            to start the tour.
          </p>
        </>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("input");
        setHighlight(null);
        setPulseInput(false);
        setPulseGrid(false);
      },
    },
    {
      id: "file",
      target: "ab-file",
      placement: "top",
      title: "1. The user uploads a sequencing file",
      body: (
        <p>
          This is a{" "}
          <Glossary
            term="FASTQ file"
            def="The text format DNA sequencing machines produce. Each line is one short DNA read."
          />{" "}, every line is one DNA read from the pooled experiment.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("input");
        setHighlight(null);
        setPulseInput(false);
        setPulseGrid(false);
      },
    },
    {
      id: "barcodes",
      target: "ab-barcodes",
      placement: "top",
      title: "2. Then pastes the well IDs",
      body: (
        <p>
          Each well has a unique pair of{" "}
          <Glossary
            term="barcodes"
            def="Short DNA tags built into each well. The row barcode tells you which row, the column barcode tells you which column, together they identify the well."
          />{" "}, one for its row, one for its column. AutoBarcoder uses those
          tags to route every read to the right well.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("input");
        setHighlight(null);
      },
    },
    {
      id: "run",
      target: "ab-run-btn",
      placement: "top",
      title: "3. Now click Run analysis",
      body: (
        <p>
          Go ahead, click the highlighted <strong>Run analysis</strong>{" "}
          button. The pipeline will demultiplex, cluster with{" "}
          <Glossary
            term="Levenshtein distance"
            def="A measure of how many single-letter edits it takes to turn one short string into another. AutoBarcoder treats reads within a small edit distance as the same barcode."
          />, and write a summary.
        </p>
      ),
      advance: "click",
      onEnter: () => {
        setPhase("input");
        setHighlight(null);
      },
    },
    {
      id: "running",
      title: "Running the pipeline…",
      body: (
        <>
          <p>
            AutoBarcoder is walking through every read in the file: finding
            the tags, slicing out the variable region between two fixed
            flanks, clustering near-identical reads, and writing a per-well
            summary.
          </p>
          <p>Click <strong>Next</strong> when you've watched it work.</p>
        </>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("running");
        setHighlight(null);
      },
    },
    {
      id: "grid",
      target: "ab-grid",
      placement: "top",
      title: "4. The output: a colored map of the plate",
      body: (
        <p>
          Each square is one well.{" "}
          <strong style={{ color: "#1f4a2c" }}>Green</strong> wells had clear,
          dominant barcodes.{" "}
          <strong style={{ color: "#7a2222" }}>Red</strong> wells got flagged
          as contaminated, too few reads or no clear winner.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("results");
        setHighlight(null);
        setPulseGrid(true);
      },
    },
    {
      id: "click-clean",
      target: `ab-well-${cleanLabel}`,
      placement: "right",
      title: `5. Click well ${cleanLabel}`,
      body: (
        <p>
          Go ahead, click the highlighted well to see what barcodes
          AutoBarcoder identified inside it.
        </p>
      ),
      advance: "click",
      onEnter: () => {
        setPhase("results");
        setHighlight(null);
        setPulseGrid(false);
      },
    },
    {
      id: "variants",
      target: "ab-variants",
      placement: "left",
      title: `Inside well ${cleanLabel}`,
      body: (
        <p>
          AutoBarcoder found the top barcode variants in this well and the
          percentage of reads each one captured, exactly the table a
          researcher would copy into their lab notebook.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("results");
        setHighlight({ row: cleanWell.row, col: cleanWell.col });
      },
    },
    ...(flagWell && flagLabel
      ? ([
          {
            id: "click-flag",
            target: `ab-well-${flagLabel}`,
            placement: "right",
            title: `6. Now click well ${flagLabel}`,
            body: (
              <p>
                This well got flagged. Click it to see what a contaminated
                well looks like in the output.
              </p>
            ),
            advance: "click",
            onEnter: () => {
              setPhase("results");
              setHighlight(null);
            },
          },
          {
            id: "flag-detail",
            target: "ab-variants",
            placement: "left",
            title: "A flagged well",
            body: (
              <p>
                Not enough confident reads landed here. A researcher would
                either redo this well or throw it out, but only because
                AutoBarcoder flagged it. Otherwise the noise is invisible.
              </p>
            ),
            advance: "next",
            onEnter: () => {
              setPhase("results");
              setHighlight({ row: flagWell.row, col: flagWell.col });
            },
          },
        ] as GuideStep[])
      : []),
    {
      id: "payoff",
      title: "Why this matters",
      body: (
        <p>
          Without AutoBarcoder, a researcher spends an afternoon pivoting
          raw reads in Excel, and would probably miss the contaminated
          wells entirely. AutoBarcoder produces a confident, ranked,
          per-well report and a printable PDF in seconds.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("results");
        setHighlight(null);
        setPulseInput(false);
        setPulseGrid(false);
      },
    },
  ];

  return (
    <PageShell
      eyebrow="Open source"
      title="AutoBarcoder"
      tagline="Sorts thousands of jumbled DNA sequencing reads back into the 96-well plate they came from, in seconds."
      role="Solo developer · lead author"
      timeline="2024 – 2025"
      externalLinks={[
        { label: "GitHub", href: "https://github.com/abachu2005/AutoBarcoder-OS-" },
        { label: "PyPI", href: "https://pypi.org/project/autobarcoder/" },
        { label: "Zenodo DOI", href: "https://doi.org/10.5281/zenodo.20297748" },
      ]}
    >
      <Section title="What it is, in one paragraph">
        <p>
          Biology labs love to pack 96 different experiments onto a single
          plate, sequence them all together, and sort the reads out later.
          That "sort it out later" step is what AutoBarcoder automates. It
          takes the giant text file from the sequencer, identifies which well
          each read came from, summarizes the dominant DNA barcodes in each
          well, and flags any well that looks broken. Open source, runs in
          the browser or the terminal, has a citable DOI.
        </p>
      </Section>

      <Section title="Try it">
        <GuidedDemo
          kicker="Guided walkthrough"
          preview={
            <AutoBarcoderDemo
              phase={phase}
              highlightWell={highlight}
              pulseInput={pulseInput}
              pulseGrid={pulseGrid}
            />
          }
          steps={steps}
        />
      </Section>

      <InstallSection
        packageName="autobarcoder"
        pypiUrl="https://pypi.org/project/autobarcoder/"
        biocondaUrl="https://github.com/bioconda/bioconda-recipes/pull/65642"
        setupCommand="autobarcoder-setup"
        webCommand="autobarcoder-web"
      />

      <Section title="What I built">
        <ul className="list-disc space-y-2 pl-5 text-[var(--color-ink-muted)] marker:text-[var(--color-accent)]">
          <li>End-to-end demultiplexing and clustering algorithm in pure Python.</li>
          <li>Three frontends: a FastAPI web UI, a Tkinter desktop GUI, and a setup wizard CLI.</li>
          <li>PyPI and bioconda packages, Docker image, CI pipeline, and a Zenodo-archived release with citable DOI.</li>
          <li>Documentation that walks a bench scientist from raw FASTQ to per-well PDF in under five minutes.</li>
        </ul>
      </Section>

      <Section title="Stack">
        <div className="flex flex-wrap gap-2">
          {["Python", "FastAPI", "Tkinter", "Levenshtein", "matplotlib", "PyPI", "Bioconda", "Docker", "GitHub Actions", "Zenodo"].map((t) => (
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
