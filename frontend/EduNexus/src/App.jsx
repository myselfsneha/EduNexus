
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
import Timetable from "./pages/Timetable";

import ProtectedRoute from "./components/ProtectedRoute";
import { useTheme } from "./context/ThemeContext";

function NotFound() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center px-6 text-center ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <p className="text-7xl font-black text-indigo-500">404</p>

      <h1 className="mt-4 text-2xl font-bold">
        Page not found
      </h1>

      <p
        className={`mt-2 max-w-md text-sm ${
          darkMode ? "text-slate-400" : "text-slate-500"
        }`}
      >
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
      >
        Back to home
      </button>
    </div>
  );
}

function HomeRedirect() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (token && role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (token && role === "student") {
    return <Navigate to="/student" replace />;
  }

  return <Navigate to="/login" replace />;
}

function AppRoutes() {
  useEffect(() => {
    document.title = "EduNexus | College Management System";
  }, []);

  return (
    <Routes>
      {/* Home and authentication */}
      <Route path="/" element={<HomeRedirect />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      {/* Admin dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Student dashboard */}
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

      {/* Faculty management */}
      <Route
        path="/faculty"
        element={
          <ProtectedRoute allowedRole="admin">
            <Faculty />
          </ProtectedRoute>
        }
      />

      {/* Timetable management */}
      <Route
        path="/timetables"
        element={
          <ProtectedRoute allowedRole="admin">
            <Timetable />
          </ProtectedRoute>
        }
      />

      {/* Unknown routes */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
