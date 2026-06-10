import { useEffect, useState } from "react";
import API from "../api";
import {
  FaUserGraduate,
  FaBook,
  FaCalendarAlt,
  FaSignOutAlt,
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
      <div className="p-10">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          EduNexus Student Portal
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      <div className="p-8">
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h2 className="text-3xl font-bold">
            Welcome, {student.name}
          </h2>

          <p className="text-gray-500">
            Student Dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaUserGraduate className="text-blue-600 text-3xl mb-3" />
            <h3 className="text-gray-500">Role</h3>
            <p className="font-bold">
              {student.role}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaBook className="text-green-600 text-3xl mb-3" />
            <h3 className="text-gray-500">Email</h3>
            <p className="font-bold break-all">
              {student.email}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaCalendarAlt className="text-purple-600 text-3xl mb-3" />
            <h3 className="text-gray-500">
              Joined
            </h3>
            <p className="font-bold">
              {new Date(
                student.created_at
              ).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <FaUserGraduate className="text-orange-500 text-3xl mb-3" />
            <h3 className="text-gray-500">
              User ID
            </h3>
            <p className="font-bold">
              #{student.id}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;