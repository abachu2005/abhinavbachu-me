import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/cn";

const links = [
  { to: "/#parvez-lab-oss", label: "Parvez Lab OSS" },
  { to: "/#neurotech", label: "Neurotech" },
  { to: "/#veracare", label: "VeraCare" },
  { to: "/#izfc", label: "IZFC" },
  { to: "/#contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-bg)_92%,transparent)] backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--color-bg)_80%,transparent)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          to="/"
          className="font-serif text-[1.05rem] font-medium tracking-tight text-[var(--color-ink)] hover:text-[var(--color-accent-deep)]"
        >
          Abhinav Bachu
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3 py-1.5 text-[var(--color-ink-muted)] transition-colors hover:text-[var(--color-ink)]",
                  isActive && "text-[var(--color-ink)]",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
