import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type DemoFrameProps = {
  children: ReactNode;
  className?: string;
};

export default function DemoFrame({ children, className }: DemoFrameProps) {
  return (
    <div
      className={cn(
        "v-surface overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-strong)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-strong)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-border-strong)]" />
        <span className="ml-3 font-mono text-xs text-[var(--color-ink-subtle)]">
          interactive demo
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}
