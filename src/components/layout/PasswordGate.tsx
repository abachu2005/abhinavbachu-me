import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Lock } from "lucide-react";
import PageShell from "@/components/layout/PageShell";

type PasswordGateProps = {
  storageKey: string;
  /** SHA-256 hex digest of the accepted password. */
  passwordHash: string;
  /** Short label used in the gate header. */
  label: string;
  blurb?: ReactNode;
  /** When true, render a compact gate card instead of replacing the page. */
  inline?: boolean;
  /** When locked, render nothing (for secondary gated blocks sharing a key). */
  hideFormWhenLocked?: boolean;
  children: ReactNode;
};

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function PasswordGate({
  storageKey,
  passwordHash,
  label,
  blurb,
  inline = false,
  hideFormWhenLocked = false,
  children,
}: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "1") {
        setUnlocked(true);
      }
    } catch {
      // sessionStorage can throw in some private modes; treat as locked
    }
    setChecking(false);
  }, [storageKey]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value) return;
    setBusy(true);
    setError(null);
    try {
      const hash = await sha256(value);
      if (hash === passwordHash) {
        try {
          sessionStorage.setItem(storageKey, "1");
        } catch {
          // ignore, user can still proceed for this session in memory
        }
        setUnlocked(true);
      } else {
        setError("That password didn't match. Try again.");
        setValue("");
      }
    } finally {
      setBusy(false);
    }
  };

  if (checking) {
    return null;
  }

  if (unlocked) {
    return <>{children}</>;
  }

  const formId = inline ? "gate-password-inline" : "gate-password";

  const gateCard = (
    <div
      className={
        inline
          ? "rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-soft)]"
          : "mx-auto max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 shadow-[var(--shadow-soft)]"
      }
    >
      <div className="mb-5 flex items-center gap-2 text-sm text-[var(--color-ink-muted)]">
        <Lock className="h-4 w-4 text-[var(--color-accent)]" />
        <span>{inline ? label : "Password required"}</span>
      </div>

      {blurb && (
        <div className="mb-5 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          {blurb}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor={formId} className="sr-only">
          Password
        </label>
        <input
          id={formId}
          type="password"
          autoComplete="current-password"
          autoFocus={!inline}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Access password"
          className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent-tint)]"
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={busy || !value}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3.5 py-2 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition-colors hover:bg-[var(--color-accent-deep)] disabled:opacity-40 disabled:hover:bg-[var(--color-accent)]"
        >
          {busy ? "Checking…" : "Unlock demo"}
        </button>
      </form>

      <p className="mt-4 text-xs text-[var(--color-ink-subtle)]">
        Access remains unlocked for this browser session.
      </p>
    </div>
  );

  if (inline) {
    if (hideFormWhenLocked) {
      return (
        <p className="text-sm text-[var(--color-ink-subtle)]">
          Unlock the demo above to view this section.
        </p>
      );
    }
    return gateCard;
  }

  return (
    <PageShell
      eyebrow={label}
      title="This page is private"
      tagline="Enter the access password to continue."
    >
      {gateCard}
    </PageShell>
  );
}
