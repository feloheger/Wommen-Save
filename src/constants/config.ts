/**
 * Globale App-Konfiguration & Konstanten
 */
export const APP_NAME = "Women Save";

export const SAFE_WALK_DEFAULT_DURATION_MIN = 15;
export const SAFE_WALK_CHECK_IN_GRACE_PERIOD_SEC = 30;

export const FAKE_CALL_TIMERS = [
  { label: "10 Sekunden", seconds: 10 },
  { label: "30 Sekunden", seconds: 30 },
  { label: "1 Minute", seconds: 60 },
  { label: "5 Minuten", seconds: 300 },
] as const;

export const FREE_CONTACTS_LIMIT = 3;

export const PREMIUM_FEATURES = [
  "Unbegrenzte Vertrauenspersonen",
  "Safe Walk+ mit automatischer Gefahrenzonen-Erkennung",
  "Familiengruppe mit Live-Standort",
  "Cloud Backup deiner Daten",
  "Exklusive Premium Themes",
  "Prioritäts-Support",
] as const;

export const SUPPORT_EMAIL = "support@womensave.app";
export const PRIVACY_URL = "https://womensave.app/privacy";
export const TERMS_URL = "https://womensave.app/terms";
