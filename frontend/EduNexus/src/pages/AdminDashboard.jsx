import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

import AddStudent from "./AddStudent";
import StudentList from "./StudentList";

import StudentChart from "../components/StudentChart";
import ThemeToggle from "../components/ThemeToggle";

import { useTheme } from "../context/ThemeContext";

import {
  FaUsers,
  FaGraduationCap,
  FaUserShield,
  FaChartLine,
  FaSignOutAlt,
} from "react-icons/fa";

function AdminDashboard() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [studentCount, setStudentCount] = useState(0);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");

      setStudents(res.data.data || []);
      setStudentCount(res.data.data?.length || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const totalCourses = new Set(
    students.map((student) => student.course)
  ).size;

  const courseCounts = {};

  students.forEach((student) => {
    const course = student.course || "Unknown";

    courseCounts[course] =
      (courseCounts[course] || 0) + 1;
  });

  const topCourse =
    Object.keys(courseCounts).length > 0
      ? Object.keys(courseCounts).reduce((a, b) =>
          courseCounts[a] > courseCounts[b]
            ? a
            : b
        )
      : "N/A";

  const firstYearStudents = students.filter(
    (student) => String(student.year) === "1"
  ).length;

  const recentStudents = [...students]
    .slice(-5)
    .reverse();

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100"
      }`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex justify-between items-center px-8 py-4 shadow-lg">
        <h1 className="text-2xl font-bold">
          EduNexus Admin Portal
        </h1>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-3xl p-8 mb-8 shadow-xl">
          <h2 className="text-4xl font-bold">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-blue-100">
            Manage students, records,
            analytics and placements.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white text-slate-900 rounded-3xl shadow-xl p-6 hover:scale-105 transition duration-300">
            <FaUsers className="text-blue-600 text-3xl mb-3" />

            <h3 className="text-gray-500">
              Total Students
            </h3>

            <p className="text-4xl font-bold">
              {studentCount}
            </p>

            <p className="text-green-500 text-sm mt-2">
              Registered Students
            </p>
          </div>

          <div className="bg-white text-slate-900 rounded-3xl shadow-xl p-6 hover:scale-105 transition duration-300">
            <FaGraduationCap className="text-green-600 text-3xl mb-3" />

            <h3 className="text-gray-500">
              Courses
            </h3>

            <p className="text-4xl font-bold">
              {totalCourses}
            </p>

            <p className="text-green-500 text-sm mt-2">
              Active Programs
            </p>
          </div>

          <div className="bg-white text-slate-900 rounded-3xl shadow-xl p-6 hover:scale-105 transition duration-300">
            <FaUserShield className="text-purple-600 text-3xl mb-3" />

            <h3 className="text-gray-500">
              Top Course
            </h3>

            <p className="text-2xl font-bold">
              {topCourse}
            </p>

            <p className="text-blue-500 text-sm mt-2">
              Most Popular Course
            </p>
          </div>

          <div className="bg-white text-slate-900 rounded-3xl shadow-xl p-6 hover:scale-105 transition duration-300">
            <FaChartLine className="text-orange-500 text-3xl mb-3" />

            <h3 className="text-gray-500">
              First Year Students
            </h3>

            <p className="text-4xl font-bold">
              {firstYearStudents}
            </p>

            <p className="text-orange-500 text-sm mt-2">
              Current Enrollments
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate("/attendance")}
            className="bg-blue-600 text-white p-6 rounded-3xl shadow-xl hover:scale-105 transition"
          >
            📅 Attendance
          </button>

          <button
            onClick={() => navigate("/fees")}
            className="bg-green-600 text-white p-6 rounded-3xl shadow-xl hover:scale-105 transition"
          >
            💰 Fees
          </button>

          <button
            onClick={() => navigate("/courses")}
            className="bg-purple-600 text-white p-6 rounded-3xl shadow-xl hover:scale-105 transition"
          >
            📚 Courses
          </button>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white text-slate-900 rounded-3xl shadow-xl p-6">
              <AddStudent
                editingStudent={editingStudent}
                setEditingStudent={setEditingStudent}
                fetchStudents={fetchStudents}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white text-slate-900 rounded-3xl shadow-xl p-6">
              <StudentList
                students={students}
                setEditingStudent={setEditingStudent}
                fetchStudents={fetchStudents}
              />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <StudentChart students={students} />

          <div className="bg-white text-slate-900 rounded-3xl shadow-xl p-6">
            <h2 className="text-2xl font-bold mb-4">
              Recent Activity
            </h2>

            <div className="space-y-4">
              {recentStudents.length > 0 ? (
                recentStudents.map((student, index) => (
                  <div
                    key={student.id || index}
                    className="border-l-4 border-green-500 pl-4"
                  >
                    <p className="font-medium">
                      {student.name}
                    </p>

                    <p className="text-gray-500 text-sm">
                      Added to {student.course}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;