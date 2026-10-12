/**
 * Hilfsfunktionen zur Formatierung
 */

/** Sekunden -> "m:ss" */
export const formatClock = (totalSeconds: number): string => {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getInitial = (name: string): string => {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
};

/** Entfernt Leerzeichen/Klammern/Bindestriche – behält führendes "+" */
export const normalizePhone = (value: string): string =>
  value.replace(/[^\d+]/g, "").replace(/(?!^)\+/g, "");

export const makeId = (): string =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
