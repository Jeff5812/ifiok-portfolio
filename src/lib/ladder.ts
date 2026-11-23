/**
 * The reminder ladders of the lab-results follow-up workflow (n8n), read from its node graph.
 *
 * As built, the intermediate reminders are sent unconditionally: each Wait node fans out to the
 * email and a No-Op, and a Merge (chooseBranch) joins them. Only the final step checks Postgres for
 * a confirmation before escalating. "recheck" models the intended behaviour, where a confirmation
 * stops every later message.
 */

export type Track = "critical" | "routine";
export type Mode = "as-built" | "recheck";

export type Step = {
  at: number; // hours after the result is registered
  label: string;
  to: "Patient" | "Clinician" | "CHEW";
  /** Only sent when the patient hasn't confirmed by this point (the final check). */
  finalCheck: boolean;
};

export const LADDERS: Record<Track, Step[]> = {
  critical: [
    { at: 0, label: "Critical result alert", to: "Patient", finalCheck: false },
    { at: 0, label: "Critical result alert", to: "Clinician", finalCheck: false },
    { at: 2, label: "Reminder", to: "Patient", finalCheck: false },
    { at: 6, label: "Reminder", to: "Patient", finalCheck: false },
    { at: 24, label: "Final notice", to: "Patient", finalCheck: true },
    { at: 24, label: "Escalation: follow up in person", to: "CHEW", finalCheck: true },
  ],
  routine: [
    { at: 0, label: "Results are ready", to: "Patient", finalCheck: false },
    { at: 6, label: "Reminder", to: "Patient", finalCheck: false },
    { at: 24, label: "Reminder", to: "Patient", finalCheck: false },
    { at: 48, label: "Final reminder", to: "Patient", finalCheck: true },
    { at: 48, label: "Escalation (non-critical)", to: "CHEW", finalCheck: true },
  ],
};

export type Outcome = Step & { sent: boolean; why: string };

/** confirmedAt: hours after registration when the patient confirmed pickup, or null for never. */
export function run(track: Track, confirmedAt: number | null, mode: Mode): Outcome[] {
  const confirmedBy = (h: number) => confirmedAt !== null && confirmedAt <= h;
  return LADDERS[track].map((step) => {
    if (step.at === 0) return { ...step, sent: true, why: "Sent when the result is registered" };
    if (step.finalCheck) {
      return confirmedBy(step.at)
        ? { ...step, sent: false, why: "Final check found the confirmation in Postgres" }
        : { ...step, sent: true, why: "Final check: still unconfirmed" };
    }
    if (mode === "recheck" && confirmedBy(step.at)) {
      return { ...step, sent: false, why: "Re-check before sending found the confirmation" };
    }
    return {
      ...step,
      sent: true,
      why: confirmedBy(step.at) ? "Sent anyway: no check before this reminder" : "Not confirmed yet",
    };
  });
}
