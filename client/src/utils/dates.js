// Small date helpers. Dates are stored as "YYYY-MM-DD" strings.

export function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso, n) {
  const date = new Date(`${iso}T00:00:00`);
  date.setDate(date.getDate() + n);
  return toISODate(date);
}

export function tomorrowISO() {
  return addDays(toISODate(new Date()), 1);
}

export function formatDate(iso) {
  if (!iso) return "";
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// How many days from today until the given date (negative if in the past).
export function daysUntil(iso) {
  const today = new Date(`${toISODate(new Date())}T00:00:00`);
  const target = new Date(`${iso}T00:00:00`);
  return Math.round((target - today) / 86400000);
}

export function formatMoney(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
