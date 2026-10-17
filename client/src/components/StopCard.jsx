import { Clock, Replace, Trash2, MapPin, ShieldQuestion, BadgeInfo } from "lucide-react";
import { CATEGORY_META } from "../utils/categoryMeta.js";
import { formatDuration, formatMoney } from "../utils/dates.js";

export default function StopCard({ stop, number, onReplace, onRemove }) {
  const { Icon, label, color } = CATEGORY_META[stop.category];

  return (
    <div className="card p-4 transition hover:shadow-md">
      <div className="flex gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
          <Icon size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-bold text-emerald-700">#{number}</span>
            <h4 className="font-semibold">{stop.name}</h4>
            <span className="rounded-full bg-cream px-2 py-0.5 text-xs text-navy-soft">{label}</span>
          </div>

          <p className="mt-1 text-sm text-navy-soft">{stop.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-soft">
            <span className="flex items-center gap-1"><Clock size={13} /> {stop.time} · {formatDuration(stop.durationMinutes)}</span>
            <span className="flex items-center gap-1"><MapPin size={13} /> {stop.address}</span>
            <span className="font-semibold text-navy">≈ {formatMoney(stop.estimatedCost)} <span className="font-normal text-navy-soft">(estimate)</span></span>
          </div>

          {stop.accommodation && (
            <p className="mt-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs text-indigo-800">
              {stop.accommodation.type}. {stop.accommodation.note}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            {stop.source === "ai" ? (
              <span className="flex items-center gap-1 text-xs text-amber-700">
                <ShieldQuestion size={13} /> AI suggestion, not verified
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-sky-700">
                <BadgeInfo size={13} /> Sample alternative (demo data)
              </span>
            )}

            <div className="flex gap-2">
              <button onClick={() => onReplace(stop)} className="btn-outline !px-3 !py-1.5 !text-xs">
                <Replace size={13} /> Replace
              </button>
              <button onClick={() => onRemove(stop)} className="btn-outline !px-3 !py-1.5 !text-xs hover:!border-rose-500 hover:!text-rose-600" aria-label={`Remove ${stop.name}`}>
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
