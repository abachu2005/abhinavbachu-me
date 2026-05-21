// Data for the v2 Veracare demo. Centered on Maria — the canonical example
// patient from FUTURE_DIRECTIONS.md §4.5 (screening colonoscopy, 28-day lead,
// on warfarin, later adds clopidogrel, later has a polypectomy).

export const maria = {
  firstName: "Maria",
  lastName: "Alvarez",
  age: 62,
  language: "en",
  timezone: "America/Chicago",
  procedure: "Screening colonoscopy",
  cpt: "45378",
  prepAgent: "SUPREP",
  procedureDt: "Friday, March 14, 2026 at 9:00 AM",
  facility: "GI Associates",
  provider: "Dr. Patel",
  leadDays: 28,
  consentSms: true,
  consentVoice: true,
  consentSource: "epic_registration",
  riskScore: 0.61, // P(no-show OR inadequate prep)
  riskBand: "moderate" as const,
  shap: [
    { factor: "On warfarin (anticoag hold required)", contribution: +0.18 },
    { factor: "Lead time 28d (long, more drop-off risk)", contribution: +0.09 },
    { factor: "First-time GI patient", contribution: +0.07 },
    { factor: "Escort confirmed early", contribution: -0.05 },
    { factor: "Prior MyChart sign-in within 7d", contribution: -0.04 },
  ],
};

// Procedure template (Mode A output) — minimal tier, 2 modules
export const procedureTemplate = {
  id: "tmpl_gi_screening_v3.2",
  cpt: "45378",
  tier: "minimal" as const,
  moduleCount: 2,
  status: "published",
  version: 3,
  modules: [
    {
      key: "intro_prep_call",
      title: "Intro + prep walkthrough",
      timing: "T − 25 to T − 21",
      lengthSec: 118,
      synopsis:
        "What a colonoscopy is, sedation, escort requirement, SUPREP walkthrough, NPO cutoff timing.",
    },
    {
      key: "recovery_call",
      title: "Recovery call",
      timing: "T + 0 evening",
      lengthSec: 84,
      synopsis:
        "What to expect after, anticoag restart, red-flag symptoms, when to call.",
    },
  ],
  touchpoints: [
    { key: "welcome_sms", type: "sms_action", timing: "T − lead + 1h" },
    { key: "warfarin_teachback", type: "sms_teachback", timing: "T − 7d if med:warfarin" },
    { key: "escort_check", type: "sms_action", timing: "T − 7d" },
    { key: "npo_solids", type: "sms_reminder", timing: "T − 12h" },
    { key: "supreb_dose1", type: "sms_action", timing: "T − 15h" },
    { key: "supreb_dose2", type: "sms_action", timing: "T − 5h (split)" },
    { key: "npo_clears", type: "sms_reminder", timing: "T − 2h" },
    { key: "discharge_sms", type: "sms_reminder", timing: "T + 30m" },
    { key: "surveillance_recall", type: "sms_link", timing: "T + interval (Provation)" },
  ],
  escalations: [
    { trigger: "no_reply_60m_after_dose1", severity: "soft" },
    { trigger: "no_reply_60m_after_dose2", severity: "hard" },
    { trigger: "red_flag_keyword_in_recovery", severity: "hard" },
    { trigger: "polypectomy_bleed_signs", severity: "hard" },
  ],
};

// Maria's compiled journey instance (Mode B) — 28d lead, all dates computed
export type Touchpoint = {
  id: string;
  at: string; // pretty
  type: "voice_call" | "sms_action" | "sms_teachback" | "sms_link" | "sms_reminder";
  title: string;
  status: "done" | "current" | "scheduled" | "skipped";
  channel: "voice" | "sms" | "platform";
  insertedBy?: "patch_v3" | "patch_v4";
  note?: string;
};

