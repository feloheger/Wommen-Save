/**
 * Globale Typen für Women Save
 */
export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  isFavorite: boolean;
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export type SosStatus = "idle" | "countdown" | "sending" | "done";

export type JourneyStatus = "idle" | "active" | "checkin_pending" | "alert";

export interface DangerZone {
  id: string;
  latitude: number;
  longitude: number;
  createdAt: number;
}

export interface SafePlace {
  id: string;
  name: string;
  kind: "police" | "pharmacy" | "hospital";
  latitude: number;
  longitude: number;
}

export interface FakeCaller {
  id: string;
  name: string;
}
