import { createContext, useContext, useState } from "react";
import { getSession, saveSession, getUsers, saveUsers } from "../utils/storage.js";

// DEMO AUTH (no server yet): accounts live only in this browser.
// Passwords are NOT stored and NOT checked in demo mode.
// In the backend phase, login/register/logout will call the Express API (bcrypt + JWT cookie)
// and this file will be the only place that needs to change.

const AuthContext = createContext(null);

export const DEFAULT_PREFERENCES = {
  defaultBudget: 30000,
  defaultTravelers: 2,
  food: "any",
  stay: "mid",
  interests: ["nature", "food"],
  avoidTolls: false,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession());

  function startSession(account) {
    setUser(account);
    saveSession(account);
  }

  function register(name, email) {
    const users = getUsers();
    if (users.some((u) => u.email === email)) {
      throw new Error("An account with this email already exists.");
    }
    const account = { name, email, preferences: DEFAULT_PREFERENCES };
    saveUsers([...users, account]);
    startSession(account);
  }

  function login(email) {
    const account = getUsers().find((u) => u.email === email);
    if (!account) throw new Error("No account found for this email. Please register first.");
    startSession(account);
  }

  function logout() {
    setUser(null);
    saveSession(null);
  }

  function updateProfile(changes) {
    const updated = { ...user, ...changes };
    saveUsers(getUsers().map((u) => (u.email === updated.email ? updated : u)));
    startSession(updated);
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