export const mariaTouchpoints: Touchpoint[] = [
  { id: "welcome", at: "Feb 14 · 10:00 AM", type: "sms_action", title: "Welcome + AI disclosure + opt-out", status: "done", channel: "sms" },
  { id: "intro_prep_module_call", at: "Feb 15 · 10:00 AM", type: "voice_call", title: "Intro + prep walkthrough call (118s)", status: "done", channel: "voice" },
  { id: "warfarin_teachback", at: "Mar 7 · 10:00 AM", type: "sms_teachback", title: "Warfarin hold teach-back (5-day rule)", status: "done", channel: "sms" },
  { id: "p2y12_teachback", at: "Mar 9 · 10:00 AM", type: "sms_teachback", title: "Clopidogrel hold teach-back (7-day)", status: "done", channel: "sms", insertedBy: "patch_v3", note: "Inserted by patch_v3 after cardiology added clopidogrel on Mar 5" },
  { id: "escort_check", at: "Mar 7 · 11:00 AM", type: "sms_action", title: "Escort confirmation", status: "done", channel: "sms" },
  { id: "prep_call_window", at: "Mar 12 · 11:00 AM", type: "voice_call", title: "Prep walkthrough (light reminder call)", status: "done", channel: "voice" },
  { id: "npo_solids", at: "Mar 13 · 9:00 PM", type: "sms_reminder", title: "NPO solids · midnight", status: "done", channel: "sms" },
  { id: "supreb_dose1", at: "Mar 13 · 6:00 PM", type: "sms_action", title: "SUPREP dose 1 · expects DONE / PROBLEM", status: "current", channel: "sms" },
  { id: "supreb_dose2", at: "Mar 14 · 4:00 AM", type: "sms_action", title: "SUPREP dose 2 (split) · expects DONE / PROBLEM", status: "scheduled", channel: "sms" },
  { id: "npo_clears", at: "Mar 14 · 7:00 AM", type: "sms_reminder", title: "NPO clears", status: "scheduled", channel: "sms" },
  { id: "discharge_sms", at: "Mar 14 · 11:00 AM", type: "sms_reminder", title: "Discharge SMS", status: "scheduled", channel: "sms" },
  { id: "recovery_module_call", at: "Mar 14 · 6:00 PM", type: "voice_call", title: "Recovery call — post-polypectomy branch", status: "scheduled", channel: "voice", insertedBy: "patch_v4", note: "Branch swapped from recovery_diagnostic_only by patch_v4 after Provation reported polypectomy" },
  { id: "surveillance_recall", at: "+5 years", type: "sms_link", title: "Surveillance recall (Provation-driven)", status: "scheduled", channel: "sms" },
];

// Recompile lifecycle (4 versions)
export const compileHistory = [
  {
    v: 1,
    at: "Feb 14 · 10:00 AM",
    trigger: "enroll",
    summary: "Initial compile from tmpl_gi_screening_v3.2 + Maria's Epic data. 11 dated touchpoints over 28 days.",
  },
  {
    v: 2,
    at: "Mar 2 · 2:30 PM",
    trigger: "procedure_rescheduled",
    summary: "Procedure moved Mar 12 → Mar 16 (Δ > 24h). Hard recompile. All touchpoints shifted; NPO + split-dose times re-anchored.",
  },
  {
    v: 3,
    at: "Mar 5 · 8:15 AM",
    trigger: "med_added:clopidogrel",
    summary: "Cardiology added clopidogrel. Patch insert: P2Y12 hold teach-back at T − 7d. Existing in-flight messages preserved.",
  },
  {
    v: 4,
    at: "Mar 14 · 11:20 AM",
    trigger: "provation_polypectomy",
    summary: "Provation reported polypectomy. Patch swap: recovery call → post-polypectomy bleed-watch script. Surveillance recall enabled.",
  },
];

// Unified comms thread — interleaves SMS, voice calls, platform views,
// teach-back micro-Qs, escalation, and nurse takeover.
export type ThreadEvent =
  | { kind: "date"; label: string }
  | { kind: "sms-in"; body: string; time: string; first?: boolean; last?: boolean; from?: "agent" | "nurse" }
  | { kind: "sms-out"; body: string; time: string; first?: boolean; last?: boolean; from?: "agent" | "nurse" }
  | { kind: "voice-call"; title: string; duration: string; listenedPct: number; module: string; outcome: "answered" | "voicemail"; time: string }
  | { kind: "platform-view"; what: string; time: string }
  | { kind: "system"; label: string; tone?: "info" | "alert" | "success"; time?: string }
  | { kind: "teachback-q"; body: string; time: string }
  | { kind: "teachback-result"; passed: boolean; time: string };

