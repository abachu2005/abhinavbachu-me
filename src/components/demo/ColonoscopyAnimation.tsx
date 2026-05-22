import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";

const COLON_PATH =
  "M 200 295 C 195 295 175 280 175 240 C 175 200 125 175 110 150 C 100 110 115 65 165 65 L 235 65 C 285 65 300 110 290 150 C 280 195 290 215 290 245";

type Frame = { x: number; y: number; caption: string };

const FRAMES: Frame[] = [
  { x: 200, y: 295, caption: "The scope enters at the rectum. It's a flexible tube about the width of a finger." },
  { x: 175, y: 240, caption: "It curves up through the sigmoid bend." },
  { x: 110, y: 150, caption: "Up along the descending colon." },
  { x: 200, y: 65, caption: "Across the top, the transverse colon." },
  { x: 290, y: 150, caption: "Down the ascending colon." },
  { x: 290, y: 245, caption: "And reaches the cecum, the far end." },
];

const FINAL_CAPTION =
  "No incision. No scalpel. A small camera on the end of a flexible tube, looking for polyps the size of a grain of rice.";
const STEP_MS = 1000;

type Props = {
  onClose?: () => void;
};

export default function ColonoscopyAnimation({ onClose }: Props) {
  const [i, setI] = useState(0);
  const [done, setDone] = useState(false);

  const restart = useCallback(() => {
    setI(0);
    setDone(false);
  }, []);

  useEffect(() => {
    if (i >= FRAMES.length - 1) {
      const t = window.setTimeout(() => setDone(true), 850);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setI((p) => p + 1), STEP_MS);
    return () => window.clearTimeout(t);
  }, [i]);

  const f = FRAMES[i];
  const progress = (i + 1) / FRAMES.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -4, height: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      style={{ overflow: "hidden" }}
    >
      <div
        style={{
          position: "relative",
          marginTop: 12,
          padding: "16px 18px 14px",
          background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)",
          borderRadius: 12,
          border: "1px solid #e2e8f0",
        }}
      >
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close diagram"
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              background: "transparent",
              border: 0,
              color: "#94a3b8",
              cursor: "pointer",
              padding: 4,
              borderRadius: 4,
            }}
          >
            <X size={14} />
          </button>
        )}

        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
          <span
            style={{
              fontSize: 10.5,
              fontWeight: 700,
              color: "#3B4FD8",
              textTransform: "uppercase",
              letterSpacing: 0.7,
            }}
          >
            What actually happens
          </span>
          <span style={{ fontSize: 11, color: "#94a3b8" }}>· no surgery, no incision</span>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg
            viewBox="0 0 400 320"
            width="100%"
            style={{ maxWidth: 320, height: "auto" }}
            role="img"
            aria-label="Animated diagram of a colonoscopy"
          >
            <defs>
              <radialGradient id="vc-torso-fill" cx="50%" cy="55%" r="60%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#f1f5f9" />
              </radialGradient>
            </defs>

            <rect
              x="40"
              y="20"
              width="320"
              height="280"
              rx="80"
              ry="80"
              fill="url(#vc-torso-fill)"
              stroke="#cbd5e1"
              strokeWidth="1.5"
            />

            <path
              d={COLON_PATH}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="14"
              strokeLinecap="round"
            />

            <motion.path
              d={COLON_PATH}
              fill="none"
              stroke="#3B4FD8"
              strokeWidth="14"
              strokeLinecap="round"
              initial={false}
              animate={{ pathLength: progress }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
              opacity={0.85}
            />

            <motion.circle
              r="16"
              fill="none"
              stroke="#3B4FD8"
              strokeWidth="2"
              initial={false}
              animate={{ cx: f.x, cy: f.y, opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.circle
              r="10"
              fill="#0F1F3D"
              initial={false}
              animate={{ cx: f.x, cy: f.y }}
              transition={{ duration: 0.85, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <div style={{ minHeight: 46, marginTop: 4 }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={done ? "final" : `frame-${i}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              style={{
                margin: 0,
                textAlign: "center",
                fontSize: done ? 13.5 : 12.5,
                fontWeight: done ? 600 : 500,
                color: done ? "#0F1F3D" : "#475569",
                lineHeight: 1.5,
              }}
            >
              {done ? FINAL_CAPTION : f.caption}
            </motion.p>
          </AnimatePresence>
        </div>

        {done && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
            <button
              type="button"
              onClick={restart}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11.5,
                fontWeight: 500,
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: 7,
                padding: "5px 11px",
                color: "#475569",
                cursor: "pointer",
              }}
            >
              <Play size={11} />
              Play again
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
