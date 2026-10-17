import { distanceKm, ROAD_FACTOR } from "./geo.js";

// ---------------------------------------------------------------
// Itinerary editing functions.
// The Replace, Add and Remove buttons AND the chat assistant all use these,
// so there is only one place where itineraries are changed.
// Every function returns a NEW itinerary (we never change the old one in place).
// ---------------------------------------------------------------

export const DEFAULT_TIMES = {
  breakfast: "08:30",
  lunch: "13:00",
  dinner: "19:30",
  hotel: "19:00",
  attraction: "11:00",
  fuel: "15:00",
  rest: "15:30",
};

export function newId() {
  return "s_" + Math.random().toString(36).slice(2, 9);
}

// All stops of all days in travel order.
export function allStops(itinerary) {
  return itinerary.days.flatMap((day) => day.stops);
}

// Turn an alternative (from the places list) into a stop we can put in the itinerary.
export function makeStop(alternative, time) {
  return {
    id: newId(),
    name: alternative.name,
    category: alternative.category,
    description: alternative.description,
    address: alternative.address,
    lat: alternative.lat,
    lng: alternative.lng,
    time: time || DEFAULT_TIMES[alternative.category],
    durationMinutes: alternative.durationMinutes,
    estimatedCost: alternative.estimatedCost,
    source: "places-demo",
    tags: alternative.tags || [],
  };
}

function sortByTime(stops) {
  return [...stops].sort((a, b) => a.time.localeCompare(b.time));
}

export function replaceStop(itinerary, stopId, newStop) {
  return {
    ...itinerary,
    days: itinerary.days.map((day) => ({
      ...day,
      stops: sortByTime(
        day.stops.map((stop) =>
          stop.id === stopId ? { ...newStop, time: stop.time } : stop
        )
      ),
    })),
  };
}

export function removeStop(itinerary, stopId) {
  return {
    ...itinerary,
    days: itinerary.days.map((day) => ({
      ...day,
      stops: day.stops.filter((stop) => stop.id !== stopId),
    })),
  };
}

export function addStop(itinerary, dayNumber, newStop) {
  return {
    ...itinerary,
    days: itinerary.days.map((day) =>
      day.dayNumber === dayNumber
        ? { ...day, stops: sortByTime([...day.stops, newStop]) }
        : day
    ),
  };
}

export function setBudget(itinerary, budget) {
  return { ...itinerary, budget: Number(budget) };
}

// Approximate driving distance through all stops in order.
// ASSUMPTION: straight-line distance x ROAD_FACTOR. A real Routes API will replace this later.
export function routeKm(itinerary) {
  const stops = allStops(itinerary);
  let total = 0;
  for (let i = 1; i < stops.length; i++) {
    total += distanceKm(stops[i - 1], stops[i]);
  }
  return total * ROAD_FACTOR;
}
