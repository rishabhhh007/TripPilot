import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (name.trim().length < 2) return setError("Enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    try {
      register(name.trim(), email.trim().toLowerCase());
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-14 sm:py-20">
      <h1 className="text-3xl font-bold">Create your account</h1>
      <p className="mt-2 text-navy-soft">Plan, save and revisit your road trips.</p>

      <form onSubmit={handleSubmit} className="card mt-8 space-y-4 p-6" noValidate>
        <div>
          <label className="label">Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-soft" />
            <input className="input !pl-10" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>
        </div>
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
            <input type="password" className="input !pl-10" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
          </div>
        </div>

        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

        <button type="submit" className="btn-primary w-full !py-3"><UserPlus size={16} /> Create account</button>
        <p className="text-center text-sm text-navy-soft">
          Already registered? <Link to="/login" className="font-semibold text-emerald-700">Log in</Link>
        </p>
      </form>

      <p className="mt-4 text-xs text-navy-soft">
        Demo mode: your account is stored only in this browser and your password is not saved. Real accounts come with the backend.
      </p>
    </div>
  );
}
