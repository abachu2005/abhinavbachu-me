import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type SlideDeckProps = {
  slides: string[];
  /** Aspect ratio of the slide container. Defaults to 16/9. */
  aspect?: string;
  kicker?: string;
  /** Optional caption shown under each slide. Same length as `slides`. */
  captions?: (string | null | undefined)[];
};

export default function SlideDeck({
  slides,
  aspect = "16 / 9",
  kicker,
  captions,
}: SlideDeckProps) {
  const [i, setI] = useState(0);
  const total = slides.length;
  const next = () => setI((n) => Math.min(total - 1, n + 1));
  const back = () => setI((n) => Math.max(0, n - 1));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    const ahead = slides[i + 1];
    if (ahead) {
      const img = new Image();
      img.src = ahead;
    }
  }, [i, slides]);

  const caption = captions?.[i];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {kicker && (
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-[var(--color-accent)]">
              {kicker}
            </span>
          )}
          <span className="text-xs text-[var(--color-ink-subtle)]">
            Slide {i + 1} of {total}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden gap-1 sm:flex">
            {slides.map((_, n) => (
              <button
                key={n}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Go to slide ${n + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  n === i
                    ? "w-8 bg-[var(--color-accent)]"
                    : n < i
                      ? "w-2 bg-[var(--color-accent-light)]"
                      : "w-2 bg-[var(--color-border-strong)] hover:bg-[var(--color-ink-subtle)]",
                )}
              />
            ))}
          </div>
          <a
            href={slides[i]}
            target="_blank"
            rel="noreferrer"
            aria-label="Open slide in new tab"
            className="inline-flex items-center gap-1 text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
          >
            <Maximize2 className="h-3 w-3" />
            Full size
          </a>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-[var(--shadow-soft)]"
        style={{ aspectRatio: aspect }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={slides[i]}
            src={slides[i]}
            alt={`Slide ${i + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-0 h-full w-full object-contain"
            draggable={false}
          />
        </AnimatePresence>

        {i > 0 && (
          <button
            type="button"
            onClick={back}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/85 p-2 text-[var(--color-ink-muted)] shadow-[var(--shadow-soft)] backdrop-blur transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-ink)]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        {i < total - 1 && (
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)]/85 p-2 text-[var(--color-ink-muted)] shadow-[var(--shadow-soft)] backdrop-blur transition-colors hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-ink)]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {caption && (
        <p className="mt-3 text-center text-sm text-[var(--color-ink-muted)]">
          {caption}
        </p>
      )}

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
        <button
          type="button"
          onClick={next}
          disabled={i === total - 1}
          className="inline-flex items-center gap-1.5 rounded-md bg-[var(--color-accent)] px-3.5 py-1.5 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--color-accent-deep)] disabled:opacity-40 disabled:hover:bg-[var(--color-accent)]"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
