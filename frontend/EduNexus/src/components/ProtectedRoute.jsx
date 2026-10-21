
import { Navigate, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function ProtectedRoute({ children, allowedRole }) {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Redirect users who are not logged in.
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Prevent access to routes assigned to another role.
  if (allowedRole && role !== allowedRole) {
    const handleBackToLogin = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/", { replace: true });
    };

    return (
      <div
        className={`relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 transition-colors duration-300 ${
          darkMode
            ? "bg-[#080d1b] text-white"
            : "bg-slate-50 text-slate-900"
        }`}
      >
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

        <div
          className={`relative w-full max-w-md rounded-[2rem] border p-8 text-center shadow-2xl transition-colors duration-300 sm:p-10 ${
            darkMode
              ? "border-white/10 bg-[#111a2e]/90 shadow-violet-950/20"
              : "border-slate-200 bg-white shadow-slate-200/60"
          }`}
        >
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-xl font-black text-white shadow-lg shadow-violet-500/20">
            EN
          </div>

          <div
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border ${
              darkMode
                ? "border-rose-400/20 bg-rose-400/10"
                : "border-rose-200 bg-rose-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-10 w-10 text-rose-500"
              aria-hidden="true"
            >
              <rect x="5" y="10" width="14" height="11" rx="2.5" />
              <path
                d="M8 10V7a4 4 0 0 1 8 0v3"
                strokeLinecap="round"
              />
              <path d="M12 14v3" strokeLinecap="round" />
            </svg>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-400">
            Restricted Access
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            Access Denied
          </h1>

          <p
            className={`mx-auto mt-4 max-w-sm text-sm leading-7 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            Looks like this space isn't assigned to your account.
            Sign in again to return to the right learning space.
          </p>

          {allowedRole && (
            <div
              className={`mx-auto mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
                darkMode
                  ? "border-white/10 bg-white/5 text-slate-300"
                  : "border-slate-200 bg-slate-50 text-slate-600"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              Required role:
              <span className="capitalize text-violet-400">
                {allowedRole}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={handleBackToLogin}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
          >
            Back to Login
            <span aria-hidden="true">→</span>
          </button>

          <p
            className={`mt-7 text-[10px] font-semibold tracking-[0.2em] ${
              darkMode ? "text-slate-600" : "text-slate-400"
            }`}
          >
            EDUNEXUS · YOUR LEARNING ECOSYSTEM
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;