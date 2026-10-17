import {
  allStops,
  addStop,
  replaceStop,
  removeStop,
  makeStop,
  routeKm,
  DEFAULT_TIMES,
} from "./itinerary.js";
import { findAlternatives } from "./alternatives.js";
import { suggestSavings } from "./budget.js";
import { formatMoney } from "./dates.js";

// DEMO assistant: simple keyword rules in the browser.
// Later, the backend sends the itinerary + message to Gemini and gets back a proposal
// in this same shape, then validates it. A proposal is plain data:
//   { action: "replace", stopId, newStop } | { action: "add", dayNumber, newStop } | { action: "remove", stopId }
// Nothing changes until the user clicks Apply, and Apply uses the same editing functions as the buttons.

export function applyProposal(itinerary, proposal) {
  if (proposal.action === "replace") return replaceStop(itinerary, proposal.stopId, proposal.newStop);
  if (proposal.action === "add") return addStop(itinerary, proposal.dayNumber, proposal.newStop);
  if (proposal.action === "remove") return removeStop(itinerary, proposal.stopId);
  return itinerary;
}

const CATEGORY_WORDS = ["breakfast", "lunch", "dinner", "hotel", "attraction", "fuel", "rest"];

export const EXAMPLE_COMMANDS = [
  "Find a cheaper hotel",
  "Add a breakfast stop",
  "Suggest a vegetarian restaurant",
  "Make tomorrow less tiring",
  "Reduce my trip budget",
  "Avoid toll roads",
];

export function interpretMessage(message, itinerary) {
  const text = message.toLowerCase();
  const stops = allStops(itinerary);
  const dayOf = (stopId) => itinerary.days.find((d) => d.stops.some((s) => s.id === stopId)).dayNumber;
  const wantsDay2 = /tomorrow|day 2|second day/.test(text);

  // Avoid tolls: needs a real routing service
  if (/toll/.test(text)) {
    return {
      reply:
        "Avoiding toll roads needs a real routing service, which isn't connected in demo mode yet. Once the Routes API is added, I'll be able to compare toll-free routes.",
    };
  }

  // Vegetarian restaurant
  if (/veg/.test(text)) {
    for (const stop of stops.filter((s) => s.category === "lunch" || s.category === "dinner")) {
      const match = findAlternatives(itinerary, stop.category, [stop]).find((a) => a.tags.includes("vegetarian"));
      if (match) {
        return {
          reply: `I found a vegetarian ${stop.category} option near "${stop.name}". Want to swap it in? (Sample place, not verified.)`,
          proposal: {
            action: "replace",
            stopId: stop.id,
            newStop: makeStop(match, stop.time),
            label: `Replace "${stop.name}" with "${match.name}"`,
          },
        };
      }
    }
    return { reply: "I couldn't find another vegetarian option near your lunch or dinner stops in the sample data." };
  }

  // Cheaper hotel
  if (/cheaper.*(hotel|stay)|(hotel|stay).*cheaper|cheap.*hotel/.test(text)) {
    const hotels = stops.filter((s) => s.category === "hotel").sort((a, b) => b.estimatedCost - a.estimatedCost);
    for (const hotel of hotels) {
      const cheaper = findAlternatives(itinerary, "hotel", [hotel])
        .filter((a) => a.estimatedCost < hotel.estimatedCost)
        .sort((a, b) => a.estimatedCost - b.estimatedCost)[0];
      if (cheaper) {
        return {
          reply: `"${cheaper.name}" is an estimated ${formatMoney(hotel.estimatedCost - cheaper.estimatedCost)} cheaper per night than "${hotel.name}". Availability is not checked.`,
          proposal: {
            action: "replace",
            stopId: hotel.id,
            newStop: makeStop(cheaper, hotel.time),
            label: `Replace "${hotel.name}" with "${cheaper.name}"`,
          },
        };
      }
    }
    return { reply: "I couldn't find a cheaper hotel in the sample data near your current stays." };
  }

  // Reduce budget
  if (/budget|save|cheaper|reduce/.test(text)) {
    const best = suggestSavings(itinerary)[0];
    if (best) {
      return {
        reply: `The biggest saving I can find is about ${formatMoney(best.saving)} by changing "${best.stop.name}".`,
        proposal: {
          action: "replace",
          stopId: best.stop.id,
          newStop: makeStop(best.alternative, best.stop.time),
          label: `Replace "${best.stop.name}" with "${best.alternative.name}" (saves about ${formatMoney(best.saving)})`,
        },
      };
    }
    return { reply: "I couldn't find cheaper nearby alternatives in the sample data." };
  }

  // Less tiring: remove the longest attraction from the busiest day
  if (/tiring|relax|easier|lighter/.test(text)) {
    const day = wantsDay2
      ? itinerary.days[Math.min(1, itinerary.days.length - 1)]
      : [...itinerary.days].sort((a, b) => b.stops.length - a.stops.length)[0];
    const longest = day.stops
      .filter((s) => s.category === "attraction")
      .sort((a, b) => b.durationMinutes - a.durationMinutes)[0];
    if (longest) {
      return {
        reply: `Day ${day.dayNumber} is busy. Removing "${longest.name}" would free about ${longest.durationMinutes} minutes.`,
        proposal: { action: "remove", stopId: longest.id, label: `Remove "${longest.name}" from Day ${day.dayNumber}` },
      };
    }
    return { reply: `Day ${day.dayNumber} has no attractions left to remove.` };
  }

  // Add / replace a category stop
  const category = CATEGORY_WORDS.find((word) => text.includes(word));
  if (category && /add|include|another/.test(text)) {
    const dayNumber = wantsDay2 ? Math.min(2, itinerary.days.length) : 1;
    const day = itinerary.days.find((d) => d.dayNumber === dayNumber);
    // Choose the option that adds the least driving distance to the route.
    const extraKm = (a) => routeKm(addStop(itinerary, dayNumber, makeStop(a, DEFAULT_TIMES[category]))) - routeKm(itinerary);
    const match = findAlternatives(itinerary, category, day.stops, 60).sort((a, b) => extraKm(a) - extraKm(b))[0];
    if (match) {
      return {
        reply: `I can add "${match.name}" to Day ${dayNumber}. (Sample place, not verified.)`,
        proposal: {
          action: "add",
          dayNumber,
          newStop: makeStop(match, DEFAULT_TIMES[category]),
          label: `Add "${match.name}" to Day ${dayNumber}`,
        },
      };
    }
    return { reply: `I couldn't find another ${category} option near Day ${dayNumber} in the sample data.` };
  }

  if (category && /replace|change|swap/.test(text)) {
    const stop = stops.find((s) => s.category === category);
    const match = stop && findAlternatives(itinerary, category, [stop])[0];
    if (match) {
      return {
        reply: `I can swap "${stop.name}" for "${match.name}".`,
        proposal: {
          action: "replace",
          stopId: stop.id,
          newStop: makeStop(match, stop.time),
          label: `Replace "${stop.name}" with "${match.name}"`,
        },
      };
    }
    return { reply: `I couldn't find a ${category} alternative to swap in.` };
  }

  return {
    reply:
      "I'm running in demo mode with simple keyword rules. Try one of the example commands below. Real Gemini-powered understanding comes when the backend is connected.",
  };
}
