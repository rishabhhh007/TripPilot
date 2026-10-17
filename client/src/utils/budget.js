import { allStops, routeKm } from "./itinerary.js";
import { findAlternatives } from "./alternatives.js";

// Every number below is an ASSUMPTION, not a guaranteed price. They are shown to the user.
export const ASSUMPTIONS = {
  mileageKmPerLitre: 15,
  fuelPricePerLitre: 100, // ₹
  tollPerKm: 1.5, // ₹ per km, rough average
};

const FOOD = ["breakfast", "lunch", "dinner"];

export function calculateBudget(itinerary) {
  const stops = allStops(itinerary);
  const sum = (categories) =>
    stops
      .filter((s) => categories.includes(s.category))
      .reduce((total, s) => total + s.estimatedCost, 0);

  // If a return date is set, we assume the same distance again for the way back.
  const tripMultiplier = itinerary.returnDate ? 2 : 1;
  const distanceKm = routeKm(itinerary) * tripMultiplier;

  const fuel = (distanceKm / ASSUMPTIONS.mileageKmPerLitre) * ASSUMPTIONS.fuelPricePerLitre;
  const tolls = distanceKm * ASSUMPTIONS.tollPerKm;

  const categories = [
    { key: "stay", label: "Accommodation", amount: sum(["hotel"]) },
    { key: "food", label: "Food", amount: sum(FOOD) },
    { key: "fuel", label: "Fuel", amount: fuel },
    { key: "tolls", label: "Tolls", amount: tolls },
    { key: "activities", label: "Activities", amount: sum(["attraction"]) },
    { key: "other", label: "Rest & fuel stops", amount: sum(["rest", "fuel"]) },
  ];

  const total = categories.reduce((t, c) => t + c.amount, 0);

  return {
    categories,
    total,
    perPerson: total / Math.max(1, itinerary.travelers),
    distanceKm,
    overBy: Math.max(0, total - itinerary.budget),
    isOver: total > itinerary.budget,
  };
}

// When the trip is over budget, look for cheaper alternatives for stops (same category, nearby).
export function suggestSavings(itinerary) {
  const suggestions = [];

  for (const stop of allStops(itinerary)) {
    if (stop.estimatedCost <= 0) continue;
    const cheaper = findAlternatives(itinerary, stop.category, [stop])
      .filter((a) => a.estimatedCost < stop.estimatedCost)
      .sort((a, b) => a.estimatedCost - b.estimatedCost)[0];
    if (cheaper) {
      suggestions.push({
        stop,
        alternative: cheaper,
        saving: stop.estimatedCost - cheaper.estimatedCost,
      });
    }
  }

  return suggestions.sort((a, b) => b.saving - a.saving).slice(0, 3);
}
