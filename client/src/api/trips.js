import { buildDemoItinerary } from "../data/demoItinerary.js";

// All calls to "the backend" live in the api/ folder, so pages never need to know
// whether data comes from sample data or from the real server.

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== "false";

// Ask for an itinerary. In demo mode we return sample data after a short pause.
export async function generateItinerary(details) {
  if (DEMO_MODE) {
    await new Promise((resolve) => setTimeout(resolve, 1400));
    return buildDemoItinerary(details);
  }

  // TODO (backend phase): POST `${VITE_API_URL}/api/trips/generate` with fetch().
  // The Express server will call Gemini, validate the JSON and return it.
  throw new Error(
    "The backend is not built yet. Set VITE_DEMO_MODE=true in client/.env to use sample data."
  );
}
