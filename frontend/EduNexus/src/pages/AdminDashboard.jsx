import { useState, useEffect } from "react";
import API from "../api";
import AddStudent from "./AddStudent";
import StudentList from "./StudentList";
import {
  FaUsers,
  FaGraduationCap,
  FaUserShield,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    fetchStudentsCount();
  }, []);

  const fetchStudentsCount = async () => {
    try {
      const res = await API.get("/students");
      setStudentCount(res.data.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <div className="bg-slate-900 text-white flex justify-between items-center px-8 py-4 shadow-lg">
        <h1 className="text-2xl font-bold">
          EduNexus Admin Portal
        </h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      <div className="p-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-slate-800">
            Dashboard Overview
          </h2>

          <p className="text-gray-500 mt-2">
            Academic Management & Placement Platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow p-6">
            <FaUsers className="text-blue-600 text-3xl mb-3" />
            <h3 className="text-gray-500">Total Students</h3>
            <p className="text-4xl font-bold">{studentCount}</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <FaGraduationCap className="text-green-600 text-3xl mb-3" />
            <h3 className="text-gray-500">Courses</h3>
            <p className="text-4xl font-bold">12</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <FaUserShield className="text-purple-600 text-3xl mb-3" />
            <h3 className="text-gray-500">Admins</h3>
            <p className="text-4xl font-bold">1</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <FaChartLine className="text-orange-500 text-3xl mb-3" />
            <h3 className="text-gray-500">Placement Rate</h3>
            <p className="text-4xl font-bold">92%</p>
          </div>
        </div>

        {/* Add Student */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <AddStudent />
        </div>

        {/* Student List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <StudentList />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;