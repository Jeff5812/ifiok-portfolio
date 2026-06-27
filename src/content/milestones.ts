import type { Milestone } from "@/types/content";

// ---------------------------------------------------------------------------
// Append new entries at the top as they happen. This feed is designed to
// never run dry, bootcamp progress, shipped projects, certifications, and
// roles all live in the same chronological spine.
//
// Add a milestone for a project ONLY once it's actually finished (or at a
// real, confirmed stage), this timeline is a credibility signal, so it
// should only ever describe things that have genuinely happened.
//
// Currently empty on purpose, add real entries when ready.
// ---------------------------------------------------------------------------

export const milestones: Milestone[] = [];
