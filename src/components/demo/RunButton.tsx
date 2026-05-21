import { Play, RotateCcw, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

export type RunButtonProps = {
  state: "idle" | "running" | "done";
  onClick: () => void;
  labelIdle?: string;
  labelRunning?: string;
  labelDone?: string;
};

export default function RunButton({
  state,
  onClick,
  labelIdle = "Run demo",
  labelRunning = "Running…",
  labelDone = "Run again",
}: RunButtonProps) {
  const isRunning = state === "running";
  const Icon = isRunning ? Loader2 : state === "done" ? RotateCcw : Play;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isRunning}
      className={cn(
        "inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
        "bg-[var(--color-accent)] text-white shadow-[var(--shadow-soft)]",
        "hover:bg-[var(--color-accent-deep)]",
        "disabled:cursor-wait disabled:opacity-90",
      )}
    >
      <Icon className={cn("h-4 w-4", isRunning && "animate-spin")} />
      {state === "running" ? labelRunning : state === "done" ? labelDone : labelIdle}
    </button>
  );
}
