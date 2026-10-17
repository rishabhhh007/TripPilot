import { ALTERNATIVES } from "../data/demoAlternatives.js";
import { allStops } from "./itinerary.js";
import { distanceKm } from "./geo.js";

// Find sample alternatives of one category that are close to the given reference stops.
// Later this will call the backend, which calls a real Places API.
export function findAlternatives(itinerary, category, referenceStops, maxKm = 40) {
  const takenNames = new Set(allStops(itinerary).map((s) => s.name));

  return ALTERNATIVES
    .filter((a) => a.category === category && !takenNames.has(a.name))
    .map((a) => ({
      ...a,
      nearestKm: Math.min(...referenceStops.map((s) => distanceKm(s, a))),
    }))
    .filter((a) => a.nearestKm <= maxKm)
    .sort((a, b) => a.nearestKm - b.nearestKm);
}
