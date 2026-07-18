import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, DemoBadge, DisclaimerBanner } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  baselines,
  currentCycleWearable,
  painTrendByCycleDay,
  researchLibrary,
  symptomRecords,
} from "@/lib/her-evidence-data";
import { Printer } from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Doctor visit report — Her Evidence" },
      {
        name: "description",
        content:
          "Printable patient-generated health summary for a medical appointment.",
      },
    ],
  }),
  component: ReportPage,
});

function ReportPage() {
  const dates = symptomRecords.map((r) => r.date).sort();
  const start = dates[0];
  const end = dates[dates.length - 1];

  const severe = symptomRecords.filter((r) => r.painScore >= 7).length;
  const moderate = symptomRecords.filter(
    (r) => r.painScore >= 4 && r.painScore < 7,
  ).length;
  const mild = symptomRecords.filter((r) => r.painScore < 4).length;

  const meanImpact = {
    sleep: avg(symptomRecords.map((r) => r.impact.sleep)),
    work: avg(symptomRecords.map((r) => r.impact.work)),
    school: avg(symptomRecords.map((r) => r.impact.school)),
    daily: avg(symptomRecords.map((r) => r.impact.daily)),
  };
  const impactData = [
    { area: "Sleep", score: meanImpact.sleep },
    { area: "Work", score: meanImpact.work },
    { area: "School", score: meanImpact.school },
    { area: "Daily", score: meanImpact.daily },
  ];

  const withMed = symptomRecords.filter((r) => r.medEffectiveness != null);
  const medMean = withMed.length ? avg(withMed.map((r) => r.medEffectiveness!)) : 0;

  const supportingPapers = researchLibrary.slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end print:hidden">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Doctor visit report
            </p>
            <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold">
              Patient-generated health summary
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Bring this printable summary to your appointment. All wording avoids
              diagnosis or causation — it describes observed associations compared
              with your personal baseline.
            </p>
          </div>
          <Button onClick={() => window.print()} size="lg">
            <Printer className="mr-2 h-4 w-4" />
            Print / save PDF
          </Button>
        </div>

        <div className="print:hidden">
          <DisclaimerBanner />
        </div>

        <article className="rounded-2xl border border-border bg-card p-6 sm:p-10 print:border-0 print:p-0 space-y-8">
          <header className="border-b border-border pb-6">
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">
              Her Evidence — patient-generated summary
            </p>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-semibold">
              Reporting period: {start} to {end}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {symptomRecords.length} logged symptom days across{" "}
              {new Set(symptomRecords.map((r) => Math.floor(daysBetween(start, r.date) / 28))).size} cycles.
            </p>
          </header>

          <Section title="Main concern">
            <p className="text-sm leading-relaxed">
              Recurrent menstrual pain across multiple cycles, with an observed
              association to reduced sleep and elevated resting heart rate in the
              days leading into menstruation, compared with the patient's personal
              baseline. Patient reports this pattern may be worth discussing with a
              clinician.
            </p>
          </Section>

          <Section title="Frequency &amp; severity of symptoms">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="Severe (≥7/10)" value={`${severe} days`} />
              <Stat label="Moderate (4–6/10)" value={`${moderate} days`} />
              <Stat label="Mild (&lt;4/10)" value={`${mild} days`} />
            </div>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={painTrendByCycleDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="cycleDay" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="meanPain"
                    name="Mean pain"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Mean self-reported pain score by cycle day.
            </p>
          </Section>

          <Section title="Daily-life impact">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="area" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 10]} stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="score" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Mean self-reported impact (0 = no impact, 10 = unable to function).
            </p>
          </Section>

          <Section title="Medication response">
            <p className="text-sm">
              Most-used medication: <strong>Ibuprofen 400mg</strong>. Mean
              self-reported effectiveness: <strong>{medMean.toFixed(1)} / 10</strong>{" "}
              across {withMed.length} occasions. Observed association only — not a
              treatment recommendation.
            </p>
          </Section>

          <Section
            title="Physiological observations"
            aside={<DemoBadge>Simulated wearable data</DemoBadge>}
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Stat
                label="Personal sleep baseline"
                value={`${baselines.sleepHours} h`}
                hint="Averaged across six cycles"
              />
              <Stat
                label="Personal resting-HR baseline"
                value={`${baselines.restingHR} bpm`}
                hint="Averaged across six cycles"
              />
            </div>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentCycleWearable}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="cycleDay" stroke="var(--muted-foreground)" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="s" orientation="left" domain={[4, 9]} stroke="var(--chart-3)" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="h" orientation="right" domain={[55, 78]} stroke="var(--primary)" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <ReferenceLine yAxisId="s" y={baselines.sleepHours} stroke="var(--chart-3)" strokeDasharray="4 4" />
                  <ReferenceLine yAxisId="h" y={baselines.restingHR} stroke="var(--primary)" strokeDasharray="4 4" />
                  <Line yAxisId="s" type="monotone" dataKey="sleep" name="Sleep (h)" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
                  <Line yAxisId="h" type="monotone" dataKey="restingHR" name="Resting HR" stroke="var(--primary)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Values above are simulated demo data from a prototype wearable
              integration and should be verified against a real device before
              clinical use.
            </p>
          </Section>

          <Section title="Questions to discuss with a clinician">
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>
                Is the observed pattern of pre-menstrual sleep reduction and
                elevated resting heart rate within a typical range for me?
              </li>
              <li>
                Given pain scores of 7+ on multiple cycle days, would further
                evaluation for conditions such as endometriosis or adenomyosis be
                appropriate?
              </li>
              <li>
                Are there alternatives to NSAIDs I should consider, or ways to
                improve current medication response?
              </li>
              <li>
                What symptoms should prompt me to seek care sooner rather than
                waiting for my next appointment?
              </li>
            </ol>
          </Section>

          <Section title="Supporting peer-reviewed studies">
            <ul className="space-y-3">
              {supportingPapers.map((p) => (
                <li key={p.id} className="rounded-md border border-border p-3">
                  <p className="text-sm font-semibold leading-snug">{p.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.authors} · <em>{p.journal}</em>, {p.year} ·{" "}
                    {p.studyType} · n = {p.sampleSize.toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs">
                    <Badge
                      variant="outline"
                      className="mr-2 text-[10px]"
                    >
                      {p.evidenceStrength} evidence
                    </Badge>
                    DOI: <span className="font-mono">{p.doi}</span> · PMID:{" "}
                    <span className="font-mono">{p.pubmedId}</span>
                  </p>
                </li>
              ))}
            </ul>
          </Section>

          <footer className="border-t border-border pt-6 text-xs text-muted-foreground leading-relaxed">
            This summary uses the language of <em>observed association</em> and{" "}
            <em>comparison with the patient's personal baseline</em>. It does
            not diagnose disease or claim causation, and it does not replace
            professional medical care. Findings <em>may be worth discussing
            with a clinician</em>.
          </footer>
        </article>
      </div>
    </AppShell>
  );
}

function Section({
  title,
  aside,
  children,
}: {
  title: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 mb-3">
        <h3 className="font-display text-lg font-semibold">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

function avg(xs: number[]) {
  if (!xs.length) return 0;
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

function daysBetween(a: string, b: string) {
  return Math.abs((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}