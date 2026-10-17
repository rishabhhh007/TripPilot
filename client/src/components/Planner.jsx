import { useState } from "react";
import { Link } from "react-router-dom";
import { Save, Car, Users, Calendar, ArrowRight, FlaskConical, CheckCircle2 } from "lucide-react";
import ItineraryView from "./ItineraryView.jsx";
import TripMap from "./TripMap.jsx";
import WeatherPanel from "./WeatherPanel.jsx";
import BudgetPanel from "./BudgetPanel.jsx";
import ReplaceModal from "./ReplaceModal.jsx";
import ChatAssistant from "./ChatAssistant.jsx";
import { replaceStop, removeStop, addStop, makeStop, setBudget, DEFAULT_TIMES } from "../utils/itinerary.js";
import { applyProposal } from "../utils/assistant.js";
import { formatDate } from "../utils/dates.js";

// The whole trip planner: itinerary, map, weather, budget and chat.
// It never changes data itself. It builds a new itinerary with the editing functions
// and hands it to Home through onChange.
export default function Planner({ itinerary, onChange, onSave, saveStatus }) {
  const [modal, setModal] = useState(null); // { mode, stop?, dayNumber }

  function dayOfStop(stop) {
    return itinerary.days.find((d) => d.stops.some((s) => s.id === stop.id)).dayNumber;
  }

  function handleSelect(option) {
    if (modal.mode === "replace") {
      onChange(replaceStop(itinerary, modal.stop.id, makeStop(option, modal.stop.time)));
    } else {
      onChange(addStop(itinerary, modal.dayNumber, makeStop(option, DEFAULT_TIMES[option.category])));
    }
    setModal(null);
  }

  return (
    <section id="planner" className="scroll-mt-20 border-b border-line bg-white/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">{itinerary.title}</h2>
            <p className="mt-2 max-w-2xl text-navy-soft">{itinerary.summary}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-navy-soft">
              <span className="flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1">
                {itinerary.source} <ArrowRight size={12} /> {itinerary.destination}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1">
                <Calendar size={12} /> {formatDate(itinerary.startDate)}
                {itinerary.returnDate && ` – ${formatDate(itinerary.returnDate)}`}
              </span>
              <span className="flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1"><Users size={12} /> {itinerary.travelers} travelers</span>
              <span className="flex items-center gap-1 rounded-full border border-line bg-white px-3 py-1"><Car size={12} /> By car</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button onClick={onSave} className="btn-primary"><Save size={16} /> Save trip</button>
            {saveStatus === "saved" && (
              <p className="flex items-center gap-1 text-xs text-emerald-700"><CheckCircle2 size={13} /> Saved. Find it on your profile.</p>
            )}
            {saveStatus === "login" && (
              <p className="text-xs text-navy-soft">
                Please <Link to="/login" className="font-semibold text-emerald-700 underline">log in</Link> or{" "}
                <Link to="/register" className="font-semibold text-emerald-700 underline">register</Link> to save. Your plan will be waiting.
              </p>
            )}
          </div>
        </div>

        {itinerary.isDemo && (
          <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <FlaskConical size={18} className="mt-0.5 shrink-0" />
            <p>
              <strong>Demo mode.</strong> This is a sample Mumbai to Goa itinerary. Your dates, travelers and budget are applied,
              but real AI-generated plans and verified places arrive when the backend and API keys are connected.
              Places marked "AI suggestion" are not verified, and all costs are estimates.
            </p>
          </div>
        )}

        {/* Itinerary + map */}
        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ItineraryView
              itinerary={itinerary}
              onReplace={(stop) => setModal({ mode: "replace", stop, dayNumber: dayOfStop(stop) })}
              onRemove={(stop) => onChange(removeStop(itinerary, stop.id))}
              onAdd={(dayNumber) => setModal({ mode: "add", dayNumber })}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <TripMap itinerary={itinerary} />
            </div>
          </div>
        </div>

        {/* Budget + weather */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <BudgetPanel
            key={itinerary.id}
            itinerary={itinerary}
            onBudgetChange={(value) => onChange(setBudget(itinerary, value))}
            onApplySaving={(s) => onChange(replaceStop(itinerary, s.stop.id, makeStop(s.alternative, s.stop.time)))}
          />
          <WeatherPanel itinerary={itinerary} />
        </div>
      </div>

      {modal && (
        <ReplaceModal
          mode={modal.mode}
          stop={modal.stop}
          dayNumber={modal.dayNumber}
          itinerary={itinerary}
          onSelect={handleSelect}
          onClose={() => setModal(null)}
        />
      )}

      <ChatAssistant itinerary={itinerary} onApply={(proposal) => onChange(applyProposal(itinerary, proposal))} />
    </section>
  );
}
