/**
 * The decision path of the micro-lending collections workflow (n8n), ported from its nodes:
 * "Parse AI Output" (a Code node), "Confidence Check" (If) and "Route by Risk Tier" (Switch).
 *
 * The model reads an account and proposes a risk tier, a sentiment score and its confidence.
 * Code then guards the answer, applies one deterministic override, and only a confident answer
 * is allowed to pick a channel. Everything else goes to a person.
 */

export const CONFIDENCE_GATE = 0.6; // Confidence Check: confidence >= 0.6
export const SENTIMENT_OVERRIDE = -0.3; // medium + sentiment below this becomes high
const VALID_TIERS = ["low", "medium", "high"] as const;

export type ModelReading = {
  risk_tier: string;
  sentiment_score: number;
  confidence: number;
  rationale: string;
};

export type Route = "sms_reminder" | "whatsapp_restructuring" | "legal_referral" | "human_review";

export type Decision = {
  reading: ModelReading; // after the code guards
  notes: string[]; // what the code changed, in order
  gatePassed: boolean;
  route: Route;
};

/** "Parse AI Output": reject tiers outside the vocabulary; escalate negative-sentiment mediums. */
export function guardReading(input: ModelReading): { reading: ModelReading; notes: string[] } {
  const reading = { ...input };
  const notes: string[] = [];
  if (!(VALID_TIERS as readonly string[]).includes(reading.risk_tier)) {
    reading.risk_tier = "review";
    reading.confidence = 0;
    reading.rationale = `${reading.rationale || ""} [invalid risk_tier defaulted to review]`;
    notes.push("Tier outside low / medium / high: set to review, confidence forced to 0");
  }
  if (reading.risk_tier === "medium" && reading.sentiment_score < SENTIMENT_OVERRIDE) {
    reading.risk_tier = "high";
    reading.rationale += " [escalated to high: negative sentiment override]";
    notes.push(`Medium with sentiment below ${SENTIMENT_OVERRIDE}: escalated to high`);
  }
  return { reading, notes };
}

/** The whole path: guard, confidence gate, then the switch (its fallback output is human review). */
export function decide(input: ModelReading): Decision {
  const { reading, notes } = guardReading(input);
  const gatePassed = Number.isFinite(reading.confidence) && reading.confidence >= CONFIDENCE_GATE;
  if (!gatePassed) return { reading, notes, gatePassed, route: "human_review" };
  const route: Route =
    reading.risk_tier === "low"
      ? "sms_reminder"
      : reading.risk_tier === "medium"
        ? "whatsapp_restructuring"
        : reading.risk_tier === "high"
          ? "legal_referral"
          : "human_review";
  return { reading, notes, gatePassed, route };
}

export const ROUTE_LABEL: Record<Route, { title: string; channel: string; detail: string }> = {
  sms_reminder: {
    title: "SMS reminder",
    channel: "Twilio",
    detail: "A reminder with a link to a hosted payment page.",
  },
  whatsapp_restructuring: {
    title: "Restructuring offer",
    channel: "WhatsApp",
    detail: "An offer of a flexible repayment plan, with the same payment link.",
  },
  legal_referral: {
    title: "Legal referral",
    channel: "Email to the legal team",
    detail: "A compiled package: balance, days past due, last payment and the model's rationale.",
  },
  human_review: {
    title: "Human review",
    channel: "Review queue",
    detail: "Nothing is sent. The account is logged as pending review for a person to decide.",
  },
};