export const mariaThread: ThreadEvent[] = [
  { kind: "date", label: "Friday, Feb 14 · 10:00 AM" },
  {
    kind: "sms-in",
    first: true,
    body: "Hi Maria — this is GI Associates' care team, on behalf of Dr. Patel. We'll text you a few times before your colonoscopy on Mar 14 with reminders and one quick voice call with your prep walkthrough. Reply STOP to opt out at any time. Reply HELP for help. Msg & data rates may apply.",
    time: "10:00 AM",
  },
  {
    kind: "sms-in",
    body: "This thread is the same number our nurses use — if anything looks off, just text us. Some replies are handled by an AI assistant; a nurse takes over for anything clinical.",
    last: true,
    time: "10:00 AM",
  },
  { kind: "sms-out", first: true, last: true, body: "OK", time: "10:02 AM" },

  { kind: "date", label: "Saturday, Feb 15 · 10:00 AM" },
  {
    kind: "voice-call",
    title: "Intro + prep walkthrough",
    duration: "1:58",
    listenedPct: 94,
    module: "intro_prep_call",
    outcome: "answered",
    time: "10:00 AM",
  },
  {
    kind: "sms-in",
    first: true,
    last: true,
    body: "Just called with your prep walkthrough. Re-listen or read the script here any time: vera.care/m/intro-prep · No login needed.",
    time: "10:02 AM",
  },
  { kind: "platform-view", what: "Maria opened the prep module on the platform · played audio 1x", time: "10:14 AM" },

  { kind: "date", label: "Saturday, Mar 7 · 10:00 AM" },
  {
    kind: "sms-in",
    first: true,
    last: true,
    body: "Quick check Maria — to be safe during your colonoscopy, when do you stop your warfarin? Reply 1) the morning of, 2) the night before, 3) 5 days before, 4) not sure.",
    time: "10:00 AM",
  },
  { kind: "teachback-q", body: "warfarin_hold_5d · expects 3 · attempt 1", time: "10:00 AM" },
  { kind: "sms-out", first: true, last: true, body: "3", time: "10:04 AM" },
  { kind: "teachback-result", passed: true, time: "10:04 AM" },
  { kind: "sms-in", first: true, last: true, body: "That's right — Dr. Patel's instructions are 5 days before. Last dose: Sat Mar 8. We'll remind you. Reply HELP if anything changes.", time: "10:04 AM" },

  { kind: "date", label: "Saturday, Mar 7 · 11:00 AM" },
  { kind: "sms-in", first: true, last: true, body: "Who's driving you home on Mar 14? (Reply with their first name — they must come into the building with you at check-in.)", time: "11:00 AM" },
  { kind: "sms-out", first: true, last: true, body: "My daughter Elena", time: "12:18 PM" },
  { kind: "sms-in", first: true, last: true, body: "Got it — Elena, escort. Want us to text her the day-of instructions too? Reply YES to add her.", time: "12:18 PM" },
  { kind: "sms-out", first: true, last: true, body: "Yes", time: "12:22 PM" },
  { kind: "system", label: "Caregiver added: Elena Alvarez (daughter) — SMS consent captured on this thread.", tone: "success", time: "12:22 PM" },

  { kind: "date", label: "Monday, Mar 9 · 10:00 AM" },
  { kind: "system", label: "patch_v3 — clopidogrel added in Epic on Mar 5 · P2Y12 hold teach-back inserted at T − 7d.", tone: "info", time: "10:00 AM" },
  { kind: "sms-in", first: true, last: true, body: "One more — your cardiologist added Plavix (clopidogrel). When do you stop it before Mar 14? Reply 1) day of, 2) 3 days before, 3) 7 days before, 4) not sure.", time: "10:00 AM" },
  { kind: "sms-out", first: true, last: true, body: "I don't know", time: "10:12 AM" },
  { kind: "teachback-result", passed: false, time: "10:12 AM" },
  { kind: "sms-in", first: true, last: true, body: "No worries — the answer is 3) seven days before, so last dose Mon Mar 7. Here's Dr. Patel's note on why: vera.care/m/clopidogrel-hold. I'll text you a check-in on Mar 7 next time.", time: "10:12 AM" },

  { kind: "date", label: "Friday, Mar 13 · 6:00 PM" },
  { kind: "sms-in", first: true, last: true, body: "Maria — time for SUPREP dose 1. Mix 6oz SUPREP with water to the 16oz line, drink within 15 min, then 32oz of water over the next hour. Reply DONE when done, or PROBLEM if you can't tolerate it.", time: "6:00 PM" },
  { kind: "sms-out", first: true, last: true, body: "PROBLEM — i'm nauseous and threw up some of it", time: "7:14 PM" },
  { kind: "system", label: "Intent classifier · problem (nausea + emesis · 0.91). Conversational Agent paged the on-call nurse.", tone: "alert", time: "7:14 PM" },
  { kind: "system", label: "Escalation fired · severity=soft · SLA 30 min · routed to Nurse Whitman.", tone: "alert", time: "7:14 PM" },
  { kind: "sms-in", first: true, last: true, body: "Hi Maria, this is Nurse Whitman at GI Associates — I see your message. How much did you keep down? Take a 30-minute break, then sip the rest slowly. I'll stay with you in this thread.", time: "7:19 PM" },
  { kind: "system", label: "Nurse takeover — replies in this thread are now nurse-authored, not agent.", tone: "info", time: "7:19 PM" },
  { kind: "sms-out", first: true, last: true, body: "i'd say about half. ok i'll try again in 30", time: "7:21 PM" },
  { kind: "sms-in", first: true, last: true, body: "Good. If you throw up the rest, text me — we have a backup plan. For now keep sipping water through 8:30pm.", time: "7:22 PM", from: "nurse" },

  { kind: "date", label: "Friday, Mar 13 · 9:00 PM" },
  { kind: "sms-out", first: true, last: true, body: "Got the rest down. Feeling ok.", time: "9:04 PM" },
  { kind: "sms-in", first: true, last: true, body: "Perfect. Dose 2 is at 4am — I'll text. NPO from now (no solids). Try to sleep.", time: "9:05 PM", from: "nurse" },

  { kind: "date", label: "Saturday, Mar 14 · 4:00 AM" },
  { kind: "sms-in", first: true, last: true, body: "Maria — dose 2 time. Same mix, same way. Then 32oz water by 5am. Reply DONE.", time: "4:00 AM" },
  { kind: "sms-out", first: true, last: true, body: "DONE", time: "4:42 AM" },

  { kind: "date", label: "Saturday, Mar 14 · 6:00 PM" },
  { kind: "system", label: "patch_v4 — Provation reported polypectomy at 11:20 AM · recovery branch swapped to post-polypectomy bleed-watch.", tone: "info", time: "6:00 PM" },
  { kind: "voice-call", title: "Recovery call — post-polypectomy", duration: "1:24", listenedPct: 100, module: "recovery_post_polypectomy", outcome: "answered", time: "6:00 PM" },
  { kind: "sms-in", first: true, last: true, body: "Recap of the call — light bleeding can happen for ~48h, that's expected. Heavy bleeding, fever >100.4°F, or severe pain → call us at (555) 789-0123. Resume warfarin Mon Mar 16. Re-listen: vera.care/m/recovery", time: "6:02 PM" },
];

// Provider morning queue — 4 triage stacks (matches MorningQueuePage.tsx)
export type QueueItem = {
  patient: string;
  episode: string;
  why: string;
  riskScore?: number;
  hoursSilent?: number;
  recallDue?: string;
  severity?: "soft" | "hard";
  isMaria?: boolean;
};

export const morningQueue: {
  openEscalations: QueueItem[];
  highRiskToday: QueueItem[];
  ghosted: QueueItem[];
  surveillanceRecall: QueueItem[];
} = {
  openEscalations: [
    { patient: "Maria Alvarez", episode: "Colonoscopy · Mar 14", why: "Nausea + emesis after SUPREP dose 1 · Nurse Whitman engaged", severity: "soft", isMaria: true },
    { patient: "Robert Lin", episode: "Knee arthroplasty · Mar 17", why: "Calf swelling reported in chat · red-flag keyword: DVT", severity: "hard" },
  ],
  highRiskToday: [
    { patient: "Sarah Chen", episode: "Hernia repair · Mar 21", why: "Risk 0.78 · missed two teach-backs · no escort confirmed", riskScore: 0.78 },
    { patient: "Maria Alvarez", episode: "Colonoscopy · Mar 14", why: "Risk 0.61 · on warfarin + clopidogrel · today is procedure day", riskScore: 0.61, isMaria: true },
    { patient: "James Whitmore", episode: "Colonoscopy · Mar 16", why: "Risk 0.66 · 2-day lead · no anticoag teach-back yet", riskScore: 0.66 },
  ],
  ghosted: [
    { patient: "David Park", episode: "Colonoscopy · Mar 20", why: "Silent 84h after welcome SMS", hoursSilent: 84 },
  ],
  surveillanceRecall: [
    { patient: "Linda Mason", episode: "5-yr surveillance (prior polypectomy)", why: "Recall due May 2031", recallDue: "May 12, 2031" },
  ],
};

