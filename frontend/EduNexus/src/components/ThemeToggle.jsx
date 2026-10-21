
import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${darkMode ? "light" : "dark"} mode`}
      aria-pressed={Boolean(darkMode)}
      title={`Switch to ${darkMode ? "light" : "dark"} mode`}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
        darkMode
          ? "border-white/10 bg-[#111a2e] text-amber-300 hover:border-violet-400/40 hover:bg-[#18233b] focus:ring-offset-[#080d1b]"
          : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 focus:ring-offset-white"
      }`}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
          darkMode
            ? "bg-amber-400/10 text-amber-300"
            : "bg-violet-500/10 text-violet-600"
        }`}
      >
        {darkMode ? (
          <FaSun className="text-sm transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <FaMoon className="text-sm transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </span>

      <span className="hidden sm:inline">
        {darkMode ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}

export default ThemeToggle;