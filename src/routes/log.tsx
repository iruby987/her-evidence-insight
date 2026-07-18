import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, DisclaimerBanner } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/log")({
  head: () => ({
    meta: [
      { title: "Log symptoms — Her Evidence" },
      {
        name: "description",
        content: "Record pain, flow, medication, and daily-life impact.",
      },
    ],
  }),
  component: LogSymptomsPage,
});

const LOCATIONS = ["Lower abdomen", "Lower back", "Pelvis", "Thighs", "Head", "Breast"];
const ASSOCIATED = [
  "Nausea",
  "Fatigue",
  "Headache",
  "Bloating",
  "Mood changes",
  "Diarrhea",
  "Dizziness",
];

function LogSymptomsPage() {
  const [pain, setPain] = useState<number>(4);
  const [locations, setLocations] = useState<string[]>(["Lower abdomen"]);
  const [duration, setDuration] = useState<number>(6);
  const [flow, setFlow] = useState<string>("medium");
  const [associated, setAssociated] = useState<string[]>(["Fatigue"]);
  const [medication, setMedication] = useState("");
  const [medEffectiveness, setMedEffectiveness] = useState<number>(5);
  const [impact, setImpact] = useState({ sleep: 3, work: 4, school: 3, daily: 4 });
  const [notes, setNotes] = useState("");

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            New entry
          </p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl font-semibold">
            Log today's symptoms
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Structured entries make your patterns easier to compare and share
            with a clinician.
          </p>
        </div>

        <DisclaimerBanner />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Symptom entry saved (prototype — stored locally).");
          }}
          className="space-y-6"
        >
          {/* Pain */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Pain</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-baseline justify-between">
                  <Label>Pain score</Label>
                  <span className="font-display text-2xl text-primary tabular-nums">
                    {pain} <span className="text-sm text-muted-foreground">/ 10</span>
                  </span>
                </div>
                <Slider
                  value={[pain]}
                  onValueChange={(v) => setPain(v[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="mt-3"
                />
                <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                  <span>None</span>
                  <span>Worst imaginable</span>
                </div>
              </div>

              <div>
                <Label>Pain location</Label>
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LOCATIONS.map((loc) => {
                    const active = locations.includes(loc);
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setLocations(toggle(locations, loc))}
                        className={`rounded-lg border px-3 py-2 text-sm text-left transition-colors ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:bg-muted"
                        }`}
                      >
                        {loc}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min={0}
                    max={48}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label>Menstrual flow</Label>
                  <Select value={flow} onValueChange={setFlow}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="spotting">Spotting</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Associated */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Associated symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ASSOCIATED.map((s) => {
                  const active = associated.includes(s);
                  return (
                    <label
                      key={s}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm cursor-pointer transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <Checkbox
                        checked={active}
                        onCheckedChange={() =>
                          setAssociated(toggle(associated, s))
                        }
                      />
                      {s}
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Medication */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Medication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="med">Medication taken</Label>
                <Input
                  id="med"
                  placeholder="e.g. Ibuprofen 400mg"
                  value={medication}
                  onChange={(e) => setMedication(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <Label>Effectiveness</Label>
                  <span className="font-display text-xl text-primary tabular-nums">
                    {medEffectiveness} / 10
                  </span>
                </div>
                <Slider
                  value={[medEffectiveness]}
                  onValueChange={(v) => setMedEffectiveness(v[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="mt-3"
                />
              </div>
            </CardContent>
          </Card>

          {/* Impact */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Impact on daily life</CardTitle>
              <p className="text-xs text-muted-foreground">
                0 = no impact, 10 = unable to function.
              </p>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {(["sleep", "work", "school", "daily"] as const).map((k) => (
                <div key={k}>
                  <div className="flex items-baseline justify-between">
                    <Label className="capitalize">{k === "daily" ? "Daily activities" : k}</Label>
                    <span className="text-sm text-primary tabular-nums">
                      {impact[k]} / 10
                    </span>
                  </div>
                  <Slider
                    value={[impact[k]]}
                    onValueChange={(v) =>
                      setImpact({ ...impact, [k]: v[0] })
                    }
                    min={0}
                    max={10}
                    step={1}
                    className="mt-3"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Anything else worth remembering — triggers, context, questions for your clinician."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button type="button" variant="outline">
              Save draft
            </Button>
            <Button type="submit">Save entry</Button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}