// The 8 agents + 4 specialized models (matches FUTURE_DIRECTIONS §4.6)
export const agents = [
  { num: 1, name: "Procedure Authoring Agent", group: "Authoring", trigger: "New procedure added by clinic", body: "Conversational interview with the clinical lead. Outputs structured procedure characteristics (CPT, anatomy, in/out, recovery, PT/ICU/lifestyle, prep agent) → tier (2–6 modules) → proposed module breakdown.", hil: true },
  { num: 2, name: "Script Generator", group: "Authoring", trigger: "Clinician approves Agent #1's breakdown", body: "Generates voice-call scripts with {{personalization slots}} + paired text fallback versions in every supported language. Hard cap 90–120s spoken.", hil: true },
  { num: 3, name: "Clinical Safety Reviewer", group: "Authoring + runtime gate", trigger: "Any LLM-generated content before publish/send", body: "Pass/fail gate: reading level ≤ 6th grade, no diagnosis or med-advice changes, no contradictions with clinical guidelines, PHI-safe.", hil: true },
  { num: 4, name: "Patient Journey Compiler", group: "Patient lifecycle", trigger: "Enrollment OR EHR/Provation event OR risk recompute", body: "Per-patient compiled journey instance. Two modes: full compile on enrollment, patch on event. Every compile is versioned and auditable.", hil: false },
  { num: 5, name: "Conversational Patient Agent", group: "Runtime", trigger: "Inbound SMS / voicemail transcript / in-app message", body: "Intent dispatch: question → RAG over module text; problem → triage tree; teachback → evaluate; silence → re-engage. Tool calls: lookup module, escalate, reschedule, evaluate teach-back.", hil: false },
  { num: 6, name: "Provider Chat Agent", group: "Runtime", trigger: "Provider question", body: "Tool-calling answers over patient and clinic data. Stays scoped to the asking provider's care team.", hil: false },
  { num: 7, name: "Provider Summarizer", group: "Runtime + cron", trigger: "6 AM cron / nurse-call completion / hard escalation", body: "One agent, three output templates: morning-queue narrative, nurse-call note draft, escalation briefing.", hil: false },
  { num: 8, name: "Variant Proposer", group: "Continuous learning", trigger: "Weekly cron + clinician suggestion", body: "Reads top- and bottom-performing variants from the bandit; proposes new message and script variants to add to the variant pool.", hil: false },
];

export const specializedModels = [
  { name: "Risk model", tech: "XGBoost / LightGBM", purpose: "P(no-show), P(inadequate prep), P(adverse event), P(missed surveillance) + SHAP per-factor decomposition." },
  { name: "Intent classifier", tech: "Small fine-tuned model", purpose: "Tags inbound messages — done / problem / question / optout / red_flag + symptom extraction. Cheap, fast, deterministic — runs in front of the LLM." },
  { name: "TTS", tech: "Google Cloud TTS · ElevenLabs", purpose: "Renders personalized voice-call audio per script + slot values + language. Cached by (script_version, personalization_hash, language)." },
  { name: "ASR", tech: "Whisper · Deepgram", purpose: "Transcribes voicemails and inbound calls into the unified thread as `voice` messages." },
];
