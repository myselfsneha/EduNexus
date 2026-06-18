import { useEffect, useState } from "react";
import API from "../api";

import {
  FaUserGraduate,
  FaBook,
  FaCalendarAlt,
  FaSignOutAlt,
  FaEnvelope,
  FaUserCircle,
} from "react-icons/fa";

function StudentDashboard() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      setStudent(res.data.user);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (!student) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-100">
        <div className="text-xl font-semibold text-slate-700">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">

      {/* Navbar */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">
          EduNexus Student Portal
        </h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      <div className="p-8">

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex items-center gap-4">
            <FaUserCircle size={60} />

            <div>
              <h2 className="text-4xl font-bold">
                Welcome, {student.name} 👋
              </h2>

              <p className="text-blue-100 mt-2">
                Access your profile, academic details and account information.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition">
            <FaUserGraduate className="text-blue-600 text-4xl mb-3" />

            <h3 className="text-gray-500">
              Role
            </h3>

            <p className="text-2xl font-bold capitalize">
              {student.role}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition">
            <FaEnvelope className="text-green-600 text-4xl mb-3" />

            <h3 className="text-gray-500">
              Email
            </h3>

            <p className="font-semibold break-all">
              {student.email}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition">
            <FaCalendarAlt className="text-purple-600 text-4xl mb-3" />

            <h3 className="text-gray-500">
              Joined
            </h3>

            <p className="font-bold text-lg">
              {new Date(
                student.created_at
              ).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl hover:shadow-2xl transition">
            <FaBook className="text-orange-500 text-4xl mb-3" />

            <h3 className="text-gray-500">
              Student ID
            </h3>

            <p className="text-2xl font-bold">
              #{student.id}
            </p>
          </div>

        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            Student Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-slate-50 p-5 rounded-2xl">
              <p className="text-gray-500 text-sm">
                Full Name
              </p>

              <p className="text-lg font-semibold">
                {student.name}
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl">
              <p className="text-gray-500 text-sm">
                Email Address
              </p>

              <p className="text-lg font-semibold break-all">
                {student.email}
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl">
              <p className="text-gray-500 text-sm">
                Account Role
              </p>

              <p className="text-lg font-semibold capitalize">
                {student.role}
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl">
              <p className="text-gray-500 text-sm">
                User ID
              </p>

              <p className="text-lg font-semibold">
                #{student.id}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;