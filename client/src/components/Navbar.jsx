import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Compass, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

    async function handleLogout() {
    await logout();
    }

  const linkClass = "text-sm font-medium text-navy-soft transition hover:text-emerald-700";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Compass size={18} />
          </span>
          TripPilot
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          <Link to="/#planner-form" className={linkClass}>Plan a trip</Link>
          <Link to="/#destinations" className={linkClass}>Destinations</Link>
          <Link to="/#features" className={linkClass}>Features</Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link to="/profile" className="btn-outline !py-2">
                <User size={16} /> {user.name.split(" ")[0]}
              </Link>
              <button onClick={handleLogout} className="text-sm font-medium text-navy-soft hover:text-emerald-700" aria-label="Log out">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass}>Log in</Link>
              <Link to="/register" className="btn-primary !py-2">Get started</Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="space-y-3 border-t border-line bg-cream px-4 py-4 md:hidden" onClick={() => setOpen(false)}>
          <Link to="/#planner-form" className="block text-sm font-medium">Plan a trip</Link>
          <Link to="/#destinations" className="block text-sm font-medium">Destinations</Link>
          <Link to="/#features" className="block text-sm font-medium">Features</Link>
          {user ? (
            <>
              <Link to="/profile" className="block text-sm font-medium">Profile</Link>
              <button onClick={handleLogout} className="block text-sm font-medium">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block text-sm font-medium">Log in</Link>
              <Link to="/register" className="btn-primary w-full">Get started</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
