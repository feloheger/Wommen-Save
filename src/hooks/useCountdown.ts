import { useEffect, useState } from "react";

/** Verbleibende Sekunden bis zu einem Zeitpunkt (aktualisiert jede Sekunde). */
export const useSecondsUntil = (target: number | null): number => {
  const calc = () => (target ? Math.max(0, Math.ceil((target - Date.now()) / 1000)) : 0);
  const [value, setValue] = useState(calc);

  useEffect(() => {
    setValue(calc());
    if (!target) return;
    const id = setInterval(() => setValue(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return value;
};
