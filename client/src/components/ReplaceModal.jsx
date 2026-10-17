import { useState } from "react";
import { X, Route, MapPin } from "lucide-react";
import { CATEGORY_META, CATEGORY_KEYS } from "../utils/categoryMeta.js";
import { findAlternatives } from "../utils/alternatives.js";
import { replaceStop, addStop, makeStop, routeKm, DEFAULT_TIMES } from "../utils/itinerary.js";
import { formatMoney, formatDuration } from "../utils/dates.js";

// One modal for two jobs:
//   mode "replace": pick an alternative for `stop` (same category)
//   mode "add":     pick a category, then a stop to add to `dayNumber`
export default function ReplaceModal({ mode, stop, dayNumber, itinerary, onSelect, onClose }) {
  const [category, setCategory] = useState(stop ? stop.category : "lunch");

  const day = itinerary.days.find((d) => d.dayNumber === dayNumber);
  const referenceStops = mode === "replace" ? [stop] : day.stops;
  const currentKm = routeKm(itinerary);

  // How much longer (or shorter) would the route become with this option?
  function detourFor(option) {
    const changed =
      mode === "replace"
        ? replaceStop(itinerary, stop.id, makeStop(option, stop.time))
        : addStop(itinerary, dayNumber, makeStop(option, DEFAULT_TIMES[option.category]));
    return routeKm(changed) - currentKm;
  }

  // Attach the route change to each option and show the smallest detour first.
  const options = findAlternatives(itinerary, category, referenceStops.length ? referenceStops : [{ lat: 0, lng: 0 }])
    .map((option) => ({ ...option, detour: detourFor(option) }))
    .sort((a, b) => a.detour - b.detour);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">
              {mode === "replace" ? `Replace "${stop.name}"` : `Add a stop to Day ${dayNumber}`}
            </h3>
            <p className="mt-1 text-sm text-navy-soft">
              Showing sample alternatives (demo data, not verified). Real nearby places will come from a Places API.
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-navy-soft hover:text-navy"><X /></button>
        </div>

        {mode === "add" && (
          <div className="mt-4">
            <label className="label">Category</label>
            <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORY_KEYS.map((key) => (
                <option key={key} value={key}>{CATEGORY_META[key].label}</option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-5 space-y-3">
          {options.length === 0 && (
            <p className="rounded-xl border border-dashed border-line p-4 text-sm text-navy-soft">
              No sample alternatives found nearby for this category.
            </p>
          )}

          {options.map((option) => {
            const detour = option.detour;
            const costDiff = mode === "replace" ? option.estimatedCost - stop.estimatedCost : null;
            return (
              <div key={option.id} className="rounded-xl border border-line p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold">{option.name}</h4>
                    <p className="mt-0.5 text-sm text-navy-soft">{option.description}</p>
                  </div>
                  <button onClick={() => onSelect(option)} className="btn-primary !px-4 !py-1.5 !text-xs">
                    {mode === "replace" ? "Select" : "Add"}
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-soft">
                  <span className="flex items-center gap-1"><MapPin size={13} /> {option.address}</span>
                  <span>≈ {formatMoney(option.estimatedCost)} (estimate)</span>
                  <span>{formatDuration(option.durationMinutes)}</span>
                  <span className="flex items-center gap-1">
                    <Route size={13} /> {detour >= 0 ? "+" : ""}{detour.toFixed(0)} km route
                  </span>
                  {costDiff !== null && costDiff !== 0 && (
                    <span className={costDiff < 0 ? "font-semibold text-emerald-700" : "font-semibold text-rose-600"}>
                      {costDiff < 0 ? "Saves" : "Costs"} {formatMoney(Math.abs(costDiff))}
                    </span>
                  )}
                  {option.tags.includes("vegetarian") && <span className="text-emerald-700">Vegetarian</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
