import { Plus } from "lucide-react";
import StopCard from "./StopCard.jsx";
import { formatDate } from "../utils/dates.js";

export default function ItineraryView({ itinerary, onReplace, onRemove, onAdd }) {
  // Stop numbers continue across days so they match the numbers on the map.
  let counter = 0;

  return (
    <div className="space-y-8">
      {itinerary.days.map((day) => (
        <section key={day.dayNumber}>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Day {day.dayNumber} · {formatDate(day.date)}
              </p>
              <h3 className="text-lg font-bold">{day.title}</h3>
            </div>
            <button onClick={() => onAdd(day.dayNumber)} className="btn-outline !px-3 !py-1.5 !text-xs">
              <Plus size={14} /> Add stop
            </button>
          </div>

          <div className="space-y-3 border-l-2 border-emerald-100 pl-4">
            {day.stops.length === 0 && (
              <p className="rounded-xl border border-dashed border-line p-4 text-sm text-navy-soft">
                No stops on this day. Use "Add stop" to add one.
              </p>
            )}
            {day.stops.map((stop) => {
              counter += 1;
              return (
                <StopCard key={stop.id} stop={stop} number={counter} onReplace={onReplace} onRemove={onRemove} />
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
