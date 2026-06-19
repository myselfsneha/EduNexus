import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import Courses from "./pages/Courses";
import ProtectedRoute from "./components/ProtectedRoute";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full">
        <h1 className="text-7xl font-bold text-blue-600">
          404
        </h1>

        <h2 className="text-2xl font-bold mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mt-2">
          The page you're looking for doesn't exist.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

function App() {
  document.title = "EduNexus";

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
              role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/student" replace />
              )
            ) : (
              <Login />
            )
          }
        />

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

        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;