import { Compass } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-navy-soft sm:flex-row sm:px-6">
        <div className="flex items-center gap-2 font-semibold text-navy">
          <Compass size={18} className="text-emerald-600" /> TripPilot
        </div>
        <p>Your journey, intelligently planned.</p>
        <p className="text-xs">Costs and places shown are estimates. Always confirm before you travel.</p>
      </div>
    </footer>
  );
}
