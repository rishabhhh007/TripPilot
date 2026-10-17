import { Link } from "react-router-dom";
import { Sparkles, Map, Replace, Wallet, CloudSun, MessageCircle } from "lucide-react";

const FEATURES = [
  { Icon: Sparkles, title: "AI itineraries", text: "Day-by-day plans with meals, stays, attractions and fuel stops." },
  { Icon: Map, title: "Interactive map", text: "See every stop in order on a free OpenStreetMap-based map." },
  { Icon: Replace, title: "Replace any stop", text: "Swap a single recommendation without regenerating the whole trip." },
  { Icon: Wallet, title: "Budget breakdown", text: "Estimates for stays, food, fuel, tolls and activities, with cheaper options." },
  { Icon: CloudSun, title: "Weather aware", text: "Check conditions and forecasts for important stops on your route." },
  { Icon: MessageCircle, title: "Chat assistant", text: "Ask for a cheaper hotel or a lighter day and approve the change." },
];

export default function FeatureCards() {
  return (
    <section id="features" className="scroll-mt-20 border-y border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold sm:text-3xl">Everything you need for the road</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ Icon, title, text }) => (
            <div key={title} className="card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-navy-soft">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl bg-navy p-8 text-white sm:flex-row">
          <div>
            <h3 className="text-xl font-bold">Ready for your next drive?</h3>
            <p className="mt-1 text-sm text-white/70">Create a free account to save and reopen your trips.</p>
          </div>
          <Link to="/register" className="btn-primary !bg-emerald-500 hover:!bg-emerald-400">Get started</Link>
        </div>
      </div>
    </section>
  );
}
