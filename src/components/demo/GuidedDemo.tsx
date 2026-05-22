import {
  type CSSProperties,
  type ReactNode,
  type RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  MousePointerClick,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/cn";

export type GuideStep = {
  /** Stable id for keying animations */
  id: string;
  /** Short label (currently unused visually but useful for debugging) */
  label?: string;
  /** Big plain-English title for the blurb */
  title: string;
  /** 1-3 sentence explanation */
  body: ReactNode;
  /** CSS data-tour-id of the element to anchor the blurb to. Omit for a centered intro/outro card. */
  target?: string;
  /** Where to place the blurb relative to the target */
  placement?: "top" | "bottom" | "left" | "right";
  /** "click" means the user must click the target to advance. "next" shows a Next button. Defaults to "next". */
  advance?: "click" | "next";
  /** Side-effect when this step opens (usually to flip preview state) */
  onEnter?: () => void;
};

export type GuidedDemoProps = {
  preview: ReactNode;
  steps: GuideStep[];
  kicker?: string;
};

export default function GuidedDemo({ preview, steps, kicker }: GuidedDemoProps) {
  const [i, setI] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const step = steps[i];

  useEffect(() => {
    step?.onEnter?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const next = () => setI((n) => Math.min(steps.length - 1, n + 1));
  const back = () => setI((n) => Math.max(0, n - 1));
  const restart = () => setI(0);

  const isLast = i === steps.length - 1;

  return (
    <div>
      {/* Top bar: progress + restart */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {kicker && (
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--color-accent)]">
              {kicker}
            </span>
          )}
          <span className="text-xs text-[var(--color-ink-subtle)]">
            Step {i + 1} of {steps.length}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden gap-1 sm:flex">
            {steps.map((_, n) => (
              <button
                key={n}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Step ${n + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  n === i
                    ? "w-8 bg-[var(--color-accent)]"
                    : n < i
                      ? "w-2 bg-[var(--color-accent-light)]"
                      : "w-2 bg-[var(--color-border-strong)] hover:bg-[var(--color-ink-subtle)]")}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            <RotateCcw className="h-3 w-3" />
            Restart
          </button>
        </div>
      </div>

      {/* The demo with overlay */}
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl"
      >
        {preview}
        <TourOverlay
          containerRef={containerRef}
          step={step}
          onAdvance={next}
        />
      </div>

      {/* Bottom bar */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={back}
          disabled={i === 0}
          className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)] disabled:opacity-40 disabled:hover:text-[var(--color-ink-muted)]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        {step.advance === "click" ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-accent-deep)]">
            <MousePointerClick className="h-3.5 w-3.5" />
            Click the highlighted element to continue
          </span>
        ) : isLast ? (
          <button
            type="button"
            onClick={restart}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-accent)] px-3.5 py-1.5 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--color-accent-deep)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Restart tour
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-accent)] px-3.5 py-1.5 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--color-accent-deep)]"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Overlay
// -----------------------------------------------------------------------------

type Rect = { left: number; top: number; width: number; height: number };
type Size = { w: number; h: number };

const BLURB_MAX_W = 288;
const BLURB_MIN_W = 240;
const MOBILE_BREAKPOINT = 520;
const GAP = 14;
const SAFE_MARGIN = 12;

