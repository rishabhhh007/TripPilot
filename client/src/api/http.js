// One small helper for every call to the backend, so pages never repeat fetch() boilerplate.
//
//   const data = await api("/health");
//   const trip = await api("/trips", { method: "POST", body: { title: "Goa" } });
//
// - Paths are relative to /api. With VITE_API_URL empty the browser calls the same domain
//   (locally the Vite dev proxy forwards /api to the Express server; on Vercel it is one domain).
// - credentials: "include" makes the browser send the login cookie.
// - Errors become normal JavaScript errors with a readable message, so pages can just show err.message.

const BASE_URL = import.meta.env.VITE_API_URL || "";

export async function api(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${BASE_URL}/api${path}`, {
      method,
      credentials: "include",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // The response had no JSON body (that is fine for some endpoints).
  }

  if (!response.ok) {
    const error = new Error(data?.message || `Request failed (${response.status})`);
    error.status = response.status;
    error.details = data?.details; // field-level validation problems, if any
    throw error;
  }

  return data;
}