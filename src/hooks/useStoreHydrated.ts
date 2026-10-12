import { useEffect, useState } from "react";

import { useContactsStore } from "@/store/contactsStore";
import { useMapStore } from "@/store/mapStore";
import { useSettingsStore } from "@/store/settingsStore";

const stores = [useSettingsStore, useContactsStore, useMapStore];

/** true, sobald alle persistierten Stores aus AsyncStorage geladen sind. */
export const useStoreHydrated = (): boolean => {
  const check = () => stores.every((s) => s.persist.hasHydrated());
  const [ready, setReady] = useState(check);

  useEffect(() => {
    if (check()) {
      setReady(true);
      return;
    }
    const unsubs = stores.map((s) => s.persist.onFinishHydration(() => setReady(check())));
    return () => unsubs.forEach((u) => u());
  }, []);

  return ready;
};
