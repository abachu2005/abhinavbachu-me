import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, Camera, ChevronLeft, Phone, Plus, Video } from "lucide-react";
import { mariaThread } from "@/data/veracareV2";

// Plain iMessage clone. Filters Maria's thread down to the SMS bubbles and
// date dividers, drops everything else. One contact (GI Associates), one
// thread — all incoming bubbles are gray regardless of who's typing back.
// Tap the send button to fire Maria's next outgoing message; the clinic's
// replies stream back automatically.

type Bubble =
  | { kind: "in"; body: string; time: string }
  | { kind: "out"; body: string; time: string }
  | { kind: "date"; label: string };

const SCRIPT: Bubble[] = mariaThread.flatMap<Bubble>((e) => {
  if (e.kind === "sms-in") return [{ kind: "in", body: e.body, time: e.time }];
  if (e.kind === "sms-out") return [{ kind: "out", body: e.body, time: e.time }];
  if (e.kind === "date") return [{ kind: "date", label: e.label }];
  return [];
});

const IMESSAGE_BLUE = "linear-gradient(180deg, #20A6FB 0%, #0B84FF 100%)";
const IMESSAGE_GRAY = "#E9E9EB";

export default function IMessageThread() {
  const [shownCount, setShownCount] = useState(() => {
    // start with whatever leads up to (but not including) the first outgoing
    const i = SCRIPT.findIndex((e) => e.kind === "out");
    return i === -1 ? SCRIPT.length : i;
  });

  const events = SCRIPT.slice(0, shownCount);
  const nextOut = useMemo(() => {
    for (let i = shownCount; i < SCRIPT.length; i++) {
      if (SCRIPT[i].kind === "out") return SCRIPT[i] as Extract<Bubble, { kind: "out" }>;
      if (SCRIPT[i].kind === "in") return null;
    }
    return null;
  }, [shownCount]);

  const handleSend = () => {
    if (!nextOut) return;
    const outIdx = SCRIPT.findIndex((e, i) => i >= shownCount && e.kind === "out");
    if (outIdx === -1) return;
    setShownCount(outIdx + 1);
    // auto-advance through the agent's reply(ies) that follow, up to the next outbound
    setTimeout(() => {
      let next = outIdx + 1;
      while (next < SCRIPT.length && SCRIPT[next].kind !== "out") next++;
      setShownCount(next);
    }, 700);
  };

  const handleReset = () => {
    const i = SCRIPT.findIndex((e) => e.kind === "out");
    setShownCount(i === -1 ? SCRIPT.length : i);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [shownCount]);

  const canReset = shownCount > SCRIPT.findIndex((e) => e.kind === "out");

  return (
    <div className="flex flex-col items-center gap-3">
      <IPhoneFrame>
        <div style={{ height: 640, display: "flex", flexDirection: "column" }}>
          <StatusBar />
          <ChatHeader />
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              padding: "8px 14px 6px",
              background: "white",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {events.map((e, i) => {
              const prev = events[i - 1];
              const next = events[i + 1];
              const showTime =
                (e.kind === "in" || e.kind === "out") &&
                (!prev || prev.kind === "date");
              return (
                <BubbleRow
                  key={i}
                  e={e}
                  showTime={showTime}
                  tail={
                    (e.kind === "in" || e.kind === "out") &&
                    (!next || next.kind !== e.kind)
                  }
                />
              );
            })}
            {/* Spacer so the last bubble doesn't touch the compose bar */}
            <div style={{ height: 6 }} />
          </div>
          <ComposeBar nextText={nextOut?.body ?? null} onSend={handleSend} />
          <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 8px", flexShrink: 0 }}>
            <div style={{ width: 134, height: 5, borderRadius: 999, background: "#0a0f1e" }} />
          </div>
        </div>
      </IPhoneFrame>
      {canReset && (
        <button
          onClick={handleReset}
          className="text-xs text-[var(--color-ink-subtle)] hover:text-[var(--color-ink-muted)] transition-colors"
        >
          ↻ Restart conversation
        </button>
      )}
    </div>
  );
}

function IPhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 360,
        background: "#000",
        borderRadius: 50,
        padding: 12,
        boxShadow:
          "0 30px 60px -20px rgba(15,31,61,0.4), 0 0 0 1px rgba(0,0,0,0.1), inset 0 0 0 2px #1a1a1a",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 40,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <DynamicIsland />
        {children}
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div
      style={{
        flexShrink: 0,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        fontSize: 14.5,
        fontWeight: 600,
        color: "#0F1F3D",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
      }}
    >
      <span>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#0F1F3D" }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor"><rect x="0" y="7" width="3" height="4" rx="0.5" /><rect x="4" y="5" width="3" height="6" rx="0.5" /><rect x="8" y="3" width="3" height="8" rx="0.5" /><rect x="12" y="0" width="3" height="11" rx="0.5" /></svg>
        {/* wifi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.5c2.5 0 4.8 1 6.5 2.6l-1.4 1.4A7 7 0 0 0 8 4.5a7 7 0 0 0-5.1 2L1.5 5C3.2 3.5 5.5 2.5 8 2.5zm0 3.2c1.6 0 3.1.6 4.2 1.6l-1.4 1.4A4 4 0 0 0 8 7.7a4 4 0 0 0-2.8 1L3.8 7.3A6 6 0 0 1 8 5.7zm0 3.2c.8 0 1.5.3 2 .8L8 11.5 6 9.7a3 3 0 0 1 2-.8z" /></svg>
        {/* battery */}
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" opacity="0.4" /><rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" /><rect x="23.5" y="3.5" width="2" height="5" rx="0.7" fill="currentColor" opacity="0.4" /></svg>
      </div>
    </div>
  );
}

