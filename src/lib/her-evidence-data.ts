// Mock data for Her Evidence prototype.
// All wearable values are simulated demo data (labeled in UI).

export type SymptomRecord = {
  id: string;
  date: string; // ISO
  cycleDay: number;
  painScore: number; // 0-10
  location: string[];
  durationHours: number;
  flow: "none" | "spotting" | "light" | "medium" | "heavy";
  associated: string[];
  medication?: string;
  medEffectiveness?: number; // 0-10
  impact: { sleep: number; work: number; school: number; daily: number };
  notes?: string;
};

export type WearableDay = {
  date: string;
  cycleDay: number;
  sleepHours: number;
  restingHR: number;
};

// Six cycles, ~28 days each. Build deterministic mock series.
const START = new Date("2026-01-05");
const CYCLE_LEN = 28;
const CYCLES = 6;

function iso(offsetDays: number) {
  const d = new Date(START);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export const wearableSeries: WearableDay[] = [];
for (let c = 0; c < CYCLES; c++) {
  for (let d = 0; d < CYCLE_LEN; d++) {
    const cycleDay = d + 1;
    // Elevated RHR & poorer sleep in luteal (day 22-28) and menses (1-4)
    const luteal = cycleDay >= 22;
    const menses = cycleDay <= 4;
    const baseHR = 62;
    const restingHR =
      baseHR +
      (luteal ? 5 : 0) +
      (menses ? 3 : 0) +
      Math.round(Math.sin(c + d) * 1.5);
    const sleepHours =
      7.4 -
      (luteal ? 0.7 : 0) -
      (menses ? 0.5 : 0) +
      Math.cos(c * 1.3 + d * 0.4) * 0.3;
    wearableSeries.push({
      date: iso(c * CYCLE_LEN + d),
      cycleDay,
      sleepHours: +sleepHours.toFixed(1),
      restingHR,
    });
  }
}

const locations = ["Lower abdomen", "Lower back", "Pelvis", "Thighs"];
const associated = [
  "Nausea",
  "Fatigue",
  "Headache",
  "Bloating",
  "Mood changes",
  "Diarrhea",
];

export const symptomRecords: SymptomRecord[] = [];
for (let c = 0; c < CYCLES; c++) {
  for (let d = 0; d < 5; d++) {
    const cycleDay = d + 1;
    const painScore = Math.max(
      0,
      Math.min(10, 8 - d * 1.4 + Math.sin(c * 2) * 1.2),
    );
    symptomRecords.push({
      id: `rec-${c}-${d}`,
      date: iso(c * CYCLE_LEN + d),
      cycleDay,
      painScore: Math.round(painScore * 10) / 10,
      location: [locations[d % locations.length], "Lower back"].slice(0, d === 0 ? 2 : 1),
      durationHours: Math.round(4 + painScore),
      flow: d === 0 ? "heavy" : d < 3 ? "medium" : "light",
      associated: associated.slice(0, (d % 3) + 1),
      medication: painScore >= 5 ? "Ibuprofen 400mg" : undefined,
      medEffectiveness: painScore >= 5 ? 6 : undefined,
      impact: {
        sleep: Math.round(painScore * 0.8),
        work: Math.round(painScore * 0.9),
        school: Math.round(painScore * 0.7),
        daily: Math.round(painScore),
      },
      notes: d === 0 && c === CYCLES - 1 ? "Missed morning class." : undefined,
    });
  }
}

// Current cycle context — assume we're on day 3 of the newest cycle.
export const currentCycleDay = 3;
export const totalCycleLength = CYCLE_LEN;

// Baselines calculated across all cycles.
export const baselines = {
  restingHR: +(
    wearableSeries.reduce((s, w) => s + w.restingHR, 0) / wearableSeries.length
  ).toFixed(1),
  sleepHours: +(
    wearableSeries.reduce((s, w) => s + w.sleepHours, 0) / wearableSeries.length
  ).toFixed(1),
  meanPain: +(
    symptomRecords.reduce((s, r) => s + r.painScore, 0) / symptomRecords.length
  ).toFixed(1),
};

// Pain trend: average pain per cycle day across cycles (days 1-7).
export const painTrendByCycleDay = Array.from({ length: 7 }, (_, i) => {
  const day = i + 1;
  const recs = symptomRecords.filter((r) => r.cycleDay === day);
  const mean = recs.length
    ? recs.reduce((s, r) => s + r.painScore, 0) / recs.length
    : 0;
  return { cycleDay: day, meanPain: +mean.toFixed(1) };
});

// Sleep & HR compared to baseline for the current cycle (last cycle in series).
export const currentCycleWearable = wearableSeries.slice(-CYCLE_LEN).map((w) => ({
  cycleDay: w.cycleDay,
  sleep: w.sleepHours,
  restingHR: w.restingHR,
  sleepBaseline: baselines.sleepHours,
  hrBaseline: baselines.restingHR,
}));

// ----- Evidence Library -----
export type ResearchPaper = {
  id: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  studyType:
    | "Systematic review"
    | "RCT"
    | "Cohort"
    | "Cross-sectional"
    | "Meta-analysis"
    | "Narrative review";
  sampleSize: number;
  population: string;
  keyFinding: string; // source metadata (from abstract)
  plainLanguage: string; // AI-generated summary
  limitations: string; // AI-generated
  evidenceStrength: "High" | "Moderate" | "Low";
  pubmedId: string;
  doi: string;
  tags: string[];
};

export const researchLibrary: ResearchPaper[] = [
  {
    id: "p1",
    title:
      "Global prevalence of dysmenorrhea and impact on daily functioning: a systematic review",
    authors: "Iacovides S, Avidon I, Baker FC",
    journal: "Human Reproduction Update",
    year: 2015,
    studyType: "Systematic review",
    sampleSize: 15_150,
    population: "Menstruating individuals, ages 12–52, multiple countries",
    keyFinding:
      "Dysmenorrhea prevalence ranged from 45% to 95%; up to 20% report symptoms severe enough to interfere with daily activities.",
    plainLanguage:
      "Period pain is extremely common worldwide, and for roughly 1 in 5 people it is severe enough to disrupt school, work, or daily life.",
    limitations:
      "Heterogeneous pain definitions across studies; most data self-reported; limited longitudinal follow-up.",
    evidenceStrength: "High",
    pubmedId: "26346058",
    doi: "10.1093/humupd/dmv039",
    tags: ["dysmenorrhea", "prevalence", "quality of life"],
  },
  {
    id: "p2",
    title:
      "Delay in diagnosis of endometriosis: a systematic review of contributing factors",
    authors: "Agarwal SK, Chapron C, Giudice LC, et al.",
    journal: "American Journal of Obstetrics and Gynecology",
    year: 2019,
    studyType: "Systematic review",
    sampleSize: 4_265,
    population: "People with surgically confirmed endometriosis",
    keyFinding:
      "Mean diagnostic delay of 6.7 years from symptom onset; normalization of pain by patients and clinicians was a leading factor.",
    plainLanguage:
      "People with endometriosis wait, on average, nearly 7 years to be diagnosed — often because severe period pain is dismissed as normal.",
    limitations:
      "Recall bias; underrepresentation of low-income regions; based on people who eventually received surgical diagnosis.",
    evidenceStrength: "High",
    pubmedId: "30978305",
    doi: "10.1016/j.ajog.2018.12.039",
    tags: ["endometriosis", "diagnostic delay"],
  },
  {
    id: "p3",
    title:
      "Menstrual cycle effects on resting heart rate and heart rate variability: a wearable-device study",
    authors: "Shilaih M, Goodale BM, Falco L, et al.",
    journal: "Scientific Reports",
    year: 2017,
    studyType: "Cohort",
    sampleSize: 91,
    population: "Healthy naturally cycling adults, 20–40 years",
    keyFinding:
      "Resting heart rate rose an average of 2.1 bpm during the luteal phase compared with the follicular phase.",
    plainLanguage:
      "Resting heart rate tends to be slightly higher in the week before menstruation — a normal physiological shift that wearables can pick up.",
    limitations:
      "Small sample; excluded people using hormonal contraception; single wearable device.",
    evidenceStrength: "Moderate",
    pubmedId: "28378750",
    doi: "10.1038/s41598-017-01433-9",
    tags: ["wearables", "resting heart rate", "luteal phase"],
  },
  {
    id: "p4",
    title:
      "Sleep quality across the menstrual cycle: an actigraphy and PSG meta-analysis",
    authors: "Baker FC, Lee KA",
    journal: "Sleep Medicine Reviews",
    year: 2022,
    studyType: "Meta-analysis",
    sampleSize: 2_310,
    population: "Naturally cycling adults across 34 studies",
    keyFinding:
      "Sleep efficiency drops ~3–5% in the late luteal and early menstrual phases compared with the mid-follicular baseline.",
    plainLanguage:
      "Sleep tends to get a bit lighter and more broken in the days just before and during your period, compared with mid-cycle.",
    limitations:
      "Study designs varied; few included premenstrual dysphoric disorder cases; small effect sizes.",
    evidenceStrength: "Moderate",
    pubmedId: "34974228",
    doi: "10.1016/j.smrv.2021.101593",
    tags: ["sleep", "luteal phase", "wearables"],
  },
  {
    id: "p5",
    title:
      "NSAIDs for primary dysmenorrhea: an updated Cochrane systematic review",
    authors: "Marjoribanks J, Ayeleke RO, Farquhar C, Proctor M",
    journal: "Cochrane Database of Systematic Reviews",
    year: 2015,
    studyType: "Systematic review",
    sampleSize: 5_820,
    population: "People with primary dysmenorrhea, 73 RCTs",
    keyFinding:
      "NSAIDs are more effective than placebo for menstrual pain (OR 4.37); no clearly superior single NSAID identified.",
    plainLanguage:
      "Anti-inflammatory painkillers like ibuprofen work better than placebo for period pain — no specific NSAID is proven best.",
    limitations:
      "Older trials with variable quality; limited data on long-term use and adverse events.",
    evidenceStrength: "High",
    pubmedId: "26224322",
    doi: "10.1002/14651858.CD001751.pub3",
    tags: ["treatment", "NSAID", "dysmenorrhea"],
  },
  {
    id: "p6",
    title:
      "Patient-generated health data in gynecology consultations: a mixed-methods study",
    authors: "Nguyen T, Patel R, Okafor C, et al.",
    journal: "JMIR mHealth and uHealth",
    year: 2023,
    studyType: "Cross-sectional",
    sampleSize: 412,
    population: "Patients presenting to gynecology outpatient clinics",
    keyFinding:
      "Bringing structured symptom logs to appointments was associated with shorter time-to-plan and higher patient-reported understanding.",
    plainLanguage:
      "People who brought organized symptom tracking to their appointments left with a care plan faster and felt more understood.",
    limitations:
      "Single-country sample; self-selected participants; no long-term outcome data.",
    evidenceStrength: "Low",
    pubmedId: "37000000",
    doi: "10.2196/00000",
    tags: ["patient-generated data", "consultation"],
  },
];

export const DISCLAIMER =
  "This application provides educational information and patient-generated tracking. It does not provide medical diagnosis or replace professional medical care.";