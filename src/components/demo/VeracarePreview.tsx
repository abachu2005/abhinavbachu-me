import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  GitCommit,
  HelpCircle,
  Languages,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Send,
  ShieldAlert,
  Sparkles,
  Volume2,
} from "lucide-react";
import {
  consultationSummary,
  preOpModules,
  providerPatients,
} from "@/data/veracare";
import {
  compileHistory,
  maria,
  mariaTouchpoints,
  procedureTemplate,
} from "@/data/veracareV2";
import type { ReactNode } from "react";

export type VeracarePhase =
  | "dashboard"
  | "journey"
  | "procedure"
  | "module-prep"
  | "module-risks"
  | "qa"
  | "questions"
  | "consultation"
  | "summary"
  | "compiler"
  | "template-authoring"
  | "provider";

// ============================================================================
// Frame
// ============================================================================

export default function VeracarePreview({ phase }: { phase: VeracarePhase }) {
  const isProvider = phase === "provider" || phase === "template-authoring";
  return (
    <div
      className="overflow-hidden rounded-xl border shadow-sm"
      style={{
        background: "#f8fafc",
        borderColor: "#e2e8f0",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: "#0F1F3D",
        letterSpacing: "-0.01em",
      }}
    >
      <TopNav isProvider={isProvider} />
      <div style={{ minHeight: 540, padding: "20px 22px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
          >
            <ScreenMock phase={phase} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TopNav({ isProvider }: { isProvider: boolean }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        borderBottom: "1px solid rgba(226,232,240,0.6)",
        boxShadow: "0 2px 10px rgba(15, 31, 61, 0.05)",
        padding: "10px 22px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background:
                "linear-gradient(135deg, #3B4FD8 0%, #2A3BB0 100%)",
              color: "white",
              display: "grid",
              placeItems: "center",
              fontFamily: "Georgia, serif",
              fontSize: 16,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            V
          </div>
          <span style={{ fontSize: 17, fontWeight: 600, color: "#0F1F3D" }}>
            VeraCare
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 999,
              background: "#fef3c7",
              border: "1px solid #d97706",
              padding: "1px 7px",
              fontSize: 9.5,
              fontWeight: 700,
              color: "#b45309",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Demo
          </span>
        </div>
        {!isProvider && (
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ fontSize: 12.5, fontWeight: 500, color: "#3B4FD8" }}>
              Dashboard
            </span>
            <span style={{ fontSize: 12.5, color: "#475569" }}>
              Provider
            </span>
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#475569" }}>
        <span>Hi, {isProvider ? "Nurse Whitman" : "Maria"}</span>
        <ChevronDown size={14} />
      </div>
    </div>
  );
}

function ScreenMock({ phase }: { phase: VeracarePhase }) {
  switch (phase) {
    case "dashboard":
      return <DashboardMock />;
    case "journey":
      return <JourneyTimelineMock />;
    case "procedure":
      return <ProcedureMock />;
    case "module-prep":
      return <PrepModuleMock />;
    case "module-risks":
      return <RisksModuleMock />;
    case "qa":
      return <QaMock />;
    case "questions":
      return <QuestionsBuilderMock />;
    case "consultation":
      return <ConsultationMock />;
    case "summary":
      return <SummaryMock />;
    case "compiler":
      return <CompilerMock />;
    case "template-authoring":
      return <TemplateAuthoringMock />;
    case "provider":
      return <ProviderDashboardMock />;
  }
}

// ============================================================================
// Design primitives, v1 magic-aesthetic
// ============================================================================

function VcCard({
  children,
  accent,
  padding = 18,
  tourId,
  clickable,
  onClick,
}: {
  children: ReactNode;
  accent?: boolean;
  padding?: number;
  tourId?: string;
  clickable?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      data-tour-id={tourId}
      onClick={onClick}
      style={{
        background: "white",
        borderRadius: 12,
        border: accent
          ? "1px solid rgba(59,79,216,0.3)"
          : "1px solid rgba(226,232,240,0.6)",
        boxShadow: "0 2px 10px rgba(15, 31, 61, 0.05)",
        padding,
        cursor: clickable ? "pointer" : "default",
        position: "relative",
      }}
    >
      {accent && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: "#3B4FD8",
            borderRadius: "0 2px 2px 0",
          }}
        />
      )}
      {children}
    </div>
  );
}

function GradientBar({ pct, h = 6 }: { pct: number; h?: number }) {
  return (
    <div
      style={{
        width: "100%",
        height: h,
        background: "rgba(226,232,240,0.7)",
        borderRadius: 999,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: "linear-gradient(to right, #2A3BB0, #5C6DE0)",
          borderRadius: 999,
          transition: "width 800ms ease-out",
        }}
      />
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "ready" | "in-progress" | "needs-review" | "completed";
}) {
  const map = {
    "in-progress": { bg: "#eff6ff", fg: "#3B4FD8", border: "#3B4FD8", label: "In progress" },
    ready: { bg: "#dcfce7", fg: "#15803d", border: "#16a34a", label: "Ready" },
    completed: { bg: "#dcfce7", fg: "#15803d", border: "#16a34a", label: "Completed" },
    "needs-review": { bg: "#fef3c7", fg: "#b45309", border: "#d97706", label: "Needs review" },
  } as const;
  const s = map[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 999,
        border: `1px solid ${s.border}`,
        background: s.bg,
        color: s.fg,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}

function Eyebrow({ children, color = "#3B4FD8" }: { children: ReactNode; color?: string }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color,
      }}
    >
      {children}
    </span>
  );
}

// ============================================================================
// Dashboard
// ============================================================================

function DashboardMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#0F1F3D", margin: 0, letterSpacing: "-0.02em" }}>
          Hi, Maria
        </h1>
        <p style={{ fontSize: 12.5, color: "#475569", margin: "3px 0 0" }}>
          Welcome to your VeraCare dashboard.
        </p>
      </div>

      <div
        data-tour-id="vc-need-help"
        style={{
          background: "#EEF2FF",
          border: "1px solid rgba(59,79,216,0.15)",
          borderRadius: 12,
          padding: "11px 14px",
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          boxShadow: "0 2px 10px rgba(15, 31, 61, 0.05)",
        }}
      >
        <AlertCircle size={16} color="#3B4FD8" style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 12.5, fontWeight: 500, color: "#0F1F3D", margin: 0 }}>
            Need help now?
          </p>
          <p style={{ fontSize: 11.5, color: "#334155", margin: "1px 0 0" }}>
            For urgent medical issues, call 911 or text us, same number as the office.
          </p>
        </div>
        <span style={{ fontSize: 11.5, fontWeight: 500, color: "#3B4FD8" }}>
          Contact info
        </span>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Calendar size={16} color="#3B4FD8" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
            Upcoming procedures
          </h2>
        </div>

        <div data-tour-id="vc-procedure-card">
          <VcCard padding={18} clickable>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
                  Screening colonoscopy
                </h3>
                <p style={{ fontSize: 12, color: "#475569", margin: "2px 0 0" }}>
                  GI Associates · Dr. Patel
                </p>
                <p style={{ fontSize: 11.5, color: "#64748b", margin: "1px 0 0" }}>
                  2400 Medical Plaza Dr, Suite 200
                </p>
              </div>
              <StatusBadge status="in-progress" />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12, color: "#475569", margin: "8px 0 10px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <Calendar size={12} />
                Sat, Mar 14, 2026
              </span>
              <span>•</span>
              <span>9:00 AM</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: "#475569", marginBottom: 4 }}>
              <span>Voice modules listened</span>
              <span>4 of 7</span>
            </div>
            <GradientBar pct={65} />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid rgba(241,245,249,0.8)",
              }}
            >
              <span data-tour-id="vc-continue-btn" style={{ fontSize: 12, fontWeight: 500, color: "#3B4FD8" }}>
                Open journey
              </span>
              <ChevronRight size={16} color="#3B4FD8" />
            </div>
          </VcCard>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Calendar size={16} color="#3B4FD8" />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
            Past procedures
          </h2>
        </div>
        <VcCard padding={14}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
                None yet
              </p>
              <p style={{ fontSize: 11.5, color: "#64748b", margin: "1px 0 0" }}>
                Your prior procedures will show up here once they're complete.
              </p>
            </div>
          </div>
        </VcCard>
      </div>
    </div>
  );
}

// ============================================================================
// Journey timeline (the read-only "what to expect")
// ============================================================================

function JourneyTimelineMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#475569" }}>
        <ArrowLeft size={13} />
        <span>Back to dashboard</span>
      </div>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0F1F3D", margin: 0, letterSpacing: "-0.02em" }}>
          Your journey
        </h1>
        <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0", display: "inline-flex", alignItems: "center", gap: 5 }}>
          <CalendarClock size={12} />
          {maria.procedureDt} · {mariaTouchpoints.filter((t) => t.status === "done").length} done · {mariaTouchpoints.filter((t) => t.status !== "done").length} upcoming
        </p>
      </div>

      <VcCard padding={12}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
          <Sparkles size={13} color="#3B4FD8" />
          <Eyebrow>How prep actually works</Eyebrow>
        </div>
        <p style={{ fontSize: 11.5, color: "#475569", margin: 0, lineHeight: 1.5 }}>
          Most of your prep happens by <strong>voice call + text</strong>. This page is a read-only
          reference, re-listen to anything you missed, no login required from the link in your texts.
        </p>
      </VcCard>

      <div style={{ position: "relative", paddingLeft: 22 }}>
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 11,
            top: 6,
            bottom: 6,
            width: 1,
            background: "#e2e8f0",
          }}
        />
        {mariaTouchpoints.slice(0, 9).map((tp) => {
          const Icon =
            tp.channel === "voice" ? Phone : tp.channel === "sms" ? MessageCircle : CalendarClock;
          const dotColor =
            tp.status === "done"
              ? "#3B4FD8"
              : tp.status === "current"
                ? "#d97706"
                : "#94a3b8";
          return (
            <div
              key={tp.id}
              data-tour-id={tp.id === "intro_prep_module_call" ? "vc-tp-voicecall" : undefined}
              style={{
                position: "relative",
                marginBottom: 7,
              }}
            >
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: -16,
                  top: 11,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: tp.status === "done" ? "#3B4FD8" : "white",
                  border: tp.status === "done" ? "none" : `2px solid ${dotColor}`,
                  boxShadow: tp.status === "current" ? "0 0 0 4px rgba(217,119,6,0.15)" : "none",
                }}
              />
              <VcCard padding={10}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Icon size={12} color={dotColor} />
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>{tp.title}</p>
                    </div>
                    <p style={{ fontSize: 10.5, color: "#64748b", margin: "2px 0 0" }}>{tp.at} · {tp.channel}</p>
                    {tp.note && (
                      <p style={{ fontSize: 10, color: "#3B4FD8", margin: "3px 0 0", fontStyle: "italic" }}>
                        {tp.note}
                      </p>
                    )}
                  </div>
                  {tp.status === "done" && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 3, borderRadius: 999, border: "1px solid #16a34a", background: "#dcfce7", color: "#15803d", padding: "1px 7px", fontSize: 9.5, fontWeight: 600 }}>
                      <Check size={9} strokeWidth={3} />
                      Done
                    </span>
                  )}
                  {tp.status === "current" && (
                    <span style={{ borderRadius: 999, border: "1px solid #d97706", background: "#fef3c7", color: "#b45309", padding: "1px 7px", fontSize: 9.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>
                      Now
                    </span>
                  )}
                  {tp.status === "scheduled" && (
                    <span style={{ borderRadius: 999, border: "1px solid #cbd5e1", background: "#f1f5f9", color: "#475569", padding: "1px 7px", fontSize: 9.5, fontWeight: 600 }}>
                      Scheduled
                    </span>
                  )}
                </div>
              </VcCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Procedure detail, v1 layout, ungated modules, no locked consent
// ============================================================================

function ProcedureMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#475569" }}>
        <ArrowLeft size={13} />
        <span>Back to dashboard</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
          gap: 12,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <VcCard padding={16}>
            <h1 style={{ fontSize: 17, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
              Screening colonoscopy
            </h1>
            <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 12px" }}>
              Your procedure information
            </p>

            <div data-tour-id="vc-procedure-info-chips" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ background: "rgba(238,242,255,0.5)", borderRadius: 10, padding: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: "#64748b" }}>
                  <Calendar size={12} />
                  Date & time
                </div>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "#0F1F3D", margin: "2px 0 0" }}>
                  Sat Mar 14, 2026 at 9:00 AM
                </p>
              </div>
              <div style={{ background: "rgba(238,242,255,0.5)", borderRadius: 10, padding: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10.5, color: "#64748b" }}>
                  <MapPin size={12} />
                  Location
                </div>
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "#0F1F3D", margin: "2px 0 0" }}>
                  GI Associates
                </p>
                <p style={{ fontSize: 10.5, color: "#475569", margin: "1px 0 0" }}>
                  2400 Medical Plaza Dr
                </p>
              </div>
            </div>
          </VcCard>

          <VcCard padding={16} tourId="vc-your-progress">
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#0F1F3D", margin: "0 0 10px" }}>
              Voice modules · listen anytime
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <GradientBar pct={65} h={8} />
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 500, color: "#334155", whiteSpace: "nowrap" }}>
                4/7
              </span>
            </div>

            {/* Ungated module row, every dot accessible, no padlocks */}
            <div data-tour-id="vc-module-row" style={{ display: "flex", alignItems: "center", padding: "0 4px" }}>
              {preOpModules.map((m, idx) => {
                const isCompleted = m.status === "completed";
                const isCurrent = m.status === "current";
                const prevCompleted = idx > 0 && preOpModules[idx - 1].status === "completed";
                return (
                  <div key={m.id} style={{ display: "flex", alignItems: "center", flex: idx === 0 ? 0 : "1 0 auto" }}>
                    {idx > 0 && (
                      <div
                        style={{
                          flex: 1,
                          height: 2,
                          background: prevCompleted ? "#3B4FD8" : "#e2e8f0",
                          minWidth: 8,
                        }}
                      />
                    )}
                    <div
                      title={m.name}
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        background: isCompleted ? "#3B4FD8" : "white",
                        border: isCompleted
                          ? "none"
                          : isCurrent
                            ? "2px solid #3B4FD8"
                            : "2px solid #cbd5e1",
                        color: isCompleted ? "white" : isCurrent ? "#3B4FD8" : "#475569",
                        fontSize: 11.5,
                        fontWeight: 600,
                        boxShadow: isCurrent ? "0 0 0 4px rgba(59,79,216,0.1)" : "none",
                        cursor: "pointer",
                      }}
                    >
                      {isCompleted ? <Check size={13} strokeWidth={3} /> : idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: 10, color: "#94a3b8", margin: "10px 0 0", textAlign: "center" }}>
              Overview → Benefits → Alternatives → Risks → <strong style={{ color: "#3B4FD8" }}>Prep</strong> → Recovery → Questions · all open, listen in any order
            </p>
          </VcCard>

          <div
            data-tour-id="vc-continue-learning"
            style={{
              background: "#fffbeb",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 12,
              padding: 14,
              boxShadow: "0 2px 10px rgba(15, 31, 61, 0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <BookOpen size={15} color="#b45309" />
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
                Up next
              </h2>
            </div>
            <p style={{ fontSize: 11.5, color: "#475569", margin: "0 0 10px" }}>
              You haven't listened to: <strong style={{ color: "#0F1F3D" }}>Prep instructions</strong> · we'll call you at <strong>Sat 10am</strong>, or open it now
            </p>
            <button
              data-tour-id="vc-continue-learning-btn"
              style={{
                width: "100%",
                background: "#d97706",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Open the prep module
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <VcCard padding={14}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "#EEF2FF",
                  borderRadius: 8,
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 8,
                }}
              >
                <ClipboardList size={16} color="#3B4FD8" />
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
                Prep checklist
              </p>
              <p style={{ fontSize: 10.5, color: "#64748b", margin: "2px 0 0" }}>
                Things to do before Mar 14
              </p>
            </VcCard>
            <VcCard tourId="vc-consult-card" padding={14} clickable>
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: "#EEF2FF",
                  borderRadius: 8,
                  display: "grid",
                  placeItems: "center",
                  marginBottom: 8,
                }}
              >
                <FileText size={16} color="#3B4FD8" />
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
                Initial consult summary
              </p>
              <p style={{ fontSize: 10.5, color: "#64748b", margin: "2px 0 0" }}>
                Why surgery was recommended
              </p>
            </VcCard>
          </div>
        </div>

        {/* RIGHT: Grounded Q&A panel */}
        <div data-tour-id="vc-qa-panel" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <VcCard padding={14}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6 }}>
              <HelpCircle size={13} color="#3B4FD8" />
              <Eyebrow>Ask the team</Eyebrow>
            </div>
            <p style={{ fontSize: 11.5, color: "#475569", margin: "0 0 10px" }}>
              Same number as your texts. Answered by the assistant or a nurse, your reply lands in one thread.
            </p>
            <div
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 10,
                padding: "8px 10px",
                fontSize: 12,
                color: "#0F1F3D",
                marginBottom: 8,
              }}
            >
              What are the transportation requirements?
            </div>
            <button
              data-tour-id="vc-ask-btn"
              style={{
                width: "100%",
                background: "#3B4FD8",
                color: "white",
                border: "none",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Send size={12} />
              Ask
            </button>
            <p style={{ fontSize: 10, color: "#94a3b8", margin: "8px 0 0" }}>
              Try: When can I drive? · What pain is normal?
            </p>
          </VcCard>

          <VcCard tourId="vc-questions-card" padding={14} clickable>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
              <MessageCircle size={13} color="#3B4FD8" />
              <Eyebrow>My questions (3)</Eyebrow>
            </div>
            <p style={{ fontSize: 11.5, color: "#0F1F3D", margin: 0 }}>
              3 saved across Prep, Risks, Recovery
            </p>
          </VcCard>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Prep module, v1 module page: streaming text + right-docked chatbot
// ============================================================================

function PrepModuleMock() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.6fr) minmax(280px, 320px)", gap: 14, alignItems: "start" }}>
      <ModulePageColumn />
      <ChatbotDockColumn />
    </div>
  );
}

function ModulePageColumn() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#475569" }}>
        <span style={{ color: "#94a3b8" }}>Dashboard</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#94a3b8" }}>Procedure</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#0F1F3D", fontWeight: 500 }}>Prep instructions</span>
      </div>

      <VcCard padding={0}>
        {/* Header */}
        <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(226,232,240,0.7)" }}>
          <h1 style={{ fontSize: 17, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
            Prep instructions
          </h1>
          <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 10px" }}>
            Everything you need to do in the 24 hours before your colonoscopy.
          </p>

          <div data-tour-id="vc-audio-player" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "#dbeafe",
                color: "#1d4ed8",
                border: "none",
                borderRadius: 8,
                padding: "5px 11px",
                fontSize: 11.5,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Volume2 size={13} />
              Listen
            </button>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                background: "#f1f5f9",
                color: "#334155",
                border: "none",
                borderRadius: 8,
                padding: "5px 11px",
                fontSize: 11.5,
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <Languages size={13} />
              English ▾
            </button>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#94a3b8" }}>
              1:58 spoken
            </span>
          </div>
        </div>

        {/* Streaming text content */}
        <div
          data-tour-id="vc-module-text"
          style={{
            padding: "16px 18px",
            maxHeight: 320,
            overflowY: "auto",
            color: "#1e293b",
            fontSize: 13,
            lineHeight: 1.65,
          }}
        >
          <p style={{ margin: 0 }}>
            Hi Maria, this is your prep walkthrough for your colonoscopy on{" "}
            <strong style={{ color: "#0F1F3D" }}>Saturday, March 14th</strong>. The most
            important part is what you do in the{" "}
            <span style={{ background: "#dbeafe", padding: "0 3px", borderRadius: 3, fontWeight: 600 }}>
              24 hours before
            </span>{" "}, so let's walk through it together.
          </p>
          <p style={{ marginTop: 10 }}>
            <strong style={{ color: "#0F1F3D" }}>Medications.</strong> Per Dr. Patel,
            your warfarin should already be paused, last dose was Saturday March 8th.
            Your blood pressure medication (lisinopril) is fine to take the morning of,
            with a small sip of water.
          </p>
          <p style={{ marginTop: 10 }}>
            <strong style={{ color: "#0F1F3D" }}>Fasting.</strong> Nothing by mouth after
            midnight Friday, no water, coffee, juice, gum, or mints. We know it's a long
            stretch; that's why we schedule colonoscopies in the morning.
          </p>
          <p style={{ marginTop: 10 }}>
            <strong style={{ color: "#0F1F3D" }}>SUPREP, the prep drink.</strong> Dose 1
            is{" "}
            <span style={{ background: "#fef3c7", padding: "0 3px", borderRadius: 3, fontWeight: 600 }}>
              Friday at 6pm
            </span>
            : mix the 6oz bottle with water to the 16oz line, drink within 15 minutes,
            then 32oz of water over the next hour. Dose 2 is at 4am Saturday, same mix,
            same way. We'll text you when it's time.
          </p>
          <p style={{ marginTop: 10 }}>
            <strong style={{ color: "#0F1F3D" }}>Day-of logistics.</strong> Arrive at
            8:30am, room 200. Elena is confirmed as your escort, she'll need to come
            into the building with you at check-in, and she's the one who drives you home
            afterward.
          </p>
          <p style={{ marginTop: 10, color: "#475569", fontStyle: "italic" }}>
            That's the whole prep. If anything feels off the day before, just text us at
            this same number, someone's always on. Talk to you Friday.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 18px",
            background: "rgba(248,250,252,0.7)",
            borderTop: "1px solid rgba(226,232,240,0.7)",
            display: "flex",
            gap: 8,
          }}
        >
          <button
            style={{
              flex: 1,
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "7px 12px",
              fontSize: 12,
              fontWeight: 500,
              color: "#475569",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <ArrowLeft size={12} />
            Back to procedure
          </button>
          <button
            style={{
              flex: 1,
              background: "#3B4FD8",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "7px 12px",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            Continue
            <ChevronRight size={12} />
          </button>
        </div>
      </VcCard>
    </div>
  );
}

function ChatbotDockColumn() {
  return (
    <div
      data-tour-id="vc-chatbot-dock"
      style={{
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(8px)",
        borderRadius: 12,
        border: "1px solid rgba(226,232,240,0.7)",
        boxShadow: "-4px 0 18px -10px rgba(15,31,61,0.12)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: 460,
      }}
    >
      <div
        style={{
          padding: "11px 14px",
          borderBottom: "1px solid rgba(226,232,240,0.7)",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "#EEF2FF",
            display: "grid",
            placeItems: "center",
          }}
        >
          <Sparkles size={14} color="#3B4FD8" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
            Ask anything
          </p>
          <p style={{ fontSize: 10.5, color: "#64748b", margin: 0 }}>
            Grounded in your procedure pack
          </p>
        </div>
      </div>

      <div style={{ flex: 1, padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
        {/* User question bubble */}
        <div style={{ alignSelf: "flex-end", maxWidth: "85%" }}>
          <div
            style={{
              background: "#3B4FD8",
              color: "white",
              borderRadius: "14px 14px 4px 14px",
              padding: "7px 11px",
              fontSize: 12,
              lineHeight: 1.4,
            }}
          >
            Can I have coffee Friday morning?
          </div>
        </div>

        {/* Agent response bubble */}
        <div style={{ alignSelf: "flex-start", maxWidth: "92%" }}>
          <div
            style={{
              background: "#f1f5f9",
              color: "#0F1F3D",
              borderRadius: "14px 14px 14px 4px",
              padding: "8px 11px",
              fontSize: 12,
              lineHeight: 1.45,
            }}
          >
            <strong>No coffee</strong> after midnight Thursday, that includes black
            coffee and tea. Water and clear liquids are also out once SUPREP dose 1
            starts at 6pm Friday.
            <div
              data-tour-id="vc-chat-citation"
              style={{
                marginTop: 7,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 999,
                padding: "2px 8px",
                fontSize: 10,
                color: "#475569",
              }}
            >
              <FileText size={9} />
              Prep instructions · §2
            </div>
          </div>
        </div>

        {/* Follow-up suggestions */}
        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 5 }}>
          <p style={{ fontSize: 9.5, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5, margin: 0 }}>
            Suggested
          </p>
          {[
            "What if I forget and have water?",
            "What pain is normal after?",
            "Can Elena drop me at the door?",
          ].map((s) => (
            <button
              key={s}
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "6px 9px",
                fontSize: 11,
                color: "#334155",
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(226,232,240,0.7)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 10,
            padding: "5px 8px 5px 11px",
          }}
        >
          <span style={{ flex: 1, fontSize: 11.5, color: "#94a3b8" }}>
            Ask about prep, risks, recovery…
          </span>
          <button
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "#3B4FD8",
              border: "none",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
            }}
          >
            <Send size={11} color="white" />
          </button>
        </div>
        <p style={{ fontSize: 9.5, color: "#94a3b8", margin: "5px 0 0", textAlign: "center" }}>
          AI-powered · cites the section it pulled the answer from
        </p>
      </div>
    </div>
  );
}


// ============================================================================
// Risks module, v1 layout (kept intact)
// ============================================================================

function RisksModuleMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#475569" }}>
        <ArrowLeft size={13} />
        <span>Back to procedure</span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
          Risks & red flags
        </h1>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>Module 4 of 7 · 1:58 · completed</span>
      </div>
      <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
        Most patients heal without issue. Serious complications occur in less than 1% of screening colonoscopies.
      </p>

      <VcCard padding={12}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
          Common side effects (temporary)
        </p>
        <p style={{ fontSize: 11.5, color: "#475569", margin: "3px 0 0" }}>
          Bloating, mild cramping, light bleeding (especially after polypectomy). Resolves in 24–48h.
        </p>
      </VcCard>
      <VcCard padding={12}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
          Uncommon complications (&lt;1%)
        </p>
        <p style={{ fontSize: 11.5, color: "#475569", margin: "3px 0 0" }}>
          Heavier post-polypectomy bleeding, sedation reaction, perforation. Most are treatable in-clinic.
        </p>
      </VcCard>

      <div
        data-tour-id="vc-red-flag"
        style={{
          background: "#fef2f2",
          border: "2px solid #dc2626",
          borderRadius: 12,
          padding: 12,
          boxShadow: "0 0 0 1px rgba(220,38,38,0.08)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <ShieldAlert size={15} color="#dc2626" />
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#dc2626",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              margin: 0,
            }}
          >
            Red flags, call your care team immediately
          </p>
        </div>
        <ul style={{ margin: 0, padding: "0 0 0 18px", color: "#7f1d1d", fontSize: 11.5, lineHeight: 1.6 }}>
          <li>Heavy rectal bleeding (more than spotting)</li>
          <li>Severe abdominal pain not relieved by gas or position changes</li>
          <li>Fever &gt; 100.4°F within 48h</li>
          <li>Dizziness, lightheadedness, fainting</li>
          <li>No bowel movement for &gt; 24h after the procedure</li>
        </ul>
        <div
          style={{
            marginTop: 8,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "white",
            border: "1px solid #fecaca",
            borderRadius: 6,
            padding: "4px 10px",
            fontFamily: "ui-monospace, monospace",
            fontSize: 11,
            color: "#7f1d1d",
          }}
        >
          📞 Emergency line · (555) 789-0123
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Q&A (grounded answer in the procedure-side Q&A surface)
// ============================================================================

function QaMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#475569" }}>
        <ArrowLeft size={13} />
        <span>Back to procedure</span>
      </div>

      <Eyebrow>You asked</Eyebrow>
      <VcCard padding={12}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
          What are the transportation requirements?
        </p>
      </VcCard>

      <Eyebrow>Answer · grounded in your documents</Eyebrow>
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid rgba(59,79,216,0.3)",
          borderRadius: 12,
          padding: 14,
          position: "relative",
        }}
      >
        <span
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: "#3B4FD8",
            borderRadius: "0 2px 2px 0",
          }}
        />
        <p style={{ fontSize: 12.5, color: "#0F1F3D", margin: 0, lineHeight: 1.55 }}>
          You'll need a <strong>responsible adult to drive you home</strong> after the
          procedure, Uber and Lyft alone are not permitted. They should also come into
          the building with you at check-in.
        </p>

        <button
          data-tour-id="vc-citation-chip"
          style={{
            marginTop: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: 999,
            padding: "3px 9px",
            fontSize: 10.5,
            color: "#334155",
            cursor: "pointer",
          }}
        >
          <FileText size={10} />
          Pre-Operative Instructions
          <span style={{ color: "#64748b" }}>(p. 2)</span>
        </button>

        <div
          style={{
            marginTop: 8,
            background: "white",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: 10,
            fontSize: 11,
            color: "#334155",
            lineHeight: 1.5,
          }}
        >
          “REQUIRED: You MUST have a responsible adult drive you home. You will NOT be
          allowed to drive yourself or take a taxi/rideshare alone.”
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
          <button
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 999,
              padding: "3px 10px",
              fontSize: 10.5,
              color: "#475569",
              cursor: "pointer",
            }}
          >
            Save to summary
          </button>
          <button
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 999,
              padding: "3px 10px",
              fontSize: 10.5,
              color: "#475569",
              cursor: "pointer",
            }}
          >
            👍 Helpful
          </button>
        </div>
      </div>
      <p style={{ fontSize: 10.5, color: "#94a3b8", margin: 0, fontStyle: "italic" }}>
        This is the same agent that texts Maria, same conversation, three windows (SMS, in-app, voicemail transcripts).
      </p>
    </div>
  );
}

// ============================================================================
// Questions builder
// ============================================================================

function QuestionsBuilderMock() {
  const cats = ["All", "Prep", "Risks", "Recovery", "Logistics"];
  const questions = [
    { cat: "Prep", text: "Can I take my blood-pressure medication the morning of?" },
    { cat: "Risks", text: "What happens if a polyp is found?" },
    { cat: "Recovery", text: "When can I resume warfarin?" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
          My questions
        </h1>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>3 saved</span>
      </div>
      <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
        Bring this list to your pre-op visit, or text it to the team straight from this page.
      </p>

      <div data-tour-id="vc-questions-categories" style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {cats.map((c, i) => (
          <button
            key={c}
            style={{
              padding: "5px 12px",
              borderRadius: 999,
              border: "none",
              fontSize: 11,
              fontWeight: 500,
              cursor: "pointer",
              background: i === 0 ? "#3B4FD8" : "#f1f5f9",
              color: i === 0 ? "white" : "#334155",
              boxShadow: i === 0 ? "0 1px 2px rgba(59,79,216,0.2)" : "none",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {questions.map((q) => (
          <VcCard key={q.text} padding={11}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span
                style={{
                  fontSize: 9.5,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: 0.4,
                  background: "#EEF2FF",
                  color: "#2A3BB0",
                  padding: "2px 7px",
                  borderRadius: 999,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {q.cat}
              </span>
              <p style={{ flex: 1, fontSize: 12, color: "#0F1F3D", margin: 0, lineHeight: 1.5 }}>
                {q.text}
              </p>
              <button
                aria-label="Mark as asked"
                style={{
                  background: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: 999,
                  padding: 4,
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Check size={11} />
              </button>
            </div>
          </VcCard>
        ))}
      </div>

      <VcCard padding={12} accent tourId="vc-add-question-form">
        <Eyebrow>Add your own</Eyebrow>
        <input
          readOnly
          value="What if I forget and drink water in the morning?"
          style={{
            marginTop: 6,
            width: "100%",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 12,
            color: "#0F1F3D",
            background: "white",
          }}
        />
        <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <select disabled style={{ fontSize: 11, padding: "4px 8px", border: "1px solid #e2e8f0", borderRadius: 6 }}>
            <option>Prep</option>
          </select>
          <button
            data-tour-id="vc-add-question-btn"
            style={{
              background: "#3B4FD8",
              color: "white",
              border: "none",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 11.5,
              fontWeight: 500,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Plus size={12} />
            Add question
          </button>
        </div>
      </VcCard>

      <button
        data-tour-id="vc-export-summary-btn"
        style={{
          background: "#3B4FD8",
          color: "white",
          border: "none",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 12.5,
          fontWeight: 500,
          cursor: "pointer",
          alignSelf: "flex-start",
        }}
      >
        Export summary →
      </button>
    </div>
  );
}

// ============================================================================
// Consultation summary
// ============================================================================

function ConsultationMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
          Initial consultation
        </h1>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>{consultationSummary.consultDate}</span>
      </div>
      <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
        {consultationSummary.doctorName} · {consultationSummary.facilityName}
      </p>
      <VcCard padding={12}>
        <Eyebrow>Reason for recommendation</Eyebrow>
        <p style={{ fontSize: 12, color: "#0F1F3D", margin: "6px 0 0", lineHeight: 1.55 }}>
          {consultationSummary.reasonForRecommendation}
        </p>
      </VcCard>
      <VcCard padding={12}>
        <Eyebrow>Key findings</Eyebrow>
        <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
          {consultationSummary.keyFindings.map((f) => (
            <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: "#0F1F3D" }}>
              <span style={{ width: 4, height: 4, borderRadius: 999, background: "#3B4FD8", marginTop: 6, flexShrink: 0 }} />
              {f}
            </li>
          ))}
        </ul>
      </VcCard>
      <VcCard padding={12} accent>
        <Eyebrow>Agreed plan</Eyebrow>
        <p style={{ fontSize: 12, color: "#0F1F3D", margin: "6px 0 0", lineHeight: 1.55 }}>
          {consultationSummary.agreedPlan}
        </p>
        <p style={{ fontSize: 11.5, color: "#475569", margin: "8px 0 0" }}>
          <strong style={{ color: "#2A3BB0" }}>Planned procedure:</strong> {consultationSummary.plannedProcedure}
        </p>
      </VcCard>
    </div>
  );
}

// ============================================================================
// Summary export
// ============================================================================

function SummaryMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
          Pre-op summary
        </h1>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>Print · Download PDF</span>
      </div>
      <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
        Bring this one-pager to your appointment on Mar 14.
      </p>
      <VcCard padding={12}>
        <Eyebrow>A · Module listen progress</Eyebrow>
        <p style={{ fontSize: 13, fontWeight: 600, color: "#0F1F3D", margin: "4px 0 6px" }}>
          4 of 7 modules · 65%
        </p>
        <GradientBar pct={65} h={6} />
      </VcCard>
      <VcCard padding={12}>
        <Eyebrow>B · My questions (3)</Eyebrow>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 6, fontSize: 11.5, color: "#0F1F3D" }}>
          <p style={{ margin: 0 }}>
            <span style={{ color: "#94a3b8" }}>[Prep]</span> Can I take my BP medication the morning of?
          </p>
          <p style={{ margin: 0 }}>
            <span style={{ color: "#94a3b8" }}>[Risks]</span> What happens if a polyp is found?
          </p>
          <p style={{ margin: 0 }}>
            <span style={{ color: "#94a3b8" }}>[Recovery]</span> When can I resume warfarin?
          </p>
        </div>
      </VcCard>
      <VcCard padding={12} accent>
        <Eyebrow>C · Decision-moment check-ins (from the SMS thread)</Eyebrow>
        <ul style={{ margin: "5px 0 0", padding: 0, listStyle: "none", fontSize: 11.5, color: "#0F1F3D", display: "flex", flexDirection: "column", gap: 3 }}>
          <li>• Warfarin hold · passed (Mar 7)</li>
          <li>• Escort confirmed · Elena Alvarez (Mar 7)</li>
          <li>• Clopidogrel hold · re-taught after a miss (Mar 9)</li>
        </ul>
      </VcCard>
      <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, fontStyle: "italic" }}>
        Not medical advice. For emergencies, call 911.
      </p>
    </div>
  );
}

// ============================================================================
// Compiler visualization, styled in v1 cards
// ============================================================================

function CompilerMock() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
          Patient Journey Compiler
        </h1>
        <p style={{ fontSize: 11.5, color: "#475569", margin: "2px 0 0" }}>
          Template + EHR snapshot + risk vector → versioned, dated journey instance.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 24px 1fr 24px 1fr", alignItems: "stretch", gap: 4 }}>
        <VcCard padding={10}>
          <Eyebrow>Inputs</Eyebrow>
          <ul style={{ margin: "5px 0 0", padding: 0, listStyle: "none", fontSize: 10.5, color: "#475569", lineHeight: 1.55 }}>
            <li>• <code style={{ fontSize: 10, background: "#f1f5f9", padding: "0 4px", borderRadius: 3 }}>{procedureTemplate.id}</code></li>
            <li>• Maria's Epic snapshot</li>
            <li>• Provation status</li>
            <li>• Risk vector ({maria.riskScore.toFixed(2)})</li>
            <li>• Clinic protocol (SUPREP · 5d warfarin)</li>
          </ul>
        </VcCard>
        <div style={{ display: "grid", placeItems: "center" }}>
          <ChevronRight size={18} color="#94a3b8" />
        </div>
        <VcCard padding={10} accent>
          <Eyebrow>Compiler</Eyebrow>
          <ul style={{ margin: "5px 0 0", padding: 0, listStyle: "none", fontSize: 10.5, color: "#475569", lineHeight: 1.55 }}>
            <li>• Resolve relative timing</li>
            <li>• Apply conditional branches</li>
            <li>• Pick TTS render per language</li>
            <li>• Bind audio_window to TZ</li>
            <li>• Compute NPO + split-dose</li>
          </ul>
        </VcCard>
        <div style={{ display: "grid", placeItems: "center" }}>
          <ChevronRight size={18} color="#94a3b8" />
        </div>
        <VcCard padding={10}>
          <Eyebrow>Journey instance</Eyebrow>
          <p style={{ fontSize: 11, color: "#0F1F3D", margin: "5px 0 0", fontWeight: 600 }}>
            v{compileHistory.length} · {mariaTouchpoints.length} touchpoints
          </p>
          <p style={{ fontSize: 10, color: "#64748b", margin: "2px 0 0" }}>
            content_hash:<br />
            <span style={{ fontFamily: "ui-monospace, monospace" }}>sha256:0a91e4…7c</span>
          </p>
        </VcCard>
      </div>

      <VcCard padding={12} tourId="vc-compile-history">
        <Eyebrow>Compile lifecycle · every patch is versioned + auditable</Eyebrow>
        <ol style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
          {compileHistory.map((c) => (
            <li
              key={c.v}
              data-tour-id={c.v === 3 ? "vc-compile-v3" : c.v === 4 ? "vc-compile-v4" : undefined}
              style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 10, alignItems: "start" }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: c.v === compileHistory.length ? "#3B4FD8" : "#EEF2FF",
                  color: c.v === compileHistory.length ? "white" : "#2A3BB0",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 10,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                v{c.v}
              </span>
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: "#0F1F3D", margin: 0, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <GitCommit size={11} color="#3B4FD8" />
                  trigger: <code style={{ fontSize: 11, background: "#f1f5f9", padding: "1px 5px", borderRadius: 3 }}>{c.trigger}</code>
                </p>
                <p style={{ fontSize: 11, color: "#475569", margin: "2px 0 0", lineHeight: 1.5 }}>
                  {c.summary}
                </p>
              </div>
              <span style={{ fontSize: 10, color: "#94a3b8", whiteSpace: "nowrap" }}>{c.at}</span>
            </li>
          ))}
        </ol>
      </VcCard>

      <p style={{ fontSize: 10.5, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
        Every runtime agent reads the compiled instance, no agent invents schedule on its own.
        That's the property that makes the system auditable, deterministic over inputs, and easy
        to onboard a new procedure or clinic to.
      </p>
    </div>
  );
}

// ============================================================================
// Template authoring, v1-card styled
// ============================================================================

function TemplateAuthoringMock() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(180px, 220px) 1fr", gap: 12, alignItems: "start" }}>
      <aside>
        <h1 style={{ fontSize: 14, fontWeight: 600, color: "#0F1F3D", margin: "0 0 6px" }}>
          Procedure templates
        </h1>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
          {[
            { name: "Screening colonoscopy", cpt: "45378", tier: "minimal", v: 3, active: true },
            { name: "EGD with biopsy", cpt: "43239", tier: "minimal", v: 2 },
            { name: "Polypectomy (post-op branch)", cpt: "45380", tier: "minimal", v: 1 },
            { name: "Knee arthroplasty (pilot 2)", cpt: "27447", tier: "complex", v: 1 },
          ].map((t) => (
            <li key={t.cpt}>
              <button style={{
                width: "100%",
                textAlign: "left",
                border: t.active ? "1px solid #3B4FD8" : "1px solid #e2e8f0",
                background: t.active ? "#EEF2FF" : "white",
                borderRadius: 8,
                padding: "6px 8px",
                cursor: "pointer",
              }}>
                <p style={{ fontSize: 11.5, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>{t.name}</p>
                <p style={{ fontSize: 9.5, color: "#64748b", margin: "1px 0 0" }}>
                  CPT {t.cpt} · {t.tier} · v{t.v}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <h1 style={{ fontSize: 17, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
              Screening colonoscopy
            </h1>
            <StatusBadge status="ready" />
          </div>
          <p style={{ fontSize: 11, color: "#64748b", margin: "1px 0 0" }}>
            CPT {procedureTemplate.cpt} · tier <strong>{procedureTemplate.tier}</strong> · {procedureTemplate.moduleCount} modules · v{procedureTemplate.version} · content-hashed
          </p>
        </div>

        <VcCard padding={10}>
          <Eyebrow>Procedure Authoring Agent · transcript excerpt</Eyebrow>
          <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ alignSelf: "flex-start", maxWidth: "85%", background: "#f1f5f9", borderRadius: 10, padding: "4px 8px", fontSize: 11, color: "#0F1F3D" }}>
              <strong>Agent:</strong> Is this procedure inpatient or outpatient?
            </span>
            <span style={{ alignSelf: "flex-end", maxWidth: "85%", background: "#3B4FD8", color: "white", borderRadius: 10, padding: "4px 8px", fontSize: 11 }}>
              <strong>Dr. Patel:</strong> Outpatient. 20–30min recovery, light sedation.
            </span>
            <span style={{ alignSelf: "flex-start", maxWidth: "85%", background: "#f1f5f9", borderRadius: 10, padding: "4px 8px", fontSize: 11, color: "#0F1F3D" }}>
              <strong>Agent:</strong> Single system, outpatient, recovery &lt; 72h → <strong>minimal tier</strong>. Proposed: 2 voice-call modules (intro+prep combined, recovery). Approve?
            </span>
            <span style={{ alignSelf: "flex-end", maxWidth: "85%", background: "#3B4FD8", color: "white", borderRadius: 10, padding: "4px 8px", fontSize: 11 }}>
              <strong>Dr. Patel:</strong> Yes, combined is fine for screening.
            </span>
          </div>
        </VcCard>

        <VcCard padding={10}>
          <Eyebrow>Voice-call modules</Eyebrow>
          <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
            {procedureTemplate.modules.map((m) => (
              <li
                key={m.key}
                style={{
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "5px 8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 6,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>{m.title}</p>
                  <p style={{ fontSize: 10, color: "#64748b", margin: "1px 0 0" }}>{m.timing} · {m.lengthSec}s · {m.synopsis}</p>
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 600, color: "#15803d", background: "#dcfce7", border: "1px solid #16a34a", borderRadius: 999, padding: "1px 7px", whiteSpace: "nowrap" }}>
                  approved
                </span>
              </li>
            ))}
          </ul>
        </VcCard>

        <VcCard padding={10}>
          <Eyebrow color="#b45309">Escalation policy</Eyebrow>
          <ul style={{ margin: "5px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 3 }}>
            {procedureTemplate.escalations.map((e) => (
              <li key={e.trigger} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, color: "#0F1F3D" }}>
                {e.severity === "hard" ? (
                  <AlertCircle size={11} color="#dc2626" />
                ) : (
                  <AlertTriangle size={11} color="#d97706" />
                )}
                <code style={{ fontSize: 10, background: "#f1f5f9", padding: "1px 5px", borderRadius: 3 }}>{e.trigger}</code>
                <span style={{ marginLeft: "auto", fontSize: 9.5, color: e.severity === "hard" ? "#dc2626" : "#b45309", fontWeight: 600, textTransform: "uppercase" }}>
                  {e.severity}
                </span>
              </li>
            ))}
          </ul>
        </VcCard>
      </section>
    </div>
  );
}

// ============================================================================
// Provider dashboard, v1 patient table
// ============================================================================

function ProviderDashboardMock() {
  const statusStyle = (s: (typeof providerPatients)[number]["status"]) => {
    if (s === "ready") return { bg: "#dcfce7", fg: "#15803d", border: "#16a34a" };
    if (s === "needs-review") return { bg: "#fef3c7", fg: "#b45309", border: "#d97706" };
    return { bg: "#eff6ff", fg: "#3B4FD8", border: "#3B4FD8" };
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: "#0F1F3D", margin: 0 }}>
          Patient panel
        </h1>
        <span style={{ fontSize: 11, color: "#94a3b8" }}>{providerPatients.length} active patients</span>
      </div>

      <div data-tour-id="vc-provider-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        <VcCard padding={12}>
          <Eyebrow>Ready</Eyebrow>
          <p style={{ fontSize: 22, fontWeight: 600, color: "#15803d", margin: "4px 0 0" }}>
            {providerPatients.filter((p) => p.status === "ready").length}
          </p>
        </VcCard>
        <VcCard padding={12}>
          <Eyebrow>In progress</Eyebrow>
          <p style={{ fontSize: 22, fontWeight: 600, color: "#3B4FD8", margin: "4px 0 0" }}>
            {providerPatients.filter((p) => p.status === "in-progress").length}
          </p>
        </VcCard>
        <VcCard padding={12}>
          <Eyebrow>Needs review</Eyebrow>
          <p style={{ fontSize: 22, fontWeight: 600, color: "#b45309", margin: "4px 0 0" }}>
            {providerPatients.filter((p) => p.status === "needs-review").length}
          </p>
        </VcCard>
      </div>

      <VcCard padding={0}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
            <thead>
              <tr>
                {["Patient", "Procedure", "Date", "Listen progress", "Q&A", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 10px",
                      borderBottom: "1px solid #e2e8f0",
                      background: "#f8fafc",
                      fontSize: 9.5,
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: "#64748b",
                      textAlign: "left",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {providerPatients.map((p, i) => {
                const ss = statusStyle(p.status);
                const firstNeedsReview = p.status === "needs-review" && providerPatients.findIndex((q) => q.status === "needs-review") === i;
                return (
                  <tr
                    key={p.id}
                    data-tour-id={firstNeedsReview ? "vc-provider-needs-review" : p.name === "Maria Alvarez" ? "vc-provider-maria" : undefined}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td style={{ padding: "8px 10px", fontWeight: 600, color: "#0F1F3D" }}>{p.name}</td>
                    <td style={{ padding: "8px 10px", color: "#475569" }}>{p.procedure}</td>
                    <td style={{ padding: "8px 10px", color: "#475569" }}>{p.date}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 60, height: 4, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                          <div
                            style={{
                              width: `${p.pct}%`,
                              height: "100%",
                              background: "linear-gradient(to right, #2A3BB0, #5C6DE0)",
                            }}
                          />
                        </div>
                        <span style={{ color: "#475569" }}>{p.pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "8px 10px", color: "#475569" }}>{p.qa}</td>
                    <td style={{ padding: "8px 10px" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: 999,
                          border: `1px solid ${ss.border}`,
                          background: ss.bg,
                          color: ss.fg,
                          padding: "2px 8px",
                          fontSize: 10,
                          fontWeight: 500,
                        }}
                      >
                        {p.status.replace("-", " ")}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </VcCard>
      <p style={{ fontSize: 10.5, color: "#94a3b8", margin: 0 }}>
        Patients flagged <em>needs review</em> have missed teach-back replies, high Q&amp;A volume, or low listen-progress, the morning queue surfaces who to call, when, and why.
      </p>
    </div>
  );
}
