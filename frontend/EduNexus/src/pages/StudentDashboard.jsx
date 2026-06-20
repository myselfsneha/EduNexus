// StudentDashboard.jsx (Part 1)

import { useEffect, useState } from "react";
import API from "../api";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

import {
  FaUserGraduate,
  FaBook,
  FaCalendarAlt,
  FaSignOutAlt,
  FaEnvelope,
  FaUserCircle,
  FaTasks,
} from "react-icons/fa";

function StudentDashboard() {
  const [student, setStudent] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  const { darkMode } = useTheme();

  useEffect(() => {
    fetchProfile();

    const savedTasks =
      JSON.parse(localStorage.getItem("studentTasks")) || [];

    setTasks(savedTasks);
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

  // Task Manager
  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);

    localStorage.setItem(
      "studentTasks",
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

  const attendancePercentage = 88;

  const notifications = [
    "Attendance updated successfully",
    "New course available",
    "Fee status verified",
  ];

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  if (!student) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl font-semibold">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-slate-900 text-white"
          : "bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100"
      }`}
    >
      {/* Navbar */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
        <h1 className="text-2xl font-bold">
          EduNexus Student Portal
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
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 text-white rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex items-center gap-4">
            <FaUserCircle size={70} />

            <div>
              <h2 className="text-4xl font-bold">
                Welcome, {student.name} 👋
              </h2>

              <p className="text-blue-100 mt-2">
                Manage your profile, tasks and academic information.
              </p>
            </div>
          </div>
        </div>

        {/* Premium Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="backdrop-blur-lg bg-white/70 text-slate-900 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
            <FaUserGraduate className="text-blue-600 text-3xl mb-3" />
            <h3>Role</h3>
            <p className="text-2xl font-bold capitalize">
              {student.role}
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 text-slate-900 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
            <FaEnvelope className="text-green-600 text-3xl mb-3" />
            <h3>Email</h3>
            <p className="font-semibold break-all">
              {student.email}
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 text-slate-900 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
            <FaCalendarAlt className="text-purple-600 text-3xl mb-3" />
            <h3>Joined</h3>
            <p className="font-bold">
              {new Date(
                student.created_at
              ).toLocaleDateString()}
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 text-slate-900 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
            <FaBook className="text-orange-500 text-3xl mb-3" />
            <h3>Student ID</h3>
            <p className="text-2xl font-bold">
              #{student.id}
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/70 text-slate-900 rounded-3xl shadow-xl p-6 hover:scale-105 transition">
            <FaTasks className="text-pink-500 text-3xl mb-3" />
            <h3>Tasks Done</h3>
            <p className="text-2xl font-bold">
              {completedTasks}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-slate-900">
            <div className="text-center">
              <FaUserCircle
                size={90}
                className="mx-auto text-indigo-600 mb-4"
              />

              <h2 className="text-2xl font-bold">
                {student.name}
              </h2>

              <p className="text-gray-500 break-all">
                {student.email}
              </p>

              <div className="mt-6 space-y-3">
                <div className="bg-slate-100 rounded-xl p-3">
                  Student ID: #{student.id}
                </div>

                <div className="bg-slate-100 rounded-xl p-3 capitalize">
                  Role: {student.role}
                </div>
              </div>
            </div>
          </div>

          {/* Attendance */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-slate-900">
            <h2 className="text-2xl font-bold mb-6">
              Attendance Progress
            </h2>

            <div className="flex justify-between mb-2">
              <span>Attendance</span>
              <span>{attendancePercentage}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-5">
              <div
                className="bg-green-500 h-5 rounded-full transition-all duration-700"
                style={{
                  width: `${attendancePercentage}%`,
                }}
              />
            </div>

            <p className="text-gray-500 mt-4">
              Excellent attendance record.
            </p>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-3xl shadow-xl p-8 text-slate-900">
            <h2 className="text-2xl font-bold mb-6">
              Notifications
            </h2>

            <div className="space-y-4">
              {notifications.map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Task Manager */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mt-8 text-slate-900">
          <h2 className="text-2xl font-bold mb-6">
            My Tasks
          </h2>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) =>
                setNewTask(e.target.value)
              }
              placeholder="Add a task..."
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
                  onClick={() => toggleTask(task.id)}
                  className={`cursor-pointer ${
                    task.completed
                      ? "line-through text-gray-500"
                      : ""
                  }`}
                >
                  {task.text}
                </span>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 font-semibold"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;