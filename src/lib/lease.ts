/**
 * A model of Chat Receipt's job leases (chatreceipt, backend/app/engine/jobs.py).
 *
 *   claim():    UPDATE ... SET status='running', attempts+1, lease_token=gen_random_uuid(),
 *               lease_expires_at = now() + lease ... WHERE id = (SELECT ... WHERE due
 *               OR (status='running' AND lease_expires_at < now()) ... FOR UPDATE SKIP LOCKED)
 *   complete(): UPDATE ... SET status='completed', result=... WHERE id=... AND lease_token=... AND
 *               status='running'   -- zero rows means the lease was lost: raise, roll back, discard.
 */

export type JobStatus = "queued" | "running" | "completed";

export type Job = {
  status: JobStatus;
  attempts: number;
  leaseToken: string | null;
  leaseExpiresAt: number | null; // seconds on the demo clock
  lockedBy: string | null;
  result: string | null;
};

export const LEASE_SECONDS = 180; // engine_lease_seconds in app/config.py

export const newJob = (): Job => ({
  status: "queued",
  attempts: 0,
  leaseToken: null,
  leaseExpiresAt: null,
  lockedBy: null,
  result: null,
});

export function claimable(job: Job, now: number): boolean {
  if (job.status === "queued") return true;
  return job.status === "running" && job.leaseExpiresAt !== null && job.leaseExpiresAt < now;
}

export function claim(job: Job, worker: string, token: string, now: number): { job: Job; claimed: boolean } {
  if (!claimable(job, now)) return { job, claimed: false };
  return {
    claimed: true,
    job: {
      ...job,
      status: "running",
      attempts: job.attempts + 1,
      leaseToken: token,
      leaseExpiresAt: now + LEASE_SECONDS,
      lockedBy: worker,
    },
  };
}

/** Completion is fenced by the token: only the current lease holder's write lands. */
export function complete(job: Job, token: string, result: string): { job: Job; rowsUpdated: 0 | 1 } {
  if (job.status !== "running" || job.leaseToken !== token) return { job, rowsUpdated: 0 };
  return {
    rowsUpdated: 1,
    job: { ...job, status: "completed", result, leaseToken: null, leaseExpiresAt: null },
  };
}
