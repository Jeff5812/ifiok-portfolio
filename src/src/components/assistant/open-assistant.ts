"use client";

export const OPEN_ASSISTANT_EVENT = "columba:assistant:open";

export type OpenAssistantDetail = { prompt?: string };

/**
 * Opens the floating assistant. Pass a prompt to have it sent immediately
 * (e.g. clicking a specific quick-action), or omit it to just open the panel.
 */
export function openAssistant(prompt?: string) {
  window.dispatchEvent(
    new CustomEvent<OpenAssistantDetail>(OPEN_ASSISTANT_EVENT, { detail: { prompt } }),
  );
}

