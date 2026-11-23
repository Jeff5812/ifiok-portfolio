/**
 * Numbers from Mayor Edits' resumable uploads (mayor-edits, src/lib/media/parts.ts and
 * multipart-session.ts), plus the one rule that makes resuming cheap: only parts R2 doesn't
 * already hold are sent again.
 */

export const MIB = 1024 * 1024;
export const UPLOAD_PART_BYTES = 8 * MIB; // R2: every part but the last the same size, at least 5 MiB
export const PARALLEL_PARTS = 3;
export const RETRY_DELAYS_MS = [1000, 3000, 5000, 10000, 20000, 30000];
export const STALL_MS = 60_000; // a part with no progress for a minute counts as dropped
export const MAX_VIDEO_BYTES = 500 * MIB;

export const partCount = (fileSize: number) => Math.ceil(fileSize / UPLOAD_PART_BYTES);

/** Parts still to send after a pause: everything R2 hasn't confirmed, in order. */
export function remainingParts(total: number, stored: ReadonlySet<number>): number[] {
  const out: number[] = [];
  for (let n = 1; n <= total; n++) if (!stored.has(n)) out.push(n);
  return out;
}

/** Retryable like the real session: no response at all, 408, 429 or any 5xx. Aborts never retry. */
export const retryable = (status: number | null, aborted = false) =>
  !aborted && (status === null || status === 408 || status === 429 || status >= 500);
