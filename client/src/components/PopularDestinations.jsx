import { MapPin, ArrowRight } from "lucide-react";
import { DESTINATIONS } from "../data/destinations.js";

// Clicking a card fills the destination field in the form above.
export default function PopularDestinations({ onPick }) {
  return (
    <section id="destinations" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <h2 className="text-2xl font-bold sm:text-3xl">Popular destinations</h2>
      <p className="mt-2 text-navy-soft">Pick a place to start planning your drive.</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATIONS.map((d) => (
          <button
            key={d.name}
            onClick={() => onPick(d.name)}
            className="group card overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`flex h-32 items-end bg-linear-to-br ${d.gradient} p-4`}>
              <MapPin className="text-white/90" />
            </div>
            <div className="flex items-center justify-between p-4">
              <div>
                <h3 className="font-semibold">{d.name}</h3>
                <p className="text-sm text-navy-soft">{d.tagline}</p>
              </div>
              <ArrowRight size={18} className="text-emerald-600 transition group-hover:translate-x-1" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
