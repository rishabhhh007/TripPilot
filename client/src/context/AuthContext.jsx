import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/http.js";

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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/auth/me")
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function register(name, email, password) {
    const data = await api("/auth/register", { method: "POST", body: { name, email, password } });
    setUser(data.user);
  }

  async function login(email, password) {
    const data = await api("/auth/login", { method: "POST", body: { email, password } });
    setUser(data.user);
  }

  async function logout() {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  }

  async function updateProfile(changes) {
    const data = await api("/auth/me", { method: "PATCH", body: changes });
    setUser(data.user);
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
