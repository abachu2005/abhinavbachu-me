import { useState } from "react";
import PageShell, { Section } from "@/components/layout/PageShell";
import GuidedDemo, { Glossary, type GuideStep } from "@/components/demo/GuidedDemo";
import MesDemo, { type MesPhase } from "@/components/demo/MesDemo";
import { scenarios } from "@/data/mes";

export default function Neurotech() {
  const [phase, setPhase] = useState<MesPhase>("input");
  const [highlight, setHighlight] = useState<number | null>(null);

  const sample = scenarios[0];

  const steps: GuideStep[] = [
    {
      id: "intro",
      title: "What is MES?",
      body: (
        <>
          <p>
            MES (<em>Motor Engagement Signal</em>) is an open-source EEG
            pipeline I built with a neurotech research group. It takes a
            recording of a patient trying to imagine or perform a movement and
            returns a single calibrated number from 0 to 100: <em>how strongly
            is their motor cortex actually engaging?</em>
          </p>
          <p>
            That number is the missing rehab metric. Therapists can feel when a
            patient is "trying"; this measures it. Click <strong>Next</strong>{" "}
            to walk through one real session.
          </p>
        </>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("input");
        setHighlight(null);
      },
    },
    {
      id: "upload",
      target: "mes-file",
      placement: "top",
      title: "1. Drop in a recording",
      body: (
        <p>
          A clinician uploads an{" "}
          <Glossary
            term="EEG file"
            def="Raw electroencephalography, voltage on the scalp recorded from a research cap (often 64+ channels) or a low-cost OpenBCI headset. MES accepts EDF, BDF, BrainVision, EEGLAB, and OpenBCI text/CSV."
          />{" "}
          of the patient doing one task, here, 24 trials of imagining a
          right-hand grasp.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("input");
        setHighlight(null);
      },
    },
    {
      id: "task",
      target: "mes-task",
      placement: "top",
      title: "2. Pick the task",
      body: (
        <p>
          Different tasks activate different parts of the motor strip, the
          <em> task</em> tells MES which hemisphere should be the
          contralateral target. Right-hand imagery should drive the{" "}
          <strong>left</strong> sensorimotor cortex.
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
      target: "mes-run-btn",
      placement: "top",
      title: "3. Click Upload & process",
      body: (
        <p>
          Go ahead, click the highlighted button. MES will resample, map any
          incoming cap onto its 16-channel sensorimotor montage, epoch the
          trials, and compute every feature it needs to score engagement.
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
            MES is computing{" "}
            <Glossary
              term="ERD"
              def="Event-Related Desynchronization. When a brain region engages, its oscillations in the μ (8-13 Hz) and β (13-30 Hz) bands drop in power. ERD is that drop, in %."
            />{" "}
            in the μ and β bands, an{" "}
            <Glossary
              term="MRCP"
              def="Movement-Related Cortical Potential, a slow negative voltage shift over the motor strip that precedes intended movement by ~1 s. A robust low-frequency marker of motor intent."
            />, a lateralization index, and the posterior of a small ONNX
            classifier. All five get combined into one calibrated score.
          </p>
          <p>Click <strong>Next</strong> when it finishes.</p>
        </>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("running");
        setHighlight(null);
      },
    },
    {
      id: "gauge",
      target: "mes-gauge",
      placement: "right",
      title: "4. The headline MES score",
      body: (
        <p>
          {sample.mesMean.toFixed(1)} out of 100. That puts this session in the{" "}
          <em>strong engagement</em> band, the patient's motor cortex really
          is doing what the task asks. Anything stable above ~50 is the rehab
          goal.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("gauge");
        setHighlight(null);
      },
    },
    {
      id: "trace",
      target: "mes-trace",
      placement: "left",
      title: "5. One value per trial",
      body: (
        <p>
          The line is MES on each of the {sample.nTrials} trials, in
          chronological order. A clinician scans this for two things: stability
          (no big collapses mid-session) and the trend (is engagement growing
          across the session, a small positive sign in early stroke recovery).
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("gauge");
        setHighlight(19); // visually pop a strong trial
      },
    },
    {
      id: "topo-jump",
      title: "Where in the brain?",
      body: (
        <p>
          A single number is great, but a clinician also wants to see the spatial
          pattern. Click <strong>Next</strong> to see where on the scalp the
          engagement is happening.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("gauge");
        setHighlight(null);
      },
    },
    {
      id: "topo",
      target: "mes-topo",
      placement: "right",
      title: "6. ERD topomap",
      body: (
        <p>
          Red = the motor strip is <em>activating</em> (μ-band power drops). The
          hot spot is C3 / C1 / FC3 on the <strong>left</strong> hemisphere,
          exactly where it should be for a right-hand task. That spatial
          specificity is what tells you MES isn't just measuring "general
          arousal".
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("topo");
        setHighlight(null);
      },
    },
    {
      id: "lateral",
      target: "mes-lateral",
      placement: "left",
      title: "7. Lateralization index",
      body: (
        <p>
          A single number that distills the topomap: how much stronger is the
          contralateral hemisphere than the ipsilateral one?{" "}
          <strong>+{sample.lateralization.toFixed(2)}</strong> says "clearly
          contralateral", the canonical motor pattern.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("topo");
        setHighlight(null);
      },
    },
    {
      id: "payoff",
      title: "Why this matters",
      body: (
        <p>
          Most rehab today relies on the therapist's subjective read of whether
          a patient is "trying". MES gives every session a calibrated,
          longitudinal, downloadable number, and the topomap, lateralization,
          and per-trial trace that justify it. Open source, runs on a $200
          OpenBCI headset, validated on PhysioNet + BCI Competition IV + two
          clinical stroke cohorts.
        </p>
      ),
      advance: "next",
      onEnter: () => {
        setPhase("topo");
        setHighlight(null);
      },
    },
  ];

  return (
    <PageShell
      eyebrow="Open source · Research"
      title="Motor Engagement Signal (MES)"
      tagline="An open-source EEG pipeline that turns a single recording into a calibrated 0–100 score of how strongly a patient's motor cortex is engaging, built for stroke and SCI rehabilitation."
      role="Research collaborator · Northwestern Neurotech"
      timeline="2024 – present"
      externalLinks={[
        { label: "Hugging Face Space", href: "https://huggingface.co/spaces/abachu2005/mes" },
        { label: "Model repo", href: "https://huggingface.co/abachu2005/mes-models" },
        { label: "Dataset repo", href: "https://huggingface.co/datasets/abachu2005/mes-eeg-processed" },
      ]}
    >
      <Section title="What it is, in one paragraph">
        <p>
          Rehabilitation after stroke or spinal-cord injury hinges on one
          unmeasured thing: how hard the motor cortex is actually <em>trying</em>.
          Therapists can feel it; nobody has a number for it. MES is that number.
          It takes a standard EEG recording of a patient performing a motor
          imagery task, extracts mu/beta ERD, MRCP amplitude, a lateralization
          index, and a small classifier posterior, and combines them into a
          single calibrated 0–100 score per session. Plus a topomap, a per-trial
          trace, and a downloadable PDF report, the things a clinician
          actually puts in a chart.
        </p>
      </Section>

      <Section title="Try it">
        <GuidedDemo
          kicker="Guided walkthrough"
          preview={<MesDemo phase={phase} highlightTrial={highlight} />}
          steps={steps}
        />
      </Section>

      <Section title="What I built">
        <ul className="list-disc space-y-2 pl-5 text-[var(--color-ink-muted)] marker:text-[var(--color-accent)]">
          <li>
            End-to-end EEG processing pipeline in Python: any-cap input →
            sensorimotor montage interpolation → epoching → mu/beta bandpower →
            ERD → MRCP → lateralization → Riemannian covariances.
          </li>
          <li>
            Two ONNX-exportable models (Riemannian + EEGNet) trained on
            PhysioNet eegmmidb and benchmarked on BCI Competition IV 2a/2b.
          </li>
          <li>
            A logistic-regression calibration layer that maps the raw feature
            stack to a stable 0–100 score with sigmoid scaling.
          </li>
          <li>
            React + FastAPI web app: upload, longitudinal participant view,
            side-by-side session comparison, and a printable per-session PDF.
          </li>
          <li>
            Clinical validation on Liu2024 (50 acute stroke patients) and
            Liu2025 (27-patient longitudinal recovery), with all metrics
            auto-generated and published in <code>benchmarks.md</code>.
          </li>
        </ul>
      </Section>

      <Section title="Stack">
        <div className="flex flex-wrap gap-2">
          {[
            "Python", "FastAPI", "MNE-Python", "PyTorch", "ONNX Runtime",
            "scikit-learn", "Riemannian geometry", "React", "TypeScript",
            "Tailwind", "Recharts", "Hugging Face Spaces", "Kaggle GPUs",
          ].map((t) => (
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
