/**
 * Standort-Service – nutzt Expo Location
 */
import * as Location from "expo-location";
import type { LocationPoint } from "@types/index";

export const requestLocationPermissions = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
};

export const requestBackgroundLocationPermissions = async (): Promise<boolean> => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  return status === "granted";
};

export const getCurrentLocation = async (): Promise<LocationPoint | null> => {
  const hasPermission = await requestLocationPermissions();
  if (!hasPermission) return null;

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    timestamp: position.timestamp,
  };
};

export const watchLocation = (
  callback: (point: LocationPoint) => void,
): Promise<Location.LocationSubscription> => {
  return Location.watchPositionAsync(
    { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        timestamp: position.timestamp,
      });
    },
  );
};

export const buildGoogleMapsLink = (point: LocationPoint): string =>
  `https://maps.google.com/?q=${point.latitude},${point.longitude}`;
