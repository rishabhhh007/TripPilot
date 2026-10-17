import {
  Coffee,
  Utensils,
  UtensilsCrossed,
  BedDouble,
  Landmark,
  Fuel,
  Armchair,
} from "lucide-react";

// Label, icon and colours for each stop category. Used by cards, modal and map.
export const CATEGORY_META = {
  breakfast: { label: "Breakfast", Icon: Coffee, color: "bg-amber-50 text-amber-700" },
  lunch: { label: "Lunch", Icon: Utensils, color: "bg-orange-50 text-orange-700" },
  dinner: { label: "Dinner", Icon: UtensilsCrossed, color: "bg-rose-50 text-rose-700" },
  hotel: { label: "Stay", Icon: BedDouble, color: "bg-indigo-50 text-indigo-700" },
  attraction: { label: "Attraction", Icon: Landmark, color: "bg-emerald-50 text-emerald-700" },
  fuel: { label: "Fuel stop", Icon: Fuel, color: "bg-slate-100 text-slate-700" },
  rest: { label: "Rest stop", Icon: Armchair, color: "bg-sky-50 text-sky-700" },
};

export const CATEGORY_KEYS = Object.keys(CATEGORY_META);
