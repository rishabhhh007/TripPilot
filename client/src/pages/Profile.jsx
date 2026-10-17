import { useState } from "react";
import { Link } from "react-router-dom";
import { Save, CheckCircle2, Trash2, FolderOpen, Map } from "lucide-react";
import { useAuth, DEFAULT_PREFERENCES } from "../context/AuthContext.jsx";
import { getSavedTrips, deleteTrip } from "../utils/storage.js";
import { formatDate } from "../utils/dates.js";

const INTERESTS = ["nature", "heritage", "beaches", "food", "adventure"];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user.name);
  const [prefs, setPrefs] = useState({ ...DEFAULT_PREFERENCES, ...user.preferences });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [trips, setTrips] = useState(() => getSavedTrips(user.email));

  function setPref(field, value) {
    setPrefs((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function toggleInterest(interest) {
    const has = prefs.interests.includes(interest);
    setPref("interests", has ? prefs.interests.filter((i) => i !== interest) : [...prefs.interests, interest]);
  }

    async function handleSave(e) {
    e.preventDefault();
    setError("");
    try {
      await updateProfile({
        name: name.trim() || user.name,
        preferences: {
          ...prefs,
          defaultBudget: Number(prefs.defaultBudget) || DEFAULT_PREFERENCES.defaultBudget,
          defaultTravelers: Number(prefs.defaultTravelers) || DEFAULT_PREFERENCES.defaultTravelers,
        },
      });
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleDelete(id) {
    deleteTrip(user.email, id);
    setTrips(getSavedTrips(user.email));
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Your profile</h1>

      <div className="mt-8 grid gap-8 md:grid-cols-5">
        {/* Details + preferences */}
        <form onSubmit={handleSave} className="card space-y-5 p-6 md:col-span-3">
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input bg-cream" value={user.email} readOnly />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Default budget (₹)</label>
              <input type="number" min="1" className="input" value={prefs.defaultBudget} onChange={(e) => setPref("defaultBudget", e.target.value)} />
            </div>
            <div>
              <label className="label">Default travelers</label>
              <input type="number" min="1" max="20" className="input" value={prefs.defaultTravelers} onChange={(e) => setPref("defaultTravelers", e.target.value)} />
            </div>
            <div>
              <label className="label">Food preference</label>
              <select className="input" value={prefs.food} onChange={(e) => setPref("food", e.target.value)}>
                <option value="any">No preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-vegetarian</option>
              </select>
            </div>
            <div>
              <label className="label">Stay style</label>
              <select className="input" value={prefs.stay} onChange={(e) => setPref("stay", e.target.value)}>
                <option value="budget">Budget</option>
                <option value="mid">Mid-range</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>

          <div>
            <span className="label">Interests</span>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => {
                const active = prefs.interests.includes(interest);
                return (
                  <button
                    type="button" key={interest} onClick={() => toggleInterest(interest)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition ${
                      active ? "border-emerald-600 bg-emerald-50 text-emerald-800" : "border-line bg-white text-navy-soft hover:border-emerald-600"
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={prefs.avoidTolls} onChange={(e) => setPref("avoidTolls", e.target.checked)} className="h-4 w-4 accent-emerald-600" />
            Prefer routes that avoid tolls
          </label>

          <div className="flex items-center gap-3">
            <button type="submit" className="btn-primary"><Save size={16} /> Save changes</button>
            {saved && <span className="flex items-center gap-1 text-sm text-emerald-700"><CheckCircle2 size={15} /> Saved</span>}
            {error && <span className="text-sm text-rose-700">{error}</span>}
          </div>
        </form>

        {/* Saved trips */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-bold">Saved trips</h2>
          <div className="mt-3 space-y-3">
            {trips.length === 0 && (
              <div className="card p-5 text-sm text-navy-soft">
                <Map size={20} className="mb-2 text-emerald-600" />
                No saved trips yet. <Link to="/#planner-form" className="font-semibold text-emerald-700">Plan one</Link> and press "Save trip".
              </div>
            )}
            {trips.map((trip) => (
              <div key={trip.id} className="card p-4">
                <p className="font-semibold">{trip.title}</p>
                <p className="mt-0.5 text-xs text-navy-soft">{formatDate(trip.startDate)} · {trip.travelers} travelers</p>
                <div className="mt-3 flex gap-2">
                  <Link to={`/?trip=${trip.id}`} className="btn-outline !px-3 !py-1.5 !text-xs"><FolderOpen size={13} /> Open</Link>
                  <button onClick={() => handleDelete(trip.id)} className="btn-outline !px-3 !py-1.5 !text-xs hover:!border-rose-500 hover:!text-rose-600">
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