function DynamicIsland() {
  return (
    <div
      style={{
        position: "absolute",
        top: 7,
        left: "50%",
        transform: "translateX(-50%)",
        width: 110,
        height: 32,
        background: "#000",
        borderRadius: 20,
        zIndex: 10,
      }}
    />
  );
}

function ChatHeader() {
  return (
    <div
      style={{
        flexShrink: 0,
        borderBottom: "1px solid #d1d5db",
        background: "rgba(247,247,247,0.92)",
        backdropFilter: "blur(20px)",
        padding: "8px 12px 12px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        position: "relative",
      }}
    >
      <ChevronLeft size={26} color="#007AFF" strokeWidth={1.7} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "#c7c7cc",
            display: "grid",
            placeItems: "center",
            color: "white",
            fontSize: 16,
            fontWeight: 500,
            letterSpacing: 0.5,
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
          }}
        >
          GI
        </div>
        <span style={{ fontSize: 11.5, color: "#0F1F3D", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 3 }}>
          GI Associates
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="#8e8e93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
      <div style={{ display: "flex", gap: 12, color: "#007AFF" }}>
        <Video size={22} strokeWidth={1.6} />
        <Phone size={20} strokeWidth={1.6} />
      </div>
    </div>
  );
}

function BubbleRow({
  e,
  showTime,
  tail,
}: {
  e: Bubble;
  showTime: boolean;
  tail: boolean;
}) {
  if (e.kind === "date") {
    return (
      <div style={{ display: "flex", justifyContent: "center", margin: "12px 0 6px" }}>
        <span style={{ fontSize: 10.5, color: "#8e8e93", fontWeight: 600 }}>
          {e.label}
        </span>
      </div>
    );
  }
  const bg = e.kind === "out" ? IMESSAGE_BLUE : IMESSAGE_GRAY;
  const fg = e.kind === "out" ? "white" : "#0F1F3D";

  return (
    <>
      {showTime && (
        <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 4px" }}>
          <span style={{ fontSize: 10.5, color: "#8e8e93", fontWeight: 600, letterSpacing: 0.1 }}>
            {e.time}
          </span>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
        style={{
          display: "flex",
          justifyContent: e.kind === "out" ? "flex-end" : "flex-start",
          marginTop: tail ? 1 : 2,
        }}
      >
        <div
          style={{
            maxWidth: "72%",
            padding: "8px 13px 9px",
            borderRadius: 18,
            background: bg,
            color: fg,
            fontSize: 15.5,
            lineHeight: 1.32,
            letterSpacing: "-0.015em",
            fontFamily:
              '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
            wordBreak: "break-word",
          }}
        >
          {e.body}
        </div>
      </motion.div>
    </>
  );
}

function ComposeBar({
  nextText,
  onSend,
}: {
  nextText: string | null;
  onSend: () => void;
}) {
  return (
    <div
      style={{
        flexShrink: 0,
        borderTop: "1px solid #d1d5db",
        background: "rgba(247,247,247,0.92)",
        backdropFilter: "blur(20px)",
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <button
        aria-label="More"
        style={{
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "#E9E9EB",
          border: "none",
          display: "grid",
          placeItems: "center",
          color: "#8e8e93",
          flexShrink: 0,
          cursor: "default",
        }}
      >
        <Plus size={18} strokeWidth={2.2} />
      </button>
      <div
        style={{
          flex: 1,
          background: "white",
          border: "1px solid #d1d5db",
          borderRadius: 18,
          padding: "5px 12px",
          fontSize: 14,
          color: nextText ? "#0F1F3D" : "#8e8e93",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", system-ui, sans-serif',
          letterSpacing: "-0.01em",
          minHeight: 30,
          display: "flex",
          alignItems: "center",
        }}
      >
        {nextText ?? "iMessage"}
      </div>
      {nextText ? (
        <motion.button
          onClick={onSend}
          aria-label="Send"
          whileTap={{ scale: 0.9 }}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: IMESSAGE_BLUE,
            border: "none",
            display: "grid",
            placeItems: "center",
            color: "white",
            flexShrink: 0,
            cursor: "pointer",
            boxShadow: "0 1px 3px rgba(11,134,248,0.4)",
          }}
        >
          <ArrowUp size={18} strokeWidth={3} />
        </motion.button>
      ) : (
        <button
          aria-label="Camera"
          disabled
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: "transparent",
            border: "none",
            display: "grid",
            placeItems: "center",
            color: "#8e8e93",
            flexShrink: 0,
            cursor: "default",
          }}
        >
          <Camera size={20} strokeWidth={1.6} />
        </button>
      )}
    </div>
  );
}
