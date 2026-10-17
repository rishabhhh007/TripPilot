import { useState } from "react";
import { MapPin, Flag, Calendar, Users, Wallet, Car, Sparkles, Loader2 } from "lucide-react";

// A small wrapper that puts a label, an icon and an error message around any input.
function Field({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="relative">
        <Icon size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-soft" />
        {children}
      </div>
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function validate(v) {
  const errors = {};
  if (!v.source.trim()) errors.source = "Enter your starting point.";
  if (!v.destination.trim()) errors.destination = "Enter a destination.";
  if (v.source.trim() && v.source.trim().toLowerCase() === v.destination.trim().toLowerCase()) {
    errors.destination = "Destination must be different from the source.";
  }
  if (!v.startDate) errors.startDate = "Choose a start date.";
  if (v.returnDate && v.startDate && v.returnDate < v.startDate) {
    errors.returnDate = "Return date can't be before the start date.";
  }
  const travelers = Number(v.travelers);
  if (!Number.isInteger(travelers) || travelers < 1 || travelers > 20) errors.travelers = "Enter 1 to 20 travelers.";
  if (!(Number(v.budget) > 0)) errors.budget = "Enter a budget above 0.";
  return errors;
}

// The form is "controlled" by Home: Home owns the values, this component shows them.
export default function TripForm({ values, onChange, onSubmit, loading }) {
  const [errors, setErrors] = useState({});

  function set(field, value) {
    onChange({ ...values, [field]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="card p-5 shadow-lg shadow-navy/5 sm:p-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="From" icon={MapPin} error={errors.source}>
          <input className="input !pl-10" placeholder="e.g. Mumbai" value={values.source}
            onChange={(e) => set("source", e.target.value)} />
        </Field>
        <Field label="To" icon={Flag} error={errors.destination}>
          <input className="input !pl-10" placeholder="e.g. Goa" value={values.destination}
            onChange={(e) => set("destination", e.target.value)} />
        </Field>
        <Field label="Start date" icon={Calendar} error={errors.startDate}>
          <input type="date" className="input !pl-10" value={values.startDate}
            onChange={(e) => set("startDate", e.target.value)} />
        </Field>
        <Field label="Return date (optional)" icon={Calendar} error={errors.returnDate}>
          <input type="date" className="input !pl-10" value={values.returnDate} min={values.startDate}
            onChange={(e) => set("returnDate", e.target.value)} />
        </Field>
        <Field label="Travelers" icon={Users} error={errors.travelers}>
          <input type="number" min="1" max="20" className="input !pl-10" value={values.travelers}
            onChange={(e) => set("travelers", e.target.value)} />
        </Field>
        <Field label="Total budget (₹)" icon={Wallet} error={errors.budget}>
          <input type="number" min="1" step="500" className="input !pl-10" value={values.budget}
            onChange={(e) => set("budget", e.target.value)} />
        </Field>
        <div>
          <span className="label">Travel mode</span>
          <div className="flex h-[42px] items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 text-sm font-semibold text-emerald-800">
            <Car size={16} /> By car
          </div>
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full !py-3" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {loading ? "Planning your trip..." : "Plan my trip"}
          </button>
        </div>
      </div>
    </form>
  );
}
