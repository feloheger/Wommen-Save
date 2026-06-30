/**
 * Globale TypeScript-Typdefinitionen für Women Save
 */

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  phone?: string;
  isPremium: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
  isFavorite: boolean;
  avatarColor: string;
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export type SosStatus = "idle" | "triggered" | "sent" | "resolved";

export interface SosEvent {
  id: string;
  userId: string;
  status: SosStatus;
  location: LocationPoint | null;
  message: string;
  notifiedContacts: string[];
  createdAt: string;
}

export type SafeWalkStatus = "idle" | "active" | "checkin_pending" | "completed" | "alert";

export interface SafeWalkSession {
  id: string;
  destination: string;
  startedAt: number;
  durationMin: number;
  status: SafeWalkStatus;
  route: LocationPoint[];
}

export interface FakeCallProfile {
  id: string;
  name: string;
  isCustom: boolean;
}

export type RootStackParamList = {
  "(auth)": undefined;
  "(tabs)": undefined;
};
