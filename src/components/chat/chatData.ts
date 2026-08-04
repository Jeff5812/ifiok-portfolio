export type LabField = {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "textarea" | "date";
  options?: string[];
  optional?: boolean;
};

// Mirrors "Lab Result Registration Form", the n8n formTrigger node fields ,
// so a visitor can experience the exact same intake the real clinic workflow uses.
export const LAB_FIELDS: LabField[] = [
  { key: "patientName", label: "Patient full name", type: "text" },
  { key: "patientEmail", label: "Patient email address", type: "email" },
  { key: "patientPhone", label: "Patient phone number", type: "tel" },
  { key: "chwEmail", label: "Community health worker email", type: "email" },
  { key: "clinicianEmail", label: "Requesting clinician email", type: "email" },
  {
    key: "testType",
    label: "Test type",
    type: "select",
    options: [
      "Malaria Rapid Diagnostic Test (RDT)",
      "Tuberculosis (TB) Screening",
      "HIV Test",
      "Hepatitis B Surface Antigen",
      "Hepatitis C Antibody",
      "Full Blood Count (FBC)",
      "Blood Glucose (Fasting)",
      "Blood Glucose (Random)",
      "HbA1c (Diabetes Monitoring)",
      "Lipid Profile",
      "Liver Function Test (LFT)",
      "Kidney Function Test (KFT)",
      "Urine Microscopy, Culture & Sensitivity",
      "Stool Microscopy",
      "Genotype (AS, AA, SS)",
      "Blood Group & Rhesus Factor",
      "Widal Test (Typhoid)",
      "Pregnancy Test (hCG)",
      "Antenatal Booking Panel",
      "COVID-19 Rapid Antigen Test",
      "Sputum Culture",
      "Thyroid Function Test (TFT)",
      "Electrolytes, Urea & Creatinine (E/U/Cr)",
      "Other",
    ],
  },
  {
    key: "resultFlag",
    label: "Result flag",
    type: "select",
    options: ["routine", "critical"],
  },
  { key: "resultSummary", label: "Result summary", type: "textarea" },
  { key: "clinicId", label: "Clinic ID", type: "text" },
  { key: "recordedAt", label: "Date result was recorded", type: "date" },
  { key: "requestingClinician", label: "Requesting clinician name", type: "text" },
  { key: "labTechnician", label: "Lab technician name", type: "text" },
  { key: "notes", label: "Additional notes", type: "textarea", optional: true },
];

export type LendingField = {
  key: string;
  label: string;
  type: "text" | "number" | "select" | "textarea";
  options?: string[];
};

// Mirrors the inputs the "Risk & Sentiment Agent" node actually reasons over
// in the real Micro-Lending Collection workflow.
export const LENDING_FIELDS: LendingField[] = [
  { key: "customerName", label: "Customer name (can be a placeholder)", type: "text" },
  { key: "daysPastDue", label: "Days past due", type: "number" },
  { key: "principalBalance", label: "Outstanding principal balance (₦)", type: "number" },
  {
    key: "tone",
    label: "How has the customer been responding to messages?",
    type: "select",
    options: [
      "Engaging positively, just needs time",
      "Responsive but struggling",
      "Not responding at all",
      "Hostile / refusing to pay",
    ],
  },
];

const TONE_SENTIMENT: Record<string, number> = {
  "Engaging positively, just needs time": 0.7,
  "Responsive but struggling": 0.1,
  "Not responding at all": -0.4,
  "Hostile / refusing to pay": -0.8,
};

export function buildLendingOutcome(data: Record<string, string>) {
  const daysPastDue = Number(data.daysPastDue) || 0;
  const sentiment = TONE_SENTIMENT[data.tone] ?? 0;

  let riskTier: "low" | "medium" | "high";
  if (daysPastDue > 60 || sentiment <= -0.4) riskTier = "high";
  else if (daysPastDue > 20 || sentiment < 0.3) riskTier = "medium";
  else riskTier = "low";

  // Same override the real "Parse AI Output" node applies.
  if (riskTier === "medium" && sentiment < -0.3) riskTier = "high";

  const confidence = Math.abs(sentiment) > 0.5 || daysPastDue > 45 ? 0.82 : 0.51;

  const action =
    confidence < 0.6
      ? "Routed to human review, the AI wasn't confident enough to auto-action this one."
      : riskTier === "low"
      ? "SMS reminder sent with a self-service payment link."
      : riskTier === "medium"
      ? "WhatsApp restructuring offer sent with a self-service payment link."
      : "Legal referral packet compiled and emailed for collections/legal review.";

  return { riskTier, sentiment, confidence, action };
}

export function buildSimulatedOutcome(data: Record<string, string>) {
  const isCritical = (data.resultFlag || "").toLowerCase() === "critical";
  const ref =
    "LR-" +
    new Date().toISOString().slice(0, 10).replace(/-/g, "") +
    "-" +
    Math.random().toString(16).slice(2, 8).toUpperCase();

  const cadence = isCritical
    ? ["Patient + clinician notified immediately", "Reminder at 2h", "Reminder at 6h", "Escalate to CHW at 24h if unconfirmed"]
    : ["Patient notified", "Reminder at 6h", "Reminder at 24h", "Escalate to CHW at 48h if unconfirmed"];

  return { ref, isCritical, cadence };
}
