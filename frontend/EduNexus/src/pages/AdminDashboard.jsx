import { useState, useEffect } from "react";
import API from "../api";
import AddStudent from "./AddStudent";
import StudentList from "./StudentList";
import StudentChart from "../components/StudentChart";

import {
  FaUsers,
  FaGraduationCap,
  FaUserShield,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");

      setStudents(res.data.data);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100">
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex justify-between items-center px-8 py-4 shadow-lg">
        <h1 className="text-2xl font-bold">
          EduNexus Admin Portal
        </h1>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>

      <div className="p-8">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-3xl p-8 mb-8 shadow-xl">
          <h2 className="text-4xl font-bold">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-blue-100">
            Manage students, records, analytics and placements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <FaUsers className="text-blue-600 text-3xl mb-3" />
            <h3 className="text-gray-500">Total Students</h3>
            <p className="text-4xl font-bold">{studentCount}</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <FaGraduationCap className="text-green-600 text-3xl mb-3" />
            <h3 className="text-gray-500">Courses</h3>
            <p className="text-4xl font-bold">12</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <FaUserShield className="text-purple-600 text-3xl mb-3" />
            <h3 className="text-gray-500">Admins</h3>
            <p className="text-4xl font-bold">1</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-6">
            <FaChartLine className="text-orange-500 text-3xl mb-3" />
            <h3 className="text-gray-500">Placement Rate</h3>
            <p className="text-4xl font-bold">92%</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <AddStudent
            editingStudent={editingStudent}
            setEditingStudent={setEditingStudent}
          />
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <StudentList
            setEditingStudent={setEditingStudent}
          />
        </div>

        <div className="mt-8 bg-white rounded-3xl shadow-xl p-6">
          <StudentChart students={students} />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;