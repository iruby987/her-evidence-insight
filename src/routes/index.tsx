import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AppShell,
  DemoBadge,
  DisclaimerBanner,
} from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  baselines,
  currentCycleDay,
  currentCycleWearable,
  painTrendByCycleDay,
  symptomRecords,
  totalCycleLength,
} from "@/lib/her-evidence-data";
import { ActivitySquare, HeartPulse, Moon, PlusCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  const recent = [...symptomRecords].slice(-5).reverse();
  const currentCycle = currentCycleWearable.slice(0, 14); // first two weeks visible

  const avgSleepCurrent =
    currentCycle.reduce((s, d) => s + d.sleep, 0) / currentCycle.length;
  const avgHRCurrent =
    currentCycle.reduce((s, d) => s + d.restingHR, 0) / currentCycle.length;

  return (
    <AppShell>
      <div className="space-y-8">
        <DisclaimerBanner />

        {/* Hero */}
        <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Cycle overview
            </p>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-foreground">
              Day{" "}
              <span className="text-primary tabular-nums">
                {currentCycleDay}
              </span>{" "}
              of your cycle
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Compared with your personal baseline across the last six cycles.
              Log today's symptoms to keep your report accurate.
            </p>
          </div>
          <Button asChild size="lg" className="justify-self-start md:justify-self-end">
            <Link to="/log">
              <PlusCircle className="mr-2 h-4 w-4" />
              Log symptoms
            </Link>
          </Button>
        </section>

        {/* Metric strip */}
        <section className="grid gap-3 sm:grid-cols-3">
          <MetricCard
            icon={<ActivitySquare className="h-4 w-4" />}
            label="Mean pain (all cycles)"
            value={baselines.meanPain.toFixed(1)}
            unit="/ 10"
            hint={`Across ${symptomRecords.length} logged days`}
          />
          <MetricCard
            icon={<Moon className="h-4 w-4" />}
            label="Sleep this cycle"
            value={avgSleepCurrent.toFixed(1)}
            unit="h"
            hint={`Baseline ${baselines.sleepHours} h`}
            demo
          />
          <MetricCard
            icon={<HeartPulse className="h-4 w-4" />}
            label="Resting HR this cycle"
            value={avgHRCurrent.toFixed(0)}
            unit="bpm"
            hint={`Baseline ${baselines.restingHR} bpm`}
            demo
          />
        </section>

        {/* Charts */}
        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Pain trend by cycle day</CardTitle>
              <p className="text-xs text-muted-foreground">
                Mean self-reported pain score across your last six cycles.
              </p>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={painTrendByCycleDay}>
                  <defs>
                    <linearGradient id="painFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="cycleDay"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 12 }}
                    label={{ value: "Cycle day", position: "insideBottom", offset: -4, fontSize: 11 }}
                  />
                  <YAxis
                    domain={[0, 10]}
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v} / 10`, "Mean pain"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="meanPain"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#painFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
              <div className="min-w-0">
                <CardTitle className="font-display">
                  Sleep &amp; resting heart rate
                </CardTitle>
                <p className="text-xs text-muted-foreground">
                  Current cycle compared with personal baseline.
                </p>
              </div>
              <DemoBadge />
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentCycleWearable}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis
                    dataKey="cycleDay"
                    stroke="var(--muted-foreground)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="sleep"
                    orientation="left"
                    domain={[4, 9]}
                    stroke="var(--chart-3)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="hr"
                    orientation="right"
                    domain={[55, 78]}
                    stroke="var(--primary)"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <ReferenceLine
                    yAxisId="hr"
                    y={baselines.restingHR}
                    stroke="var(--primary)"
                    strokeDasharray="4 4"
                    strokeOpacity={0.4}
                  />
                  <ReferenceLine
                    yAxisId="sleep"
                    y={baselines.sleepHours}
                    stroke="var(--chart-3)"
                    strokeDasharray="4 4"
                    strokeOpacity={0.4}
                  />
                  <Line
                    yAxisId="sleep"
                    type="monotone"
                    dataKey="sleep"
                    name="Sleep (h)"
                    stroke="var(--chart-3)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    yAxisId="hr"
                    type="monotone"
                    dataKey="restingHR"
                    name="Resting HR (bpm)"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </section>

        {/* Bottom row: recent records + insight */}
        <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Recent symptom records</CardTitle>
              <p className="text-xs text-muted-foreground">
                Last five logged days.
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border">
                {recent.map((r) => (
                  <li
                    key={r.id}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 py-3"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary font-display text-sm">
                      {r.painScore.toFixed(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {r.date} · Cycle day {r.cycleDay}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.location.join(", ")} · flow {r.flow} ·{" "}
                        {r.associated.slice(0, 2).join(", ")}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="shrink-0 whitespace-nowrap"
                    >
                      {r.durationHours} h
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-primary text-primary-foreground border-primary">
            <CardHeader>
              <p className="text-[11px] uppercase tracking-[0.2em] opacity-70">
                Personal insight
              </p>
              <CardTitle className="font-display text-2xl leading-snug">
                Sleep dips ~10% in the week before your period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm opacity-95">
              <p>
                Over your last six cycles, sleep on days 22–28 averaged{" "}
                <strong className="tabular-nums">6.4 h</strong> versus your
                personal baseline of{" "}
                <strong className="tabular-nums">
                  {baselines.sleepHours} h
                </strong>
                . This is an observed association only.
              </p>
              <p className="text-xs opacity-80">
                A meta-analysis of {`>2,000 participants`} reports a similar
                pattern in the late luteal phase — may be worth discussing with
                a clinician if it disrupts daily life.
              </p>
              <Button
                asChild
                variant="secondary"
                className="mt-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                <Link to="/evidence">See supporting research</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <p className="text-[11px] text-muted-foreground text-center">
          Cycle length assumption: {totalCycleLength} days · All values are
          patient-generated or simulated wearable data.
        </p>
      </div>
    </AppShell>
  );
}

function MetricCard({
  icon,
  label,
  value,
  unit,
  hint,
  demo,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  hint: string;
  demo?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 text-muted-foreground">
            <span className="text-primary">{icon}</span>
            <span className="truncate text-xs uppercase tracking-wide">
              {label}
            </span>
          </div>
          {demo ? <DemoBadge>Demo</DemoBadge> : null}
        </div>
        <p className="mt-2 font-display text-3xl font-semibold">
          {value}
          <span className="ml-1 text-base font-normal text-muted-foreground">
            {unit}
          </span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
