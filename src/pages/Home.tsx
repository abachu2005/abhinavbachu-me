import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { projects, talks } from "@/data/projects";
import { cn } from "@/lib/cn";
import type { Project } from "@/data/projects";

const PARVEZ_OSS_SLUGS = ["autobarcoder", "leafminer", "zebrachop"];
const NEUROTECH_SLUGS = ["neurotech"];
const VERACARE_SLUGS = ["veracare"];

const bySlug = (slugs: string[]) =>
  slugs
    .map((s) => projects.find((p) => p.slug === s))
    .filter((p): p is Project => Boolean(p));

function ProjectCard({ p, i }: { p: Project; i: number }) {
  return (
    <Link
      to={p.href}
      className={cn(
        "v-surface v-surface-hover v-card v-slide-up group flex flex-col p-6",
        `v-stagger-${Math.min(i + 1, 6)}`)}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="font-serif text-[1.35rem] leading-tight text-[var(--color-ink)]">
          {p.name}
        </h3>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--color-ink-subtle)] transition-colors group-hover:text-[var(--color-accent)]" />
      </div>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        {p.tagline}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {p.tags.map((t) => (
          <span
            key={t}
            className={cn(
              "rounded-full border border-[var(--color-border)] bg-[var(--color-panel)] px-2 py-0.5 text-[0.7rem] font-medium text-[var(--color-ink-muted)]",
              t === "In progress" &&
                "border-[var(--color-accent-tint)] bg-[var(--color-accent-tint)] text-[var(--color-accent-deep)]")}
          >
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}

function ProjectGroup({
  id,
  title,
  description,
  items,
}: {
  id: string;
  title: string;
  description?: string;
  items: Project[];
}) {
  if (items.length === 0) return null;
  return (
    <section id={id} className="mt-20 scroll-mt-20 first:mt-0">
      <div className="mb-6 flex items-end justify-between gap-6">
        <div>
          <h2>{title}</h2>
          {description && (
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-muted)]">
              {description}
            </p>
          )}
        </div>
        <p className="shrink-0 text-sm text-[var(--color-ink-muted)]">
          {items.length} {items.length === 1 ? "project" : "projects"}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <ProjectCard key={p.slug} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const parvezOss = bySlug(PARVEZ_OSS_SLUGS);
  const neurotech = bySlug(NEUROTECH_SLUGS);
  const veracare = bySlug(VERACARE_SLUGS);
  const izfcTalks = talks.filter((t) => t.slug.startsWith("izfc"));

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8">
      {/* Hero */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-3xl">
          <p className="v-slide-up-sm mb-5 text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-accent)]">
            Currently applying to medical school
          </p>
          <h1 className="v-slide-up text-balance">
            Hi, I&rsquo;m Abhinav. <span className="text-[var(--color-ink-muted)]">Welcome to my site.</span>
          </h1>
          <p className="v-slide-up v-stagger-2 mt-6 max-w-2xl text-lg text-[var(--color-ink-muted)]">
            I build open-source tools for biomedical research and run a startup
            in surgical care. This site is a small museum of the projects I
            care most about. Click any of them to walk through how they work.
          </p>
        </div>
      </section>

      <ProjectGroup
        id="parvez-lab-oss"
        title="Parvez Lab OSS"
        description="Open-source bioinformatics tools I built during my work in the Parvez Lab."
        items={parvezOss}
      />

      <ProjectGroup
        id="neurotech"
        title="Neurotech"
        description="EEG and brain-computer-interface work from my student neurotech group."
        items={neurotech}
      />

      <ProjectGroup
        id="veracare"
        title="VeraCare"
        description="My startup building AI-assisted surgical care navigation."
        items={veracare}
      />

      {/* IZFC */}
      {izfcTalks.length > 0 && (
        <section id="izfc" className="mt-20 scroll-mt-20">
          <div className="mb-6">
            <h2>IZFC</h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--color-ink-muted)]">
              Talks and presentations at the International Zebrafish Conference.
            </p>
          </div>
          <div className="space-y-2">
            {izfcTalks.map((t) => (
              <Link
                key={t.slug}
                to={t.href}
                className="v-surface v-surface-hover group flex items-center justify-between p-5"
              >
                <div>
                  <p className="font-serif text-[1.05rem] leading-snug text-[var(--color-ink)]">
                    {t.title}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                    {t.venue} &middot; {t.year}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[var(--color-ink-subtle)] transition-colors group-hover:text-[var(--color-accent)]" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="mt-24 scroll-mt-20 pb-8">
        <h2 className="mb-4">Contact</h2>
        <p className="max-w-2xl text-[var(--color-ink-muted)]">
          Reach me at{" "}
          <a href="mailto:abhinav.bachu.med@gmail.com">abhinav.bachu.med@gmail.com</a> or
          on <a href="https://github.com/abachu2005" target="_blank" rel="noreferrer">GitHub</a>.
        </p>
      </section>
    </div>
  );
}
