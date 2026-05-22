import type { ReactNode } from "react";
import { Section } from "@/components/layout/PageShell";

type InstallSectionProps = {
  packageName: string;
  pypiUrl: string;
  biocondaUrl?: string;
  setupCommand?: string;
  webCommand?: string;
  note?: ReactNode;
};

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] px-4 py-3 text-[0.8rem] leading-relaxed text-[var(--color-ink)]">
      {children}
    </pre>
  );
}

export default function InstallSection({
  packageName,
  pypiUrl,
  biocondaUrl,
  setupCommand,
  webCommand,
  note,
}: InstallSectionProps) {
  return (
    <Section title="Install">
      <p className="mb-5">
        Published on{" "}
        <a href={pypiUrl} target="_blank" rel="noreferrer">
          PyPI
        </a>{" "}
        as <code>{packageName}</code> v1.0.2.
        {biocondaUrl ? (
          <>
            {" "}
            Bioconda recipes are{" "}
            <a href={biocondaUrl} target="_blank" rel="noreferrer">
              under review
            </a>
            ; use pip today, or conda once merged.
          </>
        ) : (
          <> Install with pip or conda below.</>
        )}
      </p>

      <div className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-ink)]">pip</p>
          <CodeBlock>{`pip install ${packageName}`}</CodeBlock>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--color-ink)]">conda (after bioconda merge)</p>
          <CodeBlock>{`conda install -c bioconda ${packageName}`}</CodeBlock>
        </div>

        {(setupCommand || webCommand) && (
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--color-ink)]">Quick start</p>
            <CodeBlock>
              {[setupCommand, webCommand].filter(Boolean).join("\n")}
            </CodeBlock>
          </div>
        )}

        {note && <p className="text-sm">{note}</p>}
      </div>
    </Section>
  );
}
