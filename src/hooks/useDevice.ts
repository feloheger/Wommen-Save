/**
 * Hook für Geräte-Identität (ersetzt useAuth.ts)
 * Kein Login, kein Profil – nur Device-ID + Push-Token.
 */
import { useEffect } from "react";

import { registerDevice } from "@device/deviceService";
import { useDeviceStore } from "@store/deviceStore";

// Optional: eigener Backend-Endpoint zur Geräte-Registrierung.
// Leer lassen (undefined), falls (noch) kein Backend vorhanden ist.
const DEVICE_REGISTER_ENDPOINT: string | undefined = undefined;

export const useDevice = () => {
  const { deviceId, expoPushToken, isLoading, setDeviceId, setExpoPushToken, setLoading } =
    useDeviceStore();

  useEffect(() => {
    let isMounted = true;

    (async () => {
      setLoading(true);
      try {
        const identity = await registerDevice(DEVICE_REGISTER_ENDPOINT);
        if (!isMounted) return;
        setDeviceId(identity.deviceId);
        setExpoPushToken(identity.expoPushToken);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [setDeviceId, setExpoPushToken, setLoading]);

  return { deviceId, expoPushToken, isLoading, isReady: !!deviceId && !isLoading };
};
