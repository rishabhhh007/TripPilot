function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

const tripsKey = (email) => `trippilot_trips_${email}`;

export function getSavedTrips(email) {
  return read(tripsKey(email), []);
}

export function saveTrip(email, itinerary) {
  const trips = getSavedTrips(email).filter((t) => t.id !== itinerary.id);
  trips.unshift({ ...itinerary, savedAt: new Date().toISOString() });
  write(tripsKey(email), trips);
}

export function deleteTrip(email, tripId) {
  write(tripsKey(email), getSavedTrips(email).filter((t) => t.id !== tripId));
}

export function loadDraft() {
  try {
    const raw = sessionStorage.getItem("trippilot_draft");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDraft(itinerary) {
  try {
    if (itinerary) sessionStorage.setItem("trippilot_draft", JSON.stringify(itinerary));
    else sessionStorage.removeItem("trippilot_draft");
  } catch {
    return;
  }
}