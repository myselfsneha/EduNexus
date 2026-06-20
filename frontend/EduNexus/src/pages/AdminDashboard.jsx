// AdminDashboard.jsx (Part 1)

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
  FaTasks,
} from "react-icons/fa";

function AdminDashboard() {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  const [studentCount, setStudentCount] = useState(0);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  const [attendanceCount, setAttendanceCount] = useState(0);
  const [feeCount, setFeeCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  // Task Manager
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchDashboardData();

    const savedTasks =
      JSON.parse(localStorage.getItem("adminTasks")) || [];

    setTasks(savedTasks);
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

  const fetchDashboardData = async () => {
    try {
      const [attendanceRes, feeRes, courseRes] =
        await Promise.all([
          API.get("/attendance"),
          API.get("/fees"),
          API.get("/courses"),
        ]);

      setAttendanceCount(
        attendanceRes.data?.data?.length || 0
      );

      setFeeCount(
        feeRes.data?.data?.length || 0
      );

      setCourseCount(
        courseRes.data?.data?.length || 0
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // Task Functions
  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);

    localStorage.setItem(
      "adminTasks",
      JSON.stringify(updatedTasks)
    );
  };

  const addTask = () => {
    if (!newTask.trim()) return;

    const updatedTasks = [
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false,
      },
    ];

    saveTasks(updatedTasks);
    setNewTask("");
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
          }
        : task
    );

    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    saveTasks(
      tasks.filter((task) => task.id !== id)
    );
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

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

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
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-3xl p-8 mb-8 shadow-2xl">
          <h2 className="text-4xl font-bold">
            Welcome Back 👋
          </h2>

          <p className="mt-2 text-blue-100">
            Manage students, records, analytics and placements.
          </p>
        </div>

        {/* Premium Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
            <FaUsers className="text-blue-600 text-3xl mb-3" />
            <h3>Total Students</h3>
            <p className="text-4xl font-bold">{studentCount}</p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
            <FaGraduationCap className="text-green-600 text-3xl mb-3" />
            <h3>Courses</h3>
            <p className="text-4xl font-bold">{totalCourses}</p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
            <FaUserShield className="text-purple-600 text-3xl mb-3" />
            <h3>Top Course</h3>
            <p className="text-xl font-bold">{topCourse}</p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
            <FaChartLine className="text-orange-500 text-3xl mb-3" />
            <h3>1st Year</h3>
            <p className="text-4xl font-bold">{firstYearStudents}</p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
            <FaTasks className="text-pink-600 text-3xl mb-3" />
            <h3>Completed Tasks</h3>
            <p className="text-4xl font-bold">{completedTasks}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <AddStudent
              editingStudent={editingStudent}
              setEditingStudent={setEditingStudent}
              fetchStudents={fetchStudents}
            />
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6">
            <StudentList
              students={students}
              setEditingStudent={setEditingStudent}
              fetchStudents={fetchStudents}
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <StudentChart students={students} />

          {/* Admin Tasks */}
          <div className="bg-white rounded-3xl shadow-xl p-6 text-slate-900">
            <h2 className="text-2xl font-bold mb-4">
              Admin Quick Tasks
            </h2>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) =>
                  setNewTask(e.target.value)
                }
                placeholder="Add task..."
                className="flex-1 border rounded-xl p-3"
              />

              <button
                onClick={addTask}
                className="bg-indigo-600 text-white px-5 rounded-xl"
              >
                Add
              </button>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex justify-between items-center bg-slate-100 p-3 rounded-xl"
                >
                  <span
                    onClick={() =>
                      toggleTask(task.id)
                    }
                    className={`cursor-pointer ${
                      task.completed
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    {task.text}
                  </span>

                  <button
                    onClick={() =>
                      deleteTask(task.id)
                    }
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;