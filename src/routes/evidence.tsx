import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, DisclaimerBanner } from "@/components/AppShell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { researchLibrary, type ResearchPaper } from "@/lib/her-evidence-data";
import { Search, ExternalLink, Sparkles, FileText } from "lucide-react";

export const Route = createFileRoute("/evidence")({
  head: () => ({
    meta: [
      { title: "Evidence library — Her Evidence" },
      {
        name: "description",
        content:
          "Searchable database of peer-reviewed research on menstrual health, wearables, and treatment.",
      },
    ],
  }),
  component: EvidencePage,
});

const STRENGTH_STYLES: Record<ResearchPaper["evidenceStrength"], string> = {
  High: "bg-primary/15 text-primary border-primary/30",
  Moderate: "bg-accent/60 text-accent-foreground border-accent",
  Low: "bg-muted text-muted-foreground border-border",
};

function EvidencePage() {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(researchLibrary.flatMap((p) => p.tags))),
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return researchLibrary.filter((p) => {
      if (tag && !p.tags.includes(tag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.journal.toLowerCase().includes(q) ||
        p.keyFinding.toLowerCase().includes(q) ||
        p.plainLanguage.toLowerCase().includes(q) ||
        p.tags.some((t) => t.includes(q))
      );
    });
  }, [query, tag]);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Evidence library
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold">
            Peer-reviewed research on menstrual health
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Source metadata is drawn directly from published papers. Plain-language
            explanations and limitation notes are AI-generated summaries — verify
            with the linked source before drawing conclusions.
          </p>
        </div>

        <DisclaimerBanner />

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] items-start">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, author, journal, keyword…"
              className="pl-9"
            />
          </div>
          <p className="text-xs text-muted-foreground sm:self-center">
            {results.length} of {researchLibrary.length} papers
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <TagChip active={tag === null} onClick={() => setTag(null)}>
            All topics
          </TagChip>
          {allTags.map((t) => (
            <TagChip key={t} active={tag === t} onClick={() => setTag(t)}>
              {t}
            </TagChip>
          ))}
        </div>

        <div className="grid gap-4">
          {results.map((p) => (
            <ResearchCard key={p.id} paper={p} />
          ))}
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground py-12 text-center">
              No papers match this search.
            </p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}

function TagChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}

function ResearchCard({ paper }: { paper: ResearchPaper }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-2 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className={STRENGTH_STYLES[paper.evidenceStrength]}
          >
            {paper.evidenceStrength} evidence
          </Badge>
          <Badge variant="secondary">{paper.studyType}</Badge>
          {paper.tags.slice(0, 3).map((t) => (
            <Badge key={t} variant="outline" className="text-muted-foreground">
              {t}
            </Badge>
          ))}
        </div>
        <h2 className="font-display text-lg sm:text-xl leading-snug">
          {paper.title}
        </h2>
        <p className="text-xs text-muted-foreground">
          {paper.authors} · <em>{paper.journal}</em>, {paper.year} · n =
          {" "}
          {paper.sampleSize.toLocaleString()} · {paper.population}
        </p>
      </CardHeader>
      <CardContent className="space-y-4 pt-3">
        <section className="rounded-md border border-border bg-muted/40 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
            <FileText className="h-3 w-3" />
            Source metadata — key finding
          </p>
          <p className="mt-1 text-sm text-foreground">{paper.keyFinding}</p>
        </section>

        <section className="rounded-md border border-primary/20 bg-primary/5 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            AI-generated plain-language summary
          </p>
          <p className="mt-1 text-sm text-foreground">{paper.plainLanguage}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            <strong>Limitations:</strong> {paper.limitations}
          </p>
        </section>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>PubMed ID: <span className="font-mono">{paper.pubmedId}</span></span>
          <span aria-hidden>·</span>
          <span>DOI: <span className="font-mono">{paper.doi}</span></span>
          <div className="ml-auto flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pubmedId}/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                PubMed <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                DOI <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}