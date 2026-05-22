import { useState } from "react";
import PageShell, { Section } from "@/components/layout/PageShell";
import GuidedDemo, {
  Glossary,
  type GuideStep,
} from "@/components/demo/GuidedDemo";
import VeracarePreview, {
  type VeracarePhase,
} from "@/components/demo/VeracarePreview";
import IMessageThread from "@/components/demo/iMessageThread";

export default function Veracare() {
  const [phase, setPhase] = useState<VeracarePhase>("dashboard");

  const steps: GuideStep[] = [
    {
      id: "intro",
      title: "Meet Maria",
      body: (
        <>
          <p>
            We'll walk the product as <strong>Maria Alvarez</strong>, 62,
            screening colonoscopy in 28 days, on warfarin. VeraCare's voice
            calls deliver the education, SMS carries the conversation, and
            this web app is the companion you can return to whenever you want.
          </p>
          <p>Click <strong>Next</strong> to start the tour.</p>
        </>
      ),
      advance: "next",
      onEnter: () => setPhase("dashboard"),
    },

    // -- Dashboard ----------------------------------------------------------
    {
      id: "need-help",
      target: "vc-need-help",
      placement: "bottom",
      title: "1. Always-on text line",
      body: (
        <p>
          One number across the whole product, Maria texts this number, the
          AI assistant or a nurse texts her back from this number, the voice
          call comes from this number.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("dashboard"),
    },
    {
      id: "procedure-card",
      target: "vc-procedure-card",
      placement: "right",
      title: "2. One card per procedure, click it",
      body: (
        <p>
          The progress bar tracks{" "}
          <em>which AI-voice modules she's listened to</em>, it doesn't gate
          anything. Click the card to open her procedure.
        </p>
      ),
      advance: "click",
      onEnter: () => setPhase("dashboard"),
    },

    // -- Procedure detail ---------------------------------------------------
    {
      id: "proc-chips",
      target: "vc-procedure-info-chips",
      placement: "bottom",
      title: "3. Date + location · pulled from Epic",
      body: (
        <p>
          On enrollment we{" "}
          <Glossary
            term="FHIR-pull"
            def="The Fast Healthcare Interoperability Resources protocol. We use it to read Maria's appointment, meds, allergies, and active problems directly from her clinic's Epic chart, no double-entry, no clipboard."
          />{" "}
          her chart, so the date, the suite, and the surgeon already match
          what's in her Epic record.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("procedure"),
    },
    {
      id: "module-row",
      target: "vc-module-row",
      placement: "bottom",
      title: "4. Seven voice modules · all ungated",
      body: (
        <p>
          Overview, Benefits, Alternatives, Risks, Prep, Recovery, Questions.
          No padlocks, no order, no "complete this to unlock that." Listen in
          any order; the better signal is the call's listen-percentage and the
          reply quality on the texted teach-back.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("procedure"),
    },
    {
      id: "up-next",
      target: "vc-continue-learning",
      placement: "right",
      title: "5. Up next · the next call",
      body: (
        <p>
          The system already knows the prep module is the one she hasn't
          listened to. It will <strong>call her Saturday at 10am</strong> with
          the script, and offers it inline if she wants it now.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("procedure"),
    },
    {
      id: "qa-panel",
      target: "vc-qa-panel",
      placement: "left",
      title: "6. Ask anything · same agent that texts her",
      body: (
        <p>
          This box, the SMS thread, and the after-hours voicemail all hit the
          same{" "}
          <Glossary
            term="Conversational Patient Agent"
            def="Intent-classifies the message, retrieves the relevant module snippet, drafts a patient-phrasing reply with citations, runs a teach-back micro-question when the touchpoint calls for one, and pages a nurse on red-flag or low-confidence intent."
          />
          . One conversation, three windows.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("procedure"),
    },
    {
      id: "consult-link",
      target: "vc-consult-card",
      placement: "left",
      title: "7. Click the initial consult summary",
      body: (
        <p>
          Go ahead, click the highlighted card. This was authored entirely
          from her Epic chart; nothing for the clinic to write up.
        </p>
      ),
      advance: "click",
      onEnter: () => setPhase("procedure"),
    },
    {
      id: "consult",
      title: "8. The consultation summary",
      body: (
        <p>
          Reason for recommendation, key findings, agreed plan, planned CPT,
          straight from Epic via FHIR. Maria gets a real summary; the clinic
          doesn't have to write one.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("consultation"),
    },

    // -- Risks --------------------------------------------------------------
    {
      id: "red-flag",
      target: "vc-red-flag",
      placement: "top",
      title: "9. Risks · red flags surfaced explicitly",
      body: (
        <p>
          The same phrases here also drive an{" "}
          <Glossary
            term="intent classifier"
            def="A lightweight DistilBERT fine-tune that runs in front of the LLM. Classifies inbound SMS into {logistics, med-question, red-flag, smalltalk, opt-out}. Red-flag → straight to nurse, no LLM in the path."
          />
          . If Maria texts any of these post-op, a nurse is paged, the
          assistant doesn't decide whether to escalate.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("module-risks"),
    },

    // -- Q&A grounded -------------------------------------------------------
    {
      id: "citation",
      target: "vc-citation-chip",
      placement: "right",
      title: "10. Always cited",
      body: (
        <p>
          Every answer ships with a chip that opens the exact source paragraph.
          The agent literally cannot answer without a source, that's the
          property that makes the system safe to run without a
          nurse-in-the-loop on every reply.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("qa"),
    },

    // -- Questions builder --------------------------------------------------
    {
      id: "q-cats",
      target: "vc-questions-categories",
      placement: "bottom",
      title: "11. Anything she saves goes here",
      body: (
        <p>
          Filter by topic. Bring this list to the pre-op visit, or text the
          export to the team straight from this page.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("questions"),
    },
    {
      id: "q-add",
      target: "vc-add-question-form",
      placement: "top",
      title: "12. Add your own",
      body: (
        <p>
          Categorized, timestamped, picked up by the agent on her next reply
          for the answer she actually wants.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("questions"),
    },

    // -- Journey timeline ---------------------------------------------------
    {
      id: "journey-call",
      target: "vc-tp-voicecall",
      placement: "right",
      title: "13. The compiled journey · click the prep call",
      body: (
        <p>
          A read-only timeline of every touchpoint. Generated, not edited,
          this comes straight from the patient's compiled journey instance.
          Click the prep call to open it on the platform.
        </p>
      ),
      advance: "click",
      onEnter: () => setPhase("journey"),
    },

    // -- Module page + chatbot --------------------------------------------
    {
      id: "module-text",
      target: "vc-module-text",
      placement: "right",
      title: "14. The module page · same content as the call",
      body: (
        <p>
          The voice call <em>is</em> this module. Whatever the AI voice said on
          the call is on this page, fully personalized, her warfarin date, her
          SUPREP regimen, Elena as her escort. Listen again in any of 5
          languages; no login required from the SMS link.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("module-prep"),
    },
    {
      id: "chatbot-dock",
      target: "vc-chatbot-dock",
      placement: "left",
      title: "15. The chatbot assistant · docked alongside the content",
      body: (
        <p>
          Same agent that texts her, docked to the right of the module. She
          asks "Can I have coffee Friday morning?" and gets an answer grounded
          in <em>this exact module's text</em>, not a generic LLM hallucination.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("module-prep"),
    },
    {
      id: "chat-citation",
      target: "vc-chat-citation",
      placement: "top",
      title: "16. Every answer ships with its source",
      body: (
        <p>
          The chip below the answer opens the exact paragraph the agent pulled
          from, Prep §2 in this case. The agent literally cannot answer without
          a source; that's what makes it safe to run without a
          nurse-in-the-loop on every reply.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("module-prep"),
    },

    // -- Provider -----------------------------------------------------------
    {
      id: "provider-stats",
      target: "vc-provider-stats",
      placement: "bottom",
      title: "17. Flip to the nurse's view · morning triage",
      body: (
        <p>
          Three stacks generated overnight: ready for surgery, in progress,
          needs review. A nurse triaging 60 patients in flight knows in 10
          seconds where to spend the first 30 minutes of the morning.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("provider"),
    },
    {
      id: "provider-flag",
      target: "vc-provider-needs-review",
      placement: "right",
      title: "18. Why a patient lands in 'needs review'",
      body: (
        <p>
          Missed teach-back replies, low listen-percentage on the prep call,
          or high inbound Q&amp;A volume from a single patient. The system
          surfaces <em>why</em> in the row, so the nurse doesn't have to dig.
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("provider"),
    },

    // -- Outro --------------------------------------------------------------
    {
      id: "outro",
      title: "Now the conversation itself ↓",
      body: (
        <p>
          Below the tour is Maria's actual SMS thread, in iMessage. Tap the
          blue send button to advance her side, the agent (and Nurse Whitman,
          in green, when it escalates) reply automatically through the same
          number.{" "}
          <strong>One thread per patient. That's the product.</strong>
        </p>
      ),
      advance: "next",
      onEnter: () => setPhase("dashboard"),
    },
  ];

  return (
    <PageShell
      eyebrow="Startup"
      title="VeraCare"
      tagline="A closed-loop adherence + risk system for surgical care navigation. Voice calls deliver the education, SMS carries the conversation, and a Patient Journey Compiler keeps every patient's schedule personally anchored."
      role="Founder · engineering lead"
      timeline="2025 – present"
    >
      <Section title="What it is">
        <p>
          VeraCare is a healthcare startup I co-founded. We replace the
          packets-and-phone-calls workflow that surgical clinics use to prep
          patients with an automated nurse-navigator: 2–6 personalized AI-voice
          calls per procedure (tiered by complexity), an SMS thread per patient
          that <em>also</em> goes through that same number when a nurse takes
          over, and a small companion web app for revisiting modules, saving
          questions, or printing a pre-op summary. The backend is 8 LLM-driven
          agents + 4 specialized models on top of an event-sourced data plane.
          The defensible moat isn't the LLM, it's the labeled longitudinal
          signal that compounds per-clinic per-procedure.
        </p>
      </Section>

      <Section title="Demo · Maria's journey">
        <GuidedDemo
          kicker="Guided walkthrough"
          preview={<VeracarePreview phase={phase} />}
          steps={steps}
        />
      </Section>

      <Section title="The conversation">
        <IMessageThread />
      </Section>
    </PageShell>
  );
}
