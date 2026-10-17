import { useState } from "react";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { calculateBudget, suggestSavings, ASSUMPTIONS } from "../utils/budget.js";
import { formatMoney } from "../utils/dates.js";

export default function BudgetPanel({ itinerary, onBudgetChange, onApplySaving }) {
  const budget = calculateBudget(itinerary);
  const savings = budget.isOver ? suggestSavings(itinerary) : [];
  const [draft, setDraft] = useState(String(itinerary.budget));

  function commitBudget() {
    const value = Number(draft);
    if (value > 0) onBudgetChange(value);
    else setDraft(String(itinerary.budget));
  }

  const maxAmount = Math.max(...budget.categories.map((c) => c.amount), 1);

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-bold">Budget</h3>
        <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium text-navy-soft">Estimates only</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-cream p-3">
          <p className="text-xs text-navy-soft">Estimated total</p>
          <p className="text-xl font-bold">{formatMoney(budget.total)}</p>
        </div>
        <div className="rounded-xl bg-cream p-3">
          <p className="text-xs text-navy-soft">Per person ({itinerary.travelers})</p>
          <p className="text-xl font-bold">{formatMoney(budget.perPerson)}</p>
        </div>
      </div>

      <label className="label mt-4">Your budget (₹)</label>
      <input
        type="number" min="1" step="500" className="input" value={draft}
        onChange={(e) => setDraft(e.target.value)} onBlur={commitBudget}
        onKeyDown={(e) => e.key === "Enter" && commitBudget()}
      />

      {budget.isOver ? (
        <p className="mt-3 flex gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          Estimated cost is about {formatMoney(budget.overBy)} over your budget.
        </p>
      ) : (
        <p className="mt-3 flex gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          Within budget, with about {formatMoney(itinerary.budget - budget.total)} to spare.
        </p>
      )}

      {savings.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-navy-soft">Cheaper options</p>
          <div className="space-y-2">
            {savings.map((s) => (
              <div key={s.stop.id} className="flex items-center justify-between gap-3 rounded-xl border border-line p-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate">{s.stop.name} <ArrowRight size={12} className="inline" /> {s.alternative.name}</p>
                  <p className="text-xs font-semibold text-emerald-700">Saves about {formatMoney(s.saving)}</p>
                </div>
                <button onClick={() => onApplySaving(s)} className="btn-outline !px-3 !py-1 !text-xs">Apply</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wide text-navy-soft">Breakdown</p>
      <div className="space-y-2.5">
        {budget.categories.map((c) => (
          <div key={c.key}>
            <div className="flex justify-between text-sm">
              <span>{c.label}</span>
              <span className="font-medium">{formatMoney(c.amount)}</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-cream">
              <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${(c.amount / maxAmount) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>

      <details className="mt-5 text-xs text-navy-soft">
        <summary className="cursor-pointer font-semibold text-navy">Assumptions</summary>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          <li>Distance: about {Math.round(budget.distanceKm)} km, estimated from straight lines between stops x 1.3.</li>
          <li>Fuel: {ASSUMPTIONS.mileageKmPerLitre} km per litre at ₹{ASSUMPTIONS.fuelPricePerLitre} per litre.</li>
          <li>Tolls: ₹{ASSUMPTIONS.tollPerKm} per km on average.</li>
          <li>If a return date is set, the same distance is assumed for the way back. Return-leg stays and food are not included.</li>
          <li>Stop costs are estimates for the whole group, not live prices.</li>
        </ul>
      </details>
    </div>
  );
}
