import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (!password) return setError("Enter your password.");

    setSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:py-20">
      <h1 className="text-3xl font-bold">Welcome back</h1>
      <p className="mt-2 text-navy-soft">Log in to save and reopen your trips.</p>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6" noValidate>
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-soft" />
            <input type="email" className="input !pl-10" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-soft" />
            <input type="password" className="input !pl-10" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
          </div>
        </div>

        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        <button type="submit" className="btn-primary w-full !py-3" disabled={submitting}>
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          {submitting ? "Logging in..." : "Log in"}
        </button>
        <p className="text-center text-sm text-navy-soft">
          New to TripPilot? <Link to="/register" className="font-semibold text-emerald-700">Create an account</Link>
        </p>
      </form>
    </div>
  );
}