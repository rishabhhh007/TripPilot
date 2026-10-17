import { addDays } from "../utils/dates.js";

// SAMPLE itinerary used in demo mode. In the real app, Gemini (via the Express backend)
// returns JSON in exactly this shape.
//
// Shape:
// itinerary = { id, title, summary, source, destination, startDate, returnDate,
//               travelers, budget, isDemo, days: [ { dayNumber, date, title, stops: [stop] } ] }
// stop      = { id, name, category, description, address, lat, lng, time ("HH:MM"),
//               durationMinutes, estimatedCost (₹, whole group, ESTIMATE), source, accommodation? }
//
// source: "ai" = suggested by AI, not verified | "places-demo" = picked from sample alternatives
// Coordinates and costs below are approximate sample values, not verified data.

const template = {
  title: "Mumbai to Goa Road Trip",
  summary:
    "A relaxed two-day drive down the Konkan side of the Western Ghats with an overnight stay in Kolhapur and an evening arrival in Panaji.",
  source: "Mumbai",
  destination: "Goa",
  isDemo: true,
  days: [
    {
      dayNumber: 1,
      title: "Mumbai → Kolhapur",
      stops: [
        {
          id: "demo-1", name: "Misal breakfast, Lonavala", category: "breakfast",
          description: "Start the drive with a classic Maharashtrian breakfast before the ghat section.",
          address: "Lonavala, Maharashtra (approximate)", lat: 18.7557, lng: 73.4091,
          time: "08:30", durationMinutes: 45, estimatedCost: 600, source: "ai",
        },
        {
          id: "demo-2", name: "Bhaja Caves", category: "attraction",
          description: "Ancient rock-cut caves with a short, easy walk from the parking area.",
          address: "Near Lonavala, Maharashtra (approximate)", lat: 18.7343, lng: 73.4708,
          time: "10:00", durationMinutes: 90, estimatedCost: 200, source: "ai",
        },
        {
          id: "demo-3", name: "Lunch stop near Satara", category: "lunch",
          description: "A highway-side restaurant stop roughly halfway through the day.",
          address: "Satara, Maharashtra (approximate)", lat: 17.6805, lng: 74.0183,
          time: "13:30", durationMinutes: 60, estimatedCost: 900, source: "ai",
        },
        {
          id: "demo-4", name: "Fuel and rest stop near Karad", category: "fuel",
          description: "Refuel, stretch your legs and check tyre pressure before the last stretch.",
          address: "Karad, Maharashtra (approximate)", lat: 17.289, lng: 74.181,
          time: "16:00", durationMinutes: 20, estimatedCost: 0, source: "ai",
        },
        {
          id: "demo-5", name: "Hotel stay in Kolhapur", category: "hotel",
          description: "A mid-range hotel in the city centre is a convenient overnight base.",
          address: "Kolhapur, Maharashtra (approximate)", lat: 16.705, lng: 74.2433,
          time: "18:30", durationMinutes: 720, estimatedCost: 3500, source: "ai",
          accommodation: { type: "Mid-range hotel", note: "Estimated price per night. Availability not checked." },
        },
        {
          id: "demo-6", name: "Kolhapuri thali dinner", category: "dinner",
          description: "Try the regional spicy cuisine this city is known for.",
          address: "Kolhapur, Maharashtra (approximate)", lat: 16.698, lng: 74.23,
          time: "20:00", durationMinutes: 75, estimatedCost: 1000, source: "ai",
        },
      ],
    },
    {
      dayNumber: 2,
      title: "Kolhapur → Panaji",
      stops: [
        {
          id: "demo-7", name: "Breakfast in Kolhapur", category: "breakfast",
          description: "A quick local breakfast before heading south.",
          address: "Kolhapur, Maharashtra (approximate)", lat: 16.701, lng: 74.235,
          time: "08:00", durationMinutes: 40, estimatedCost: 500, source: "ai",
        },
        {
          id: "demo-8", name: "Mahalakshmi Temple, Kolhapur", category: "attraction",
          description: "A well-known temple in the old part of the city. Expect queues on weekends.",
          address: "Kolhapur, Maharashtra (approximate)", lat: 16.6953, lng: 74.2217,
          time: "09:00", durationMinutes: 75, estimatedCost: 0, source: "ai",
        },
        {
          id: "demo-9", name: "Lunch near Amboli", category: "lunch",
          description: "Hill-station lunch stop at the start of the ghat road into Goa.",
          address: "Amboli, Maharashtra (approximate)", lat: 15.957, lng: 74.0,
          time: "12:30", durationMinutes: 60, estimatedCost: 900, source: "ai",
        },
        {
          id: "demo-10", name: "Amboli Waterfall viewpoint", category: "attraction",
          description: "A scenic stop, best in and just after the monsoon.",
          address: "Amboli, Maharashtra (approximate)", lat: 15.9677, lng: 74.0035,
          time: "14:00", durationMinutes: 45, estimatedCost: 200, source: "ai",
        },
        {
          id: "demo-11", name: "Old Goa churches", category: "attraction",
          description: "Historic churches and a quiet walk before settling in for the evening.",
          address: "Old Goa, Goa (approximate)", lat: 15.5009, lng: 73.9116,
          time: "16:30", durationMinutes: 90, estimatedCost: 0, source: "ai",
        },
        {
          id: "demo-12", name: "Hotel stay in Panaji", category: "hotel",
          description: "A comfortable hotel close to the old quarter and riverfront.",
          address: "Panaji, Goa (approximate)", lat: 15.4909, lng: 73.8278,
          time: "18:30", durationMinutes: 720, estimatedCost: 4000, source: "ai",
          accommodation: { type: "Mid-range hotel", note: "Estimated price per night. Availability not checked." },
        },
        {
          id: "demo-13", name: "Goan seafood dinner", category: "dinner",
          description: "End the trip with a coastal meal in Panaji.",
          address: "Panaji, Goa (approximate)", lat: 15.4989, lng: 73.8245,
          time: "20:00", durationMinutes: 90, estimatedCost: 1400, source: "ai",
        },
      ],
    },
  ],
};

// Copy the template and apply what the user typed into the form.
export function buildDemoItinerary(details) {
  const copy = structuredClone(template);
  copy.id = `trip_${Date.now()}`;
  copy.startDate = details.startDate;
  copy.returnDate = details.returnDate || "";
  copy.travelers = Number(details.travelers);
  copy.budget = Number(details.budget);
  copy.days.forEach((day, i) => {
    day.date = addDays(details.startDate, i);
  });
  return copy;
}
