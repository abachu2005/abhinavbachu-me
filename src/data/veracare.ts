// Mock data for the VeraCare demo. Mirrors the frontend's mockData.ts but with
// the v2 product changes applied (modules ungated, no standalone teach-back).

export const preOpModules = [
  { id: 1, name: "Procedure overview", time: "1:34", status: "completed" as const },
  { id: 2, name: "Benefits & expectations", time: "1:12", status: "completed" as const },
  { id: 3, name: "Alternatives", time: "0:58", status: "completed" as const },
  { id: 4, name: "Risks & red flags", time: "1:58", status: "completed" as const },
  { id: 5, name: "Prep instructions", time: "1:58", status: "current" as const },
  { id: 6, name: "Recovery", time: "1:24", status: "available" as const },
  { id: 7, name: "Questions for your clinician", time: "Ongoing", status: "available" as const },
];

export const consultationSummary = {
  consultDate: "Feb 13, 2026",
  doctorName: "Dr. Patel",
  facilityName: "GI Associates",
  reasonForRecommendation:
    "Routine screening colonoscopy at age 62. No prior endoscopies on record. Indicated for population-level surveillance and detection of asymptomatic polyps.",
  keyFindings: [
    "Average-risk screening (no GI symptoms, no family history of colorectal cancer)",
    "Hypertension well controlled on lisinopril; warfarin for atrial fibrillation",
    "Recent INR within therapeutic range",
    "Patient comfortable proceeding with split-dose SUPREP",
  ],
  agreedPlan:
    "Proceed with screening colonoscopy in 4 weeks. Hold warfarin 5 days before; cardiology to coordinate bridging if indicated. SUPREP split-dose. Daughter Elena confirmed as escort.",
  plannedProcedure:
    "Screening colonoscopy (CPT 45378) under monitored anesthesia, 30-minute window.",
};

export const providerPatients = [
  {
    id: "p-1",
    name: "Maria Alvarez",
    procedure: "Screening colonoscopy",
    date: "Mar 14",
    pct: 65,
    qa: 6,
    status: "in-progress" as const,
  },
  {
    id: "p-2",
    name: "Sarah Chen",
    procedure: "Hernia repair",
    date: "Mar 21",
    pct: 42,
    qa: 12,
    status: "needs-review" as const,
  },
  {
    id: "p-3",
    name: "Michael Johnson",
    procedure: "Colonoscopy",
    date: "Mar 18",
    pct: 92,
    qa: 5,
    status: "ready" as const,
  },
  {
    id: "p-4",
    name: "James Whitmore",
    procedure: "Colonoscopy",
    date: "Mar 16",
    pct: 58,
    qa: 4,
    status: "in-progress" as const,
  },
  {
    id: "p-5",
    name: "Robert Lin",
    procedure: "Knee arthroplasty",
    date: "Mar 17",
    pct: 71,
    qa: 9,
    status: "needs-review" as const,
  },
  {
    id: "p-6",
    name: "David Park",
    procedure: "Colonoscopy",
    date: "Mar 20",
    pct: 12,
    qa: 0,
    status: "needs-review" as const,
  },
];
