/**
 * Geräte-Service
 * Ersetzt authService.ts (Firebase) – kein Login/Registrierung mehr nötig.
 *
 * Statt E-Mail/Passwort wird das Gerät einmalig "registriert" und die
 * Identität (deviceId + expoPushToken) optional an ein eigenes Backend
 * gemeldet (z. B. um Familiengruppen oder Premium-Status zu verknüpfen).
 */
import { getDeviceIdentity } from "./deviceConfig";

export interface DeviceIdentity {
  deviceId: string;
  expoPushToken: string | null;
}

/**
 * Initialisiert das Gerät: erzeugt/liest die Device-ID und holt das
 * Expo Push Token. Optional kann ein Backend-Endpoint angegeben werden,
 * an den die Identität gesendet wird (z. B. zur Registrierung).
 */
export const registerDevice = async (
  registerEndpoint?: string
): Promise<DeviceIdentity> => {
  const identity = await getDeviceIdentity();

  if (registerEndpoint) {
    try {
      await fetch(registerEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(identity),
      });
    } catch (error) {
      console.warn("FlowOS: Geräte-Registrierung beim Backend fehlgeschlagen:", error);
    }
  }

  return identity;
};

/**
 * "Abmelden" bedeutet hier lediglich, dass die lokale Sitzung im
 * Auth-Store zurückgesetzt wird. Die Device-ID selbst bleibt bestehen,
 * da sie an das physische Gerät gebunden ist.
 */
export const clearLocalSession = async (): Promise<void> => {
  // Bewusst leer – Device-ID bleibt in SecureStore erhalten.
  // Falls gewünscht, hier z. B. zwischengespeicherte Nutzerpräferenzen löschen.
};
