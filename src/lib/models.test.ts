// Behaviour of the ported decision logic behind the case-study demos. Each expectation comes from
// the source system (workflow nodes, schema.sql, jobs.py, multipart-session.ts), not from the demo.
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { at, recordAppointment, triggerError, type Appointment } from "./booking.ts";
import { decide, guardReading } from "./collections.ts";
import { run } from "./ladder.ts";
import { LEASE_SECONDS, claim, complete, newJob } from "./lease.ts";
import { MAX_VIDEO_BYTES, partCount, remainingParts, retryable } from "./upload.ts";

describe("collections router", () => {
  const reading = (risk_tier: string, sentiment_score: number, confidence: number) => ({
    risk_tier, sentiment_score, confidence, rationale: "r",
  });

  it("routes confident readings by tier", () => {
    assert.equal(decide(reading("low", 0.2, 0.9)).route, "sms_reminder");
    assert.equal(decide(reading("medium", 0, 0.9)).route, "whatsapp_restructuring");
    assert.equal(decide(reading("high", -0.8, 0.9)).route, "legal_referral");
  });

  it("sends anything under the 0.6 gate to a person, whatever the tier", () => {
    assert.equal(decide(reading("high", -0.9, 0.59)).route, "human_review");
    assert.equal(decide(reading("low", 0.5, 0.6)).route, "sms_reminder"); // >= is inclusive
  });

  it("escalates a negative-sentiment medium to high in code", () => {
    const d = decide(reading("medium", -0.31, 0.8));
    assert.equal(d.reading.risk_tier, "high");
    assert.equal(d.route, "legal_referral");
    assert.equal(decide(reading("medium", -0.3, 0.8)).route, "whatsapp_restructuring"); // strict <
  });

  it("turns an out-of-vocabulary tier into review with zero confidence", () => {
    const g = guardReading(reading("critical", 0, 0.99));
    assert.equal(g.reading.risk_tier, "review");
    assert.equal(g.reading.confidence, 0);
    assert.equal(decide(reading("critical", 0, 0.99)).route, "human_review");
  });
});

describe("meridian booking gate", () => {
  const ada: Appointment = { id: 1, customer: "ada", start: at(1, 10), end: at(1, 11), status: "confirmed" };
  const asBuilt = { partialRetryKey: false };

  it("enforces weekday, hours and duration in the trigger, before any constraint", () => {
    assert.match(triggerError({ customer: "c", start: at(5, 10), end: at(5, 11) })!, /Monday to Friday/);
    assert.match(triggerError({ customer: "c", start: at(2, 16, 30), end: at(2, 17, 30) })!, /9am and 5pm/);
    assert.match(triggerError({ customer: "c", start: at(2, 9), end: at(2, 9, 15) })!, /30 and 120/);
    assert.equal(triggerError({ customer: "c", start: at(2, 16), end: at(2, 17) }), null); // ending at 17:00 is fine
  });

  it("rejects a different customer's overlapping booking with an error", () => {
    const r = recordAppointment([ada], { customer: "bayo", start: at(1, 10, 30), end: at(1, 11, 30) }, asBuilt);
    assert.equal(r.kind, "error");
    assert.equal(r.kind === "error" && r.source, "exclusion");
  });

  it("allows back-to-back bookings ([start, end) ranges)", () => {
    const r = recordAppointment([ada], { customer: "bayo", start: at(1, 11), end: at(1, 12) }, asBuilt);
    assert.equal(r.kind, "inserted");
  });

  it("treats the same customer's retry as zero rows, not a conflict", () => {
    const r = recordAppointment([ada], { customer: "ada", start: at(1, 10), end: at(1, 11) }, asBuilt);
    assert.equal(r.kind, "no_rows");
  });

  it("as built, a cancelled row still holds its retry key; the partial key fixes it", () => {
    const cancelled = { ...ada, status: "cancelled" as const };
    const again = { customer: "ada", start: at(1, 10), end: at(1, 11) };
    assert.equal(recordAppointment([cancelled], again, asBuilt).kind, "no_rows");
    assert.equal(recordAppointment([cancelled], again, { partialRetryKey: true }).kind, "inserted");
  });
});

describe("chat receipt job lease", () => {
  it("fences a worker whose lease expired", () => {
    let job = newJob();
    ({ job } = claim(job, "A", "t1", 0));
    assert.equal(job.lockedBy, "A");
    assert.equal(claim(job, "B", "t2", LEASE_SECONDS - 1).claimed, false); // still leased

    const taken = claim(job, "B", "t2", LEASE_SECONDS + 5); // A stalled past its lease
    assert.ok(taken.claimed);
    job = taken.job;
    assert.equal(job.attempts, 2);

    const byB = complete(job, "t2", "result from B");
    assert.equal(byB.rowsUpdated, 1);
    const late = complete(byB.job, "t1", "result from A");
    assert.equal(late.rowsUpdated, 0);
    assert.equal(late.job.result, "result from B");
  });
});

describe("lab follow-up ladder", () => {
  it("as built, sends every intermediate reminder even after confirmation", () => {
    const out = run("critical", 1, "as-built");
    assert.deepEqual(out.map((s) => s.sent), [true, true, true, true, false, false]);
  });

  it("re-checking stops later reminders once confirmed", () => {
    const out = run("critical", 1, "recheck");
    assert.deepEqual(out.map((s) => s.sent), [true, true, false, false, false, false]);
  });

  it("escalates to the CHEW when nobody confirms", () => {
    const out = run("routine", null, "as-built");
    assert.ok(out.every((s) => s.sent));
    assert.equal(out.at(-1)!.to, "CHEW");
    assert.equal(out.at(-1)!.at, 48);
  });
});

describe("mayor edits uploads", () => {
  it("splits the largest allowed film into 63 parts of 8 MiB", () => {
    assert.equal(partCount(MAX_VIDEO_BYTES), 63);
  });

  it("resumes with only the missing parts", () => {
    assert.deepEqual(remainingParts(6, new Set([1, 2, 4])), [3, 5, 6]);
  });

  it("retries network failures, 408, 429 and 5xx, never aborts or other 4xx", () => {
    assert.ok(retryable(null) && retryable(408) && retryable(429) && retryable(503));
    assert.ok(!retryable(403) && !retryable(null, true));
  });
});
