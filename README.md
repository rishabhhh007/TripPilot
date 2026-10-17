# TripPilot

**Your journey, intelligently planned.** An AI-assisted road trip planner built with the MERN stack.

## Current status: Stage 1 (frontend with demo data)

The frontend runs on its own using sample data. The backend is only a placeholder.

> Note: this stage was written without being able to run `npm install` or a build in the authoring environment.
> If you see an error on first run, copy it into the chat and we'll fix it.

### What works now (demo mode)

- Landing page with trip form, popular destinations and feature cards
- Trip planner on the **same page** after you press "Plan my trip": day-wise itinerary, interactive map (OpenStreetMap via Leaflet), weather, budget
- Replace, Add and Remove stops. The route distance and budget recalculate immediately
- Budget breakdown, per-person cost, your own budget, and cheaper-option suggestions when over budget
- Chat assistant (simple keyword rules). It proposes a change and you press Apply
- Register, login, profile (default budget and preferences), save trips and reopen them
  (all stored in your browser's localStorage)

### What is NOT real yet

| Feature | Demo behaviour | Real version (later) |
| --- | --- | --- |
| Itinerary | Always a sample Mumbai → Goa plan | Gemini via Express, validated JSON |
| Alternatives | Sample places list | Places API |
| Route/distance | Straight line × 1.3 | Routes API |
| Weather | Sample numbers | OpenWeather |
| Chat | Keyword rules | Gemini returns a structured proposal |
| Auth & trips | Browser localStorage, passwords not stored or checked | bcrypt + JWT cookie + MongoDB |

All sample places, coordinates, prices and weather are approximate and **not verified**.

## Run the frontend

You need Node.js 18+ installed.

```bash
cd client
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

Optional: copy `client/.env.example` to `client/.env`. Keep `VITE_DEMO_MODE=true` until the backend exists.

## Run the placeholder server (optional)

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Check http://localhost:5000/api/health

## Project structure

```
trippilot/
├── client/                  React + Vite + Tailwind
│   └── src/
│       ├── pages/           Home (landing + planner), Login, Register, Profile
│       ├── components/      TripForm, Planner, ItineraryView, StopCard, TripMap,
│       │                    WeatherPanel, BudgetPanel, ReplaceModal, ChatAssistant, ...
│       ├── utils/           itinerary.js (edit functions), budget.js, assistant.js, ...
│       ├── data/            sample itinerary, alternatives, weather
│       ├── api/             trips.js (the one place that will call the backend)
│       └── context/         AuthContext.jsx (demo auth)
└── server/                  Express placeholder (health check only)
```

### Files worth reading first

1. `client/src/data/demoItinerary.js` - the itinerary data shape (this is what Gemini will return later)
2. `client/src/utils/itinerary.js` - `replaceStop`, `addStop`, `removeStop`: the only functions that change an itinerary
3. `client/src/utils/budget.js` - budget maths with explicit assumptions
4. `client/src/pages/Home.jsx` and `client/src/components/Planner.jsx` - how state flows through the page

## Next stages

1. **Backend foundation**: MongoDB Atlas connection, User and Trip Mongoose models, centralized errors
2. **Auth**: register, login, logout with bcrypt and a JWT in an HTTP-only cookie; auth middleware
3. **Trip CRUD**: save, list, update, delete (only your own trips); replace the localStorage calls in `client/src/utils/storage.js` and `AuthContext.jsx`
4. **Gemini**: `POST /api/trips/generate` using `@google/genai`, validate JSON, then wire `client/src/api/trips.js`
5. **Places, routes, weather**: real alternatives, real distances, OpenWeather
6. **Assistant**: Gemini returns proposals, backend validates, the same edit functions apply them

Never commit real API keys. Keep them in `.env` files (already in `.gitignore`).
