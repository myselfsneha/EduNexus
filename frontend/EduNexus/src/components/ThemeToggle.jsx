import { FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-xl shadow-lg hover:scale-105 transition"
    >
      {darkMode ? <FaSun /> : <FaMoon />}
      {darkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export default ThemeToggle;