/**
 * A model of the Meridian scheduling agent's database gate (ifiok-automation-demos,
 * meridian-scheduling-agent/schema.sql), evaluated in the order Postgres evaluates it for
 *
 *   INSERT INTO appointments (...) VALUES (...)
 *   ON CONFLICT (customer_id, start_time) DO NOTHING
 *   RETURNING *;
 *
 *   1. BEFORE INSERT trigger enforce_appointment_rules(): weekday, 09:00-17:00 WAT, 30-120 minutes.
 *   2. The arbiter, unique (customer_id, start_time): a conflict means DO NOTHING, zero rows, no error.
 *   3. The exclusion constraint: no two confirmed bookings may overlap. A violation is an error.
 *
 * Times are minutes since Monday 00:00 in Africa/Lagos (WAT, UTC+1, no daylight saving).
 */

export const DAY = 24 * 60;
export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export type Appointment = {
  id: number;
  customer: string;
  start: number;
  end: number;
  status: "confirmed" | "cancelled";
};

export type Request = { customer: string; start: number; end: number };

export type GateResult =
  | { kind: "inserted"; row: Appointment }
  | { kind: "no_rows" } // ON CONFLICT ... DO NOTHING fired
  | { kind: "error"; source: "trigger" | "exclusion"; message: string };

export type GateOptions = {
  /**
   * The fix proposed in the case study: make the retry key partial,
   *   CREATE UNIQUE INDEX ... ON appointments (customer_id, start_time) WHERE status = 'confirmed'
   * with the matching arbiter  ON CONFLICT (customer_id, start_time) WHERE status = 'confirmed'.
   * As built, the key covers cancelled rows too.
   */
  partialRetryKey: boolean;
};

const HOUR = 60;

export function triggerError(req: Request): string | null {
  const isoDow = Math.floor(req.start / DAY) + 1; // 1 = Monday
  if (isoDow > 5) return "Appointments are only available Monday to Friday";
  const startTime = req.start % DAY;
  const endTime = req.end % DAY;
  if (startTime < 9 * HOUR || endTime > 17 * HOUR) return "Appointments must fall between 9am and 5pm WAT";
  const minutes = req.end - req.start;
  if (minutes < 30 || minutes > 120) return "Appointment duration must be between 30 and 120 minutes";
  return null;
}

/** tstzrange defaults to [start, end): back-to-back bookings do not overlap. */
export const overlaps = (a: { start: number; end: number }, b: { start: number; end: number }) =>
  a.start < b.end && b.start < a.end;

export function recordAppointment(table: Appointment[], req: Request, options: GateOptions): GateResult {
  const trigger = triggerError(req);
  if (trigger) return { kind: "error", source: "trigger", message: trigger };

  const arbiterHit = table.some(
    (row) =>
      row.customer === req.customer &&
      row.start === req.start &&
      (!options.partialRetryKey || row.status === "confirmed"),
  );
  if (arbiterHit) return { kind: "no_rows" };

  const clash = table.find((row) => row.status === "confirmed" && overlaps(row, req));
  if (clash) {
    return {
      kind: "error",
      source: "exclusion",
      message: 'conflicting key value violates exclusion constraint "appointments_tstzrange_excl"',
    };
  }

  const id = table.reduce((max, row) => Math.max(max, row.id), 0) + 1;
  return { kind: "inserted", row: { id, ...req, status: "confirmed" } };
}

export const at = (day: number, hour: number, minute = 0) => day * DAY + hour * HOUR + minute;

export function formatSlot(start: number, end: number): string {
  const fmt = (m: number) => {
    const t = m % DAY;
    return `${String(Math.floor(t / HOUR)).padStart(2, "0")}:${String(t % HOUR).padStart(2, "0")}`;
  };
  return `${DAYS[Math.floor(start / DAY)]} ${fmt(start)}–${fmt(end)}`;
}
