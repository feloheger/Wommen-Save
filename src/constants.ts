export const APP_NAME = "Women Save";

export const SOS_COUNTDOWN_SEC = 5;
export const JOURNEY_GRACE_SEC = 60;
export const JOURNEY_DURATIONS_MIN = [5, 10, 15, 30, 45] as const;

/** Laut Mockup: in Kostenlos und Premium jeweils bis zu 15 Vertrauenspersonen. */
export const MAX_CONTACTS = 15;

export const FAKE_CALL_DELAYS = [
  { label: "10 Sek.", seconds: 10 },
  { label: "30 Sek.", seconds: 30 },
  { label: "1 Min.", seconds: 60 },
  { label: "5 Min.", seconds: 300 },
] as const;

export const SUPPORT_EMAIL = "support@womensave.app";
export const PRIVACY_URL = "https://womensave.app/privacy";
export const TERMS_URL = "https://womensave.app/terms";

export const PREMIUM_PRICE_ONCE = "4,99 €";
export const PREMIUM_PRICE_MONTHLY = "0,99 €";
