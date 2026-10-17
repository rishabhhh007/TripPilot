import { useState } from "react";
import { Sun, Cloud, CloudRain, CloudSun, Droplets, Wind, Info } from "lucide-react";
import { DEMO_WEATHER } from "../data/demoWeather.js";
import { allStops } from "../utils/itinerary.js";
import { distanceKm } from "../utils/geo.js";
import { daysUntil, formatDate, addDays } from "../utils/dates.js";

const ICONS = { sunny: Sun, partly: CloudSun, cloudy: Cloud, rain: CloudRain };
const LABELS = { sunny: "Sunny", partly: "Partly cloudy", cloudy: "Cloudy", rain: "Rain" };

// Free weather APIs usually forecast only about 5 days ahead.
const FORECAST_LIMIT_DAYS = 4;

export default function WeatherPanel({ itinerary }) {
  const stops = allStops(itinerary);
  const [selectedId, setSelectedId] = useState("");
  const selected = stops.find((s) => s.id === selectedId) || stops[stops.length - 1];

  if (!selected) {
    return <div className="card p-5 text-sm text-navy-soft">Add a stop to see its weather.</div>;
  }

  // Use the nearest sample weather location to the selected stop.
  const weather = [...DEMO_WEATHER].sort((a, b) => distanceKm(selected, a) - distanceKm(selected, b))[0];
  const CurrentIcon = ICONS[weather.current.condition];
  const forecastAvailable = daysUntil(itinerary.startDate) >= 0 && daysUntil(itinerary.startDate) <= FORECAST_LIMIT_DAYS;

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold">Weather</h3>
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">Demo data</span>
      </div>

      <label className="label mt-3">Check a stop</label>
      <select className="input" value={selected.id} onChange={(e) => setSelectedId(e.target.value)}>
        {stops.map((s) => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>
      <p className="mt-1 text-xs text-navy-soft">Showing sample conditions for {weather.place}, the nearest sample location.</p>

      <div className="mt-4 rounded-xl bg-emerald-50 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">Current conditions</p>
        <div className="mt-2 flex items-center gap-4">
          <CurrentIcon size={36} className="text-emerald-700" />
          <div>
            <p className="text-2xl font-bold">{weather.current.tempC}°C</p>
            <p className="text-sm text-navy-soft">{LABELS[weather.current.condition]}</p>
          </div>
          <div className="ml-auto space-y-1 text-xs text-navy-soft">
            <p className="flex items-center gap-1"><Droplets size={13} /> {weather.current.humidity}% humidity</p>
            <p className="flex items-center gap-1"><Wind size={13} /> {weather.current.windKmh} km/h wind</p>
          </div>
        </div>
      </div>

      <p className="mb-2 mt-4 text-xs font-bold uppercase tracking-wide text-navy-soft">Forecast for your dates</p>
      {forecastAvailable ? (
        <div className="grid grid-cols-3 gap-2">
          {weather.forecast.map((f, i) => {
            const Icon = ICONS[f.condition];
            return (
              <div key={i} className="rounded-xl border border-line p-3 text-center">
                <p className="text-xs text-navy-soft">{formatDate(addDays(itinerary.startDate, i))}</p>
                <Icon size={22} className="mx-auto my-2 text-emerald-700" />
                <p className="text-sm font-semibold">{f.maxC}° / {f.minC}°</p>
                <p className="text-xs text-navy-soft">{f.rainChance}% rain</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="flex gap-2 rounded-xl border border-dashed border-line p-3 text-sm text-navy-soft">
          <Info size={16} className="mt-0.5 shrink-0" />
          Forecast not available for these dates yet. Forecasts usually cover only the next few days, so only current conditions are shown above.
        </p>
      )}
    </div>
  );
}
