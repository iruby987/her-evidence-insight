import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { DISCLAIMER } from "@/lib/her-evidence-data";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard" },
  { to: "/log", label: "Log symptoms" },
  { to: "/evidence", label: "Evidence library" },
  { to: "/report", label: "Doctor visit report" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-display text-lg">
              H
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-lg font-semibold leading-none">
                Her Evidence
              </span>
              <span className="block text-xs text-muted-foreground mt-0.5">
                Evidence-based menstrual health
              </span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const active =
                n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <nav className="md:hidden border-t border-border/60 overflow-x-auto">
          <div className="mx-auto max-w-6xl px-4 py-2 flex gap-1">
            {nav.map((n) => {
              const active =
                n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-border/70 bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 text-xs text-muted-foreground">
          <p className="leading-relaxed">
            <strong className="text-foreground">Disclaimer.</strong> {DISCLAIMER}
          </p>
          <p className="mt-2 opacity-80">
            © {new Date().getFullYear()} Her Evidence · Prototype using local mock
            data and simulated wearable synchronization.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function DisclaimerBanner() {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-xs sm:text-sm text-primary">
      <strong className="font-semibold">Educational use only.</strong>{" "}
      <span className="text-foreground/80">{DISCLAIMER}</span>
    </div>
  );
}

export function DemoBadge({ children = "Demo wearable data" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/40 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-accent-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-primary/80" />
      {children}
    </span>
  );
}