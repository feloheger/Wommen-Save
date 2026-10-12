/**
 * Sichere Orte (Polizei, Apotheke, Krankenhaus) über OpenStreetMap / Overpass.
 */
import type { SafePlace } from "@/types";

const ENDPOINT = "https://overpass-api.de/api/interpreter";

interface OverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

export const fetchSafePlaces = async (
  latitude: number,
  longitude: number,
  radiusMeters = 1500,
  signal?: AbortSignal,
): Promise<SafePlace[]> => {
  const query = `[out:json][timeout:10];(nwr["amenity"~"^(police|pharmacy|hospital)$"](around:${radiusMeters},${latitude},${longitude}););out center 40;`;
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `data=${encodeURIComponent(query)}`,
      signal,
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { elements?: OverpassElement[] };
    return (json.elements ?? []).flatMap((el): SafePlace[] => {
      const lat = el.lat ?? el.center?.lat;
      const lon = el.lon ?? el.center?.lon;
      const kind = el.tags?.amenity as SafePlace["kind"] | undefined;
      if (lat == null || lon == null || !kind) return [];
      return [
        {
          id: String(el.id),
          name: el.tags?.name ?? kindLabel(kind),
          kind,
          latitude: lat,
          longitude: lon,
        },
      ];
    });
  } catch {
    return [];
  }
};

export const kindLabel = (kind: SafePlace["kind"]): string =>
  ({ police: "Polizei", pharmacy: "Apotheke", hospital: "Krankenhaus" })[kind];
