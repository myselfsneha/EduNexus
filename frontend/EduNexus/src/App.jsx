
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import Courses from "./pages/Courses";
import Faculty from "./pages/Faculty";
import ProtectedRoute from "./components/ProtectedRoute";
import { useTheme } from "./context/ThemeContext";

function NotFound() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div
      className={`relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-12 transition-colors duration-300 ${
        darkMode
          ? "bg-[#080d1b] text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />

      <div
        className={`relative w-full max-w-lg rounded-[2rem] border p-8 text-center shadow-2xl sm:p-12 ${
          darkMode
            ? "border-white/10 bg-[#111a2e]/90 shadow-violet-950/20"
            : "border-slate-200 bg-white shadow-slate-200/60"
        }`}
      >
        <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-2xl font-black text-white shadow-lg shadow-violet-500/20">
          EN
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.3em] text-violet-400">
          Error · 404
        </p>

        <h1 className="mt-4 bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-7xl font-black tracking-tight text-transparent sm:text-8xl">
          404
        </h1>

        <h2 className="mt-5 text-2xl font-black sm:text-3xl">
          Looks like a wrong turn.
        </h2>

        <p
          className={`mx-auto mt-3 max-w-sm text-sm leading-6 ${
            darkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          This page isn't part of your learning universe. Let's get
          you back to where things make sense.
        </p>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-violet-500/30 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
          Back to EduNexus
          <span aria-hidden="true">→</span>
        </button>

        <p
          className={`mt-8 text-xs font-semibold tracking-[0.2em] ${
            darkMode ? "text-slate-600" : "text-slate-400"
          }`}
        >
          EDUNEXUS · YOUR LEARNING ECOSYSTEM
        </p>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    document.title = "EduNexus | Your Learning Ecosystem";
  }, []);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route
          path="/"
          element={
            token ? (
              <Navigate
                to={role === "admin" ? "/admin" : "/student"}
                replace
              />
            ) : (
              <Login />
            )
          }
        />

        {/* Signup */}
        <Route path="/signup" element={<Signup />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* Attendance */}
        <Route
          path="/attendance"
          element={
            <ProtectedRoute allowedRole="admin">
              <Attendance />
            </ProtectedRoute>
          }
        />

        {/* Fees */}
        <Route
          path="/fees"
          element={
            <ProtectedRoute allowedRole="admin">
              <Fees />
            </ProtectedRoute>
          }
        />

        {/* Courses */}
        <Route
          path="/courses"
          element={
            <ProtectedRoute allowedRole="admin">
              <Courses />
            </ProtectedRoute>
          }
        />

        {/* Faculty Management — Admin Only */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRole="admin">
              <Faculty />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
