import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  CalendarDays,
} from "lucide-react";

function Header() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const userName =
    localStorage.getItem("userName") || "Admin";

  const today = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <header className="h-20 px-8 flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      {/* Left Side */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>

        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
          <CalendarDays size={14} />
          <span>{today}</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* User Info */}
        <div className="hidden md:flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <User size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-800">
              {userName}
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="
            flex items-center gap-2
            rounded-xl
            bg-red-500
            px-4 py-2
            text-white
            font-medium
            transition-all
            hover:bg-red-600
            hover:shadow-lg
          "
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;