function TourOverlay({
  containerRef,
  step,
  onAdvance,
}: {
  containerRef: RefObject<HTMLDivElement>;
  step: GuideStep;
  onAdvance: () => void;
}) {
  const blurbRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [containerSize, setContainerSize] = useState<Size>({ w: 0, h: 0 });
  const [blurbSize, setBlurbSize] = useState<Size>({ w: BLURB_MAX_W, h: 160 });

  // Recompute target rect whenever step or container changes.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let attempts = 0;

    const update = () => {
      if (!containerRef.current) return;
      const cr = containerRef.current.getBoundingClientRect();
      setContainerSize({ w: cr.width, h: cr.height });

      if (!step.target) {
        setRect(null);
        return;
      }

      const el = containerRef.current.querySelector(
        `[data-tour-id="${step.target}"]`) as HTMLElement | null;

      if (!el) {
        // DOM may not have mounted yet after onEnter swapped phase; retry.
        if (attempts++ < 30) {
          rafId = requestAnimationFrame(update);
        } else {
          setRect(null);
        }
        return;
      }

      // Keep the target in view inside scrollable demo panels.
      el.scrollIntoView({ block: "nearest", inline: "nearest" });

      const tr = el.getBoundingClientRect();
      const cr2 = containerRef.current!.getBoundingClientRect();
      setRect({
        left: tr.left - cr2.left,
        top: tr.top - cr2.top,
        width: tr.width,
        height: tr.height,
      });
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(container);
    const mo = new MutationObserver(update);
    mo.observe(container, { childList: true, subtree: true, attributes: true });
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step.id, step.target, containerRef]);

  // Measure the blurb itself so placement uses real dimensions.
  useLayoutEffect(() => {
    if (!blurbRef.current) return;
    const measure = () => {
      const el = blurbRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setBlurbSize((prev) =>
        Math.abs(prev.w - r.width) < 1 && Math.abs(prev.h - r.height) < 1
          ? prev
          : { w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(blurbRef.current);
    return () => ro.disconnect();
  }, [step.id, step.target, containerSize.w, containerSize.h]);

  const isMobile = containerSize.w > 0 && containerSize.w < MOBILE_BREAKPOINT;
  // Responsive blurb width: shrink with container, but keep readable.
  const blurbWidth = Math.max(
    BLURB_MIN_W,
    Math.min(BLURB_MAX_W, containerSize.w - SAFE_MARGIN * 2));

  // No target → centered card (intro/outro)
  if (!step.target || !rect) {
    return (
      <div className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(15,24,32,0.42)] backdrop-blur-[1px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.22 }}
            className="mx-6 max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 shadow-[var(--shadow-soft-lg)]"
          >
            <h4 className="font-serif text-xl leading-tight text-[var(--color-ink)]">
              {step.title}
            </h4>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {step.body}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Anchored placement
  const PAD = 6;
  const cutout: Rect = {
    left: rect.left - PAD,
    top: rect.top - PAD,
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
  };

  // Decide whether to anchor the blurb or fall back to a centered/edge card.
  const placement = computeBlurbPlacement(
    cutout,
    { w: blurbWidth, h: blurbSize.h },
    step.placement ?? "right",
    containerSize,
    isMobile);

  return (
    <div className="absolute inset-0 z-30">
      {/* Four dimmer panels surrounding the cutout, blocking clicks elsewhere */}
      <div
        className="absolute z-10 bg-[rgba(15,24,32,0.45)]"
        style={{ left: 0, top: 0, width: "100%", height: cutout.top }}
      />
      <div
        className="absolute z-10 bg-[rgba(15,24,32,0.45)]"
        style={{
          left: 0,
          top: cutout.top,
          width: cutout.left,
          height: cutout.height,
        }}
      />
      <div
        className="absolute z-10 bg-[rgba(15,24,32,0.45)]"
        style={{
          left: cutout.left + cutout.width,
          top: cutout.top,
          right: 0,
          height: cutout.height,
        }}
      />
      <div
        className="absolute z-10 bg-[rgba(15,24,32,0.45)]"
        style={{
          left: 0,
          top: cutout.top + cutout.height,
          width: "100%",
          bottom: 0,
        }}
      />

      {/* Pulsing ring around target */}
      <motion.div
        className="pointer-events-none absolute z-20 rounded-md"
        style={{
          left: cutout.left,
          top: cutout.top,
          width: cutout.width,
          height: cutout.height,
          boxShadow:
            "0 0 0 2px var(--color-accent), 0 0 0 6px rgba(46, 120, 96, 0.18)",
        }}
        animate={{
          boxShadow: [
            "0 0 0 2px var(--color-accent), 0 0 0 4px rgba(46, 120, 96, 0.30)",
            "0 0 0 2px var(--color-accent), 0 0 0 12px rgba(46, 120, 96, 0)",
            "0 0 0 2px var(--color-accent), 0 0 0 4px rgba(46, 120, 96, 0.30)",
          ],
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Click catcher (only when this step advances by clicking) */}
      {step.advance === "click" && (
        <button
          type="button"
          onClick={onAdvance}
          aria-label="Advance tour"
          className="absolute z-20 cursor-pointer rounded-md"
          style={{
            left: cutout.left,
            top: cutout.top,
            width: cutout.width,
            height: cutout.height,
            background: "transparent",
            border: "none",
          }}
        />
      )}

      {/* Blurb */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          ref={blurbRef}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -2 }}
          transition={{ duration: 0.18 }}
          className="absolute z-40"
          style={{
            ...placement.style,
            width: blurbWidth,
            maxWidth: `calc(100% - ${SAFE_MARGIN * 2}px)`,
          }}
        >
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-soft-lg)]">
            <h4 className="font-serif text-base leading-tight text-[var(--color-ink)]">
              {step.title}
            </h4>
            <div className="mt-1.5 space-y-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {step.body}
            </div>
            {step.advance === "click" && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-[var(--color-accent-tint)] px-2 py-1 text-[0.7rem] font-medium text-[var(--color-accent-deep)]">
                <MousePointerClick className="h-3 w-3" />
                Click the highlighted element
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Placement
// -----------------------------------------------------------------------------

function computeBlurbPlacement(
  cutout: Rect,
  blurb: Size,
  preferred: "top" | "bottom" | "left" | "right",
  container: Size,
  isMobile: boolean): { style: CSSProperties } {
  const W = blurb.w;
  const H = blurb.h;
  const SW = container.w;
  const SH = container.h;

  // Mobile: always pin to the top of the container so the blurb never
  // covers the highlighted element and never gets clipped sideways.
  if (isMobile) {
    const cutoutCovers =
      cutout.top < SH * 0.45 && cutout.top + cutout.height > SH * 0.15;
    return {
      style: {
        left: SAFE_MARGIN,
        right: SAFE_MARGIN,
        // If the target is near the top, push the blurb to the bottom; otherwise top.
        ...(cutoutCovers
          ? { bottom: SAFE_MARGIN }
          : { top: SAFE_MARGIN }),
        width: "auto",
      },
    };
  }

  const fits = {
    right: cutout.left + cutout.width + GAP + W + SAFE_MARGIN <= SW,
    left: cutout.left - GAP - W - SAFE_MARGIN >= 0,
    bottom: cutout.top + cutout.height + GAP + H + SAFE_MARGIN <= SH,
    top: cutout.top - GAP - H - SAFE_MARGIN >= 0,
  };

  const order: Array<"right" | "left" | "bottom" | "top"> = [
    preferred,
    "bottom",
    "right",
    "top",
    "left",
  ];
  const chosen = order.find((x) => fits[x]);

  const clamp = (v: number, min: number, max: number) =>
    Math.max(min, Math.min(v, max));

  if (chosen === "right") {
    return {
      style: {
        left: cutout.left + cutout.width + GAP,
        top: clamp(
          cutout.top + cutout.height / 2 - H / 2,
          SAFE_MARGIN,
          SH - H - SAFE_MARGIN),
      },
    };
  }
  if (chosen === "left") {
    return {
      style: {
        left: cutout.left - GAP - W,
        top: clamp(
          cutout.top + cutout.height / 2 - H / 2,
          SAFE_MARGIN,
          SH - H - SAFE_MARGIN),
      },
    };
  }
  if (chosen === "top") {
    return {
      style: {
        left: clamp(
          cutout.left + cutout.width / 2 - W / 2,
          SAFE_MARGIN,
          SW - W - SAFE_MARGIN),
        top: cutout.top - GAP - H,
      },
    };
  }
  if (chosen === "bottom") {
    return {
      style: {
        left: clamp(
          cutout.left + cutout.width / 2 - W / 2,
          SAFE_MARGIN,
          SW - W - SAFE_MARGIN),
        top: cutout.top + cutout.height + GAP,
      },
    };
  }

  // Nothing fits, fall back to whichever has the most room.
  // Prefer pinning to bottom of container above the target if the cutout is
  // near the top, otherwise pin above the cutout.
  const spaceBelow = SH - (cutout.top + cutout.height);
  const spaceAbove = cutout.top;
  if (spaceBelow >= spaceAbove) {
    return {
      style: {
        left: clamp(
          cutout.left + cutout.width / 2 - W / 2,
          SAFE_MARGIN,
          SW - W - SAFE_MARGIN),
        bottom: SAFE_MARGIN,
      },
    };
  }
  return {
    style: {
      left: clamp(
        cutout.left + cutout.width / 2 - W / 2,
        SAFE_MARGIN,
        SW - W - SAFE_MARGIN),
      top: SAFE_MARGIN,
    },
  };
}

// -----------------------------------------------------------------------------
// Inline glossary chip, still exported for use inside step bodies
// -----------------------------------------------------------------------------

export function Glossary({
  term,
  def,
}: {
  term: string;
  def: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onBlur={() => setOpen(false)}
        className={cn(
          "inline-flex items-center gap-1 rounded border-b border-dashed border-[var(--color-accent-light)] text-[var(--color-ink)]",
          "hover:text-[var(--color-accent-deep)]")}
      >
        {term}
        <HelpCircle className="h-3 w-3 text-[var(--color-accent)]" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-1.5 w-64 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3 text-xs leading-relaxed text-[var(--color-ink)] shadow-[var(--shadow-soft-md)]"
          >
            <span className="block font-medium text-[var(--color-accent-deep)]">
              {term}
            </span>
            <span className="mt-1 block text-[var(--color-ink-muted)]">
              {def}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
