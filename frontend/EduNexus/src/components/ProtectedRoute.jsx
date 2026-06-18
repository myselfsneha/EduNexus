import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  allowedRole,
}) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Role mismatch
  if (
    allowedRole &&
    role !== allowedRole
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md">
          <h1 className="text-5xl mb-4">🔒</h1>

          <h2 className="text-2xl font-bold text-red-600 mb-3">
            Access Denied
          </h2>

          <p className="text-gray-600 mb-6">
            You don't have permission to access
            this page.
          </p>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;