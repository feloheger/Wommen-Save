/**
 * Standort-Service (expo-location) – mit Timeout und Fallback auf letzte bekannte Position,
 * damit ein Notruf nie an einer hängenden GPS-Abfrage scheitert.
 */
import * as Location from "expo-location";

import type { LocationPoint } from "@/types";

const toPoint = (pos: Location.LocationObject): LocationPoint => ({
  latitude: pos.coords.latitude,
  longitude: pos.coords.longitude,
  timestamp: pos.timestamp,
});

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T | null> =>
  new Promise((resolve) => {
    const t = setTimeout(() => resolve(null), ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      () => {
        clearTimeout(t);
        resolve(null);
      },
    );
  });

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === "granted";
  } catch {
    return false;
  }
};

export const getCurrentLocation = async (timeoutMs = 8000): Promise<LocationPoint | null> => {
  if (!(await requestLocationPermission())) return null;

  const fresh = await withTimeout(
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
    timeoutMs,
  );
  if (fresh) return toPoint(fresh);

  const lastKnown = await Location.getLastKnownPositionAsync().catch(() => null);
  return lastKnown ? toPoint(lastKnown) : null;
};

export const watchLocation = (
  onPoint: (point: LocationPoint) => void,
): Promise<Location.LocationSubscription> =>
  Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
    (pos) => onPoint(toPoint(pos)),
  );

export const geocode = async (
  query: string,
): Promise<{ latitude: number; longitude: number } | null> => {
  try {
    const [first] = await Location.geocodeAsync(query);
    return first ? { latitude: first.latitude, longitude: first.longitude } : null;
  } catch {
    return null;
  }
};

export const buildMapsLink = (p: Pick<LocationPoint, "latitude" | "longitude">): string =>
  `https://maps.google.com/?q=${p.latitude},${p.longitude}`;
