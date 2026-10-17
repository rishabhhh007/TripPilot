import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { Car, Route, Sparkles, AlertCircle } from "lucide-react";
import TripForm from "../components/TripForm.jsx";
import Planner from "../components/Planner.jsx";
import PopularDestinations from "../components/PopularDestinations.jsx";
import FeatureCards from "../components/FeatureCards.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { generateItinerary } from "../api/trips.js";
import { getSavedTrips, saveTrip, loadDraft, saveDraft } from "../utils/storage.js";
import { tomorrowISO } from "../utils/dates.js";

export default function Home() {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Form values (the form is controlled from here)
  const [form, setForm] = useState(() => ({
    source: "",
    destination: "",
    startDate: tomorrowISO(),
    returnDate: "",
    travelers: user?.preferences?.defaultTravelers ?? 2,
    budget: user?.preferences?.defaultBudget ?? 30000,
  }));

  // The current itinerary. The unsaved draft survives a trip to the login page.
  const [itinerary, setItinerary] = useState(() => loadDraft());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const plannerRef = useRef(null);

  // Keep the draft up to date whenever the itinerary changes.
  useEffect(() => {
    saveDraft(itinerary);
  }, [itinerary]);

  // Scroll to a section when the URL has a #hash (e.g. /#features).
  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.hash]);

  // Open a saved trip: /?trip=<id>
  const tripId = searchParams.get("trip");
  useEffect(() => {
    if (tripId && user) {
      const trip = getSavedTrips(user.email).find((t) => t.id === tripId);
      if (trip) {
        setItinerary(trip);
        setSaveStatus("");
        setTimeout(() => plannerRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    }
  }, [tripId, user]);

  async function handleGenerate(values) {
    setLoading(true);
    setError("");
    try {
      const result = await generateItinerary(values);
      setItinerary(result);
      setSaveStatus("");
      setTimeout(() => plannerRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      // If something fails, keep showing the existing itinerary and explain the problem.
      setError(err.message || "Something went wrong while planning your trip.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(updated) {
    setItinerary(updated);
    setSaveStatus("");
  }

  function handleSave() {
    if (!user) {
      setSaveStatus("login");
      return;
    }
    saveTrip(user.email, itinerary);
    setSaveStatus("saved");
  }

  function pickDestination(name) {
    setForm((prev) => ({ ...prev, destination: name }));
    document.getElementById("planner-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-10 pt-14 sm:px-6 sm:pt-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Sparkles size={14} /> AI road trip planner
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Your journey, <span className="text-emerald-600">intelligently planned.</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg text-navy-soft">
              Tell us where you're driving. TripPilot builds a day-by-day plan with meals, stays, sights and fuel stops, then lets you tweak every stop.
            </p>
          </div>

          {/* Decorative route preview */}
          <div className="card hidden p-6 lg:block">
            <div className="flex items-center gap-2 text-sm font-semibold"><Route size={16} className="text-emerald-600" /> Sample route</div>
            <div className="mt-5 space-y-4">
              {[
                ["08:30", "Breakfast stop", "Day 1"],
                ["13:30", "Lunch on the highway", "Day 1"],
                ["18:30", "Overnight stay", "Day 1"],
                ["16:30", "Arrive and explore", "Day 2"],
              ].map(([time, label, day]) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                  <div className="flex-1 text-sm font-medium">{label}</div>
                  <span className="text-xs text-navy-soft">{day} · {time}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-cream p-3 text-xs text-navy-soft">
              <Car size={14} /> Planned for car travel
            </div>
          </div>
        </div>

        {/* Search / trip form */}
        <div id="planner-form" className="relative mx-auto max-w-6xl scroll-mt-24 px-4 pb-14 sm:px-6">
          <TripForm values={form} onChange={setForm} onSubmit={handleGenerate} loading={loading} />
          {error && (
            <p className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
              {itinerary && " Your current itinerary has been kept."}
            </p>
          )}
        </div>
      </section>

      {/* The planner appears on this same page once a trip exists */}
      <div ref={plannerRef}>
        {itinerary && (
          <Planner itinerary={itinerary} onChange={handleChange} onSave={handleSave} saveStatus={saveStatus} />
        )}
      </div>

      <PopularDestinations onPick={pickDestination} />
      <FeatureCards />
    </>
  );
}
