import { Link } from "react-router-dom";

export default function Navbar() {
  const scrollToContact = () => {
    const section = document.getElementById("contact");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="group">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md transition-all duration-300 group-hover:scale-105">
              C
            </div>

            <div>
              <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-xl font-extrabold text-transparent">
                CampusResourceOpt
              </h1>

              <p className="text-xs text-slate-500">
                Smart Campus Resource Management
              </p>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-blue-600"
          >
            Login
          </Link>

          <button
            onClick={scrollToContact}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 hover:text-blue-600"
          >
            Contact Us
          </button>

          <Link
            to="/login"
            className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            Get Started →
          </Link>
        </nav>
      </div>
    </header>
  );
}