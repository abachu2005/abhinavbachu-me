import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { Play, X } from "lucide-react";

const COLON_PATH =
  "M 200 300 C 198 292 182 278 178 246 C 174 208 132 184 116 152 C 100 112 118 76 168 76 L 232 76 C 282 76 300 112 284 152 C 274 188 290 210 290 240 L 290 252";

const CAPTIONS: Array<{ at: number; text: string }> = [
  { at: 0.0, text: "The scope enters at the rectum. It's a flexible tube about the width of a finger." },
  { at: 0.15, text: "It curves up through the sigmoid bend." },
  { at: 0.32, text: "Up along the descending colon, the left side." },
  { at: 0.5, text: "Across the top, the transverse colon." },
  { at: 0.68, text: "Down the ascending colon, the right side." },
  { at: 0.88, text: "And reaches the cecum, the far end." },
];

const FINAL_CAPTION =
  "No incision. No scalpel. A small camera on the end of a flexible tube.";
const DURATION_S = 7;

type Props = { onClose?: () => void };

export default function ColonoscopyAnimation({ onClose }: Props) {
  const pathRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const scopeRef = useRef<SVGGElement>(null);
  const captionIdxRef = useRef(-1);

  const [captionIdx, setCaptionIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [runKey, setRunKey] = useState(0);

  const restart = useCallback(() => setRunKey((k) => k + 1), []);

  useEffect(() => {
    const path = pathRef.current;
    const fill = fillRef.current;
    const scope = scopeRef.current;
    if (!path || !fill || !scope) return;

    setDone(false);
    setCaptionIdx(0);
    captionIdxRef.current = 0;

    const total = path.getTotalLength();
    fill.style.strokeDasharray = `${total}`;
    fill.style.strokeDashoffset = `${total}`;

    // Park the scope at the start instantly so it doesn't snap from old pos.
    const start = path.getPointAtLength(0);
    scope.setAttribute("transform", `translate(${start.x} ${start.y})`);

    const controls = animate(0, 1, {
      duration: DURATION_S,
      ease: [0.45, 0.05, 0.5, 0.95],
      onUpdate(v) {
        const pt = path.getPointAtLength(v * total);
        scope.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        fill.style.strokeDashoffset = `${total * (1 - v)}`;
        let idx = 0;
        for (let i = 0; i < CAPTIONS.length; i++) {
          if (v >= CAPTIONS[i].at) idx = i;
        }
        if (idx !== captionIdxRef.current) {
          captionIdxRef.current = idx;
          setCaptionIdx(idx);
        }
      },
      onComplete() {
        setDone(true);
      },
    });

    return () => controls.stop();
  }, [runKey]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -4, height: 0 }}
      animate={{ opacity: 1, y: 0, height: "auto" }}
      exit={{ opacity: 0, y: -4, height: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
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

        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
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
            viewBox="0 0 400 340"
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
              <linearGradient id="vc-scope-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0F1F3D" />
              </linearGradient>
            </defs>

            {/* abstract torso silhouette */}
            <path
              d="M 70 60 C 70 30 110 24 130 30 L 180 30 C 195 24 205 24 220 30 L 270 30 C 290 24 330 30 330 60 L 330 280 C 330 310 295 322 270 318 L 130 318 C 105 322 70 310 70 280 Z"
              fill="url(#vc-torso-fill)"
              stroke="#cbd5e1"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />

            {/* base colon track */}
            <path
              ref={pathRef}
              d={COLON_PATH}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* progressively filled scope path */}
            <path
              ref={fillRef}
              d={COLON_PATH}
              fill="none"
              stroke="#3B4FD8"
              strokeWidth="16"
              strokeLinecap="round"
              opacity={0.85}
            />

            {/* tiny anatomical end markers */}
            <circle cx="200" cy="300" r="3" fill="#94a3b8" />
            <text x="200" y="324" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight={500}>
              entry
            </text>
            <text x="290" y="270" textAnchor="middle" fontSize="9" fill="#94a3b8" fontWeight={500}>
              cecum
            </text>

            {/* scope tip */}
            <g ref={scopeRef}>
              <motion.circle
                r="18"
                fill="none"
                stroke="#3B4FD8"
                strokeWidth="2"
                animate={{ opacity: [0.55, 0, 0.55], scale: [0.85, 1.1, 0.85] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ originX: "0px", originY: "0px" }}
              />
              <circle r="9" fill="url(#vc-scope-fill)" />
              <circle r="4" fill="#3B4FD8" opacity={0.9} />
            </g>
          </svg>
        </div>

        <div style={{ minHeight: 52, marginTop: 4, position: "relative" }}>
          <AnimatePresence mode="wait">
            {!done && (
              <motion.p
                key={`cap-${captionIdx}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                style={{
                  margin: 0,
                  textAlign: "center",
                  fontSize: 12.5,
                  fontWeight: 500,
                  color: "#475569",
                  lineHeight: 1.5,
                  position: "absolute",
                  inset: 0,
                }}
              >
                {CAPTIONS[captionIdx].text}
              </motion.p>
            )}
            {done && (
              <motion.p
                key="final"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                  margin: 0,
                  textAlign: "center",
                  fontSize: 13.5,
                  fontWeight: 600,
                  color: "#0F1F3D",
                  lineHeight: 1.5,
                  position: "absolute",
                  inset: 0,
                }}
              >
                {FINAL_CAPTION}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              style={{ display: "flex", justifyContent: "center", marginTop: 10 }}
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
