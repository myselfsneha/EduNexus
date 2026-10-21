
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
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBookOpen,
  FaArrowRight,
  FaPlus,
  FaCheckCircle,
  FaCircle,
  FaTrash,
  FaClock,
  FaBolt,
  FaSearch,
  FaArrowUp,
  FaBars,
  FaTimes,
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

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchDashboardData();

    try {
      const savedTasks = JSON.parse(
        localStorage.getItem("adminTasks") || "[]"
      );

      setTasks(Array.isArray(savedTasks) ? savedTasks : []);
    } catch {
      setTasks([]);
    }
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      const studentData = res.data?.data || [];

      setStudents(studentData);
      setStudentCount(studentData.length);
    } catch (error) {
      console.error("Unable to fetch students:", error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const [attendanceRes, feeRes, courseRes] = await Promise.all([
        API.get("/attendance"),
        API.get("/fees"),
        API.get("/courses"),
      ]);

      setAttendanceCount(attendanceRes.data?.data?.length || 0);
      setFeeCount(feeRes.data?.data?.length || 0);
      setCourseCount(courseRes.data?.data?.length || 0);
    } catch (error) {
      console.error("Unable to fetch dashboard data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const saveTasks = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem("adminTasks", JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    const trimmedTask = newTask.trim();

    if (!trimmedTask) return;

    const updatedTasks = [
      ...tasks,
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: trimmedTask,
        completed: false,
      },
    ];

    saveTasks(updatedTasks);
    setNewTask("");
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    );

    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    saveTasks(tasks.filter((task) => task.id !== id));
  };

  const totalCourses = new Set(
    students.map((student) => student.course).filter(Boolean)
  ).size;

  const courseCounts = {};

  students.forEach((student) => {
    const course = student.course || "Unknown";
    courseCounts[course] = (courseCounts[course] || 0) + 1;
  });

  const topCourse =
    Object.keys(courseCounts).length > 0
      ? Object.keys(courseCounts).reduce((a, b) =>
          courseCounts[a] > courseCounts[b] ? a : b
        )
      : "N/A";

  const firstYearStudents = students.filter(
    (student) => String(student.year) === "1"
  ).length;

  const recentStudents = [...students].slice(-5).reverse();

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  const surface = darkMode
    ? "border border-white/[0.08] bg-[#101525]"
    : "border border-slate-200/80 bg-white";

  const mutedText = darkMode ? "text-slate-400" : "text-slate-500";
  const headingText = darkMode ? "text-white" : "text-slate-900";
  const subtleSurface = darkMode
    ? "bg-white/[0.04] border-white/[0.07]"
    : "bg-slate-50 border-slate-200";

  const navItems = [
    {
      label: "Overview",
      icon: FaChartLine,
      action: () => window.scrollTo({ top: 0, behavior: "smooth" }),
      active: true,
    },
    {
      label: "Attendance",
      icon: FaCalendarAlt,
      action: () => navigate("/attendance"),
    },
    {
      label: "Fees & Payments",
      icon: FaMoneyBillWave,
      action: () => navigate("/fees"),
    },
    {
      label: "Courses",
      icon: FaBookOpen,
      action: () => navigate("/courses"),
    },
  ];

  const stats = [
    {
      label: "Total students",
      value: studentCount,
      icon: FaUsers,
      accent: "text-cyan-400",
      iconBg: "bg-cyan-400/10",
      description: "Registered learners",
      trend: "LIVE DATA",
    },
    {
      label: "Active courses",
      value: totalCourses,
      icon: FaGraduationCap,
      accent: "text-violet-400",
      iconBg: "bg-violet-400/10",
      description: "Across student records",
      trend: "COURSES",
    },
    {
      label: "First-year students",
      value: firstYearStudents,
      icon: FaUserShield,
      accent: "text-emerald-400",
      iconBg: "bg-emerald-400/10",
      description: "Year 1 enrollment",
      trend: "YEAR 01",
    },
    {
      label: "Most popular course",
      value: topCourse,
      icon: FaChartLine,
      accent: "text-amber-400",
      iconBg: "bg-amber-400/10",
      description: "By student enrollment",
      trend: "TOP COURSE",
    },
  ];

  const quickLinks = [
    {
      title: "Attendance",
      description: "Monitor student attendance records",
      icon: FaCalendarAlt,
      accent: "text-cyan-400",
      iconBg: "bg-cyan-400/10",
      action: () => navigate("/attendance"),
      count: attendanceCount,
      unit: "records",
    },
    {
      title: "Fees & payments",
      description: "Access fee management records",
      icon: FaMoneyBillWave,
      accent: "text-emerald-400",
      iconBg: "bg-emerald-400/10",
      action: () => navigate("/fees"),
      count: feeCount,
      unit: "records",
    },
    {
      title: "Course catalog",
      description: "Explore available course records",
      icon: FaBookOpen,
      accent: "text-violet-400",
      iconBg: "bg-violet-400/10",
      action: () => navigate("/courses"),
      count: courseCount,
      unit: "records",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-[#080B16] text-white"
          : "bg-[#f5f7fc] text-slate-900"
      }`}
    >
      {/* Background atmosphere */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/3 h-96 w-96 rounded-full bg-violet-600/[0.08] blur-[120px]" />
        <div className="absolute right-0 top-[30%] h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-[120px]" />
        <div
          className={`absolute inset-0 ${
            darkMode ? "opacity-[0.035]" : "opacity-[0.025]"
          }`}
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 75%)",
          }}
        />
      </div>

      <div className="relative flex min-h-screen">
        {/* Desktop sidebar */}
        <aside
          className={`hidden w-[258px] shrink-0 flex-col border-r px-5 py-6 md:flex ${
            darkMode
              ? "border-white/[0.08] bg-[#0b0f1c]/90"
              : "border-slate-200 bg-white/90"
          }`}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="mb-10 flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-xl font-black text-white shadow-lg shadow-violet-500/20">
              E
            </div>

            <div>
              <p className={`text-lg font-extrabold tracking-tight ${headingText}`}>
                EduNexus<span className="text-violet-400">.</span>
              </p>
              <p className={`text-[10px] font-semibold uppercase tracking-[0.23em] ${mutedText}`}>
                Learning ecosystem
              </p>
            </div>
          </button>

          <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-sm font-medium transition-all ${
                    item.active
                      ? "border border-violet-400/20 bg-gradient-to-r from-violet-500/15 to-cyan-400/[0.06] text-violet-500 dark:text-violet-300"
                      : `${
                          darkMode
                            ? "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                        }`
                  }`}
                >
                  <Icon
                    className={`text-base ${
                      item.active ? "text-violet-400" : ""
                    }`}
                  />
                  <span className="flex-1">{item.label}</span>
                  {item.active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mb-3 mt-9 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Management
          </div>

          <button
            onClick={() =>
              document
                .getElementById("student-management")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
              darkMode
                ? "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FaUsers />
            Student directory
          </button>

          <button
            onClick={() =>
              document
                .getElementById("admin-tasks")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
              darkMode
                ? "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FaTasks />
            Quick tasks
            {pendingTasks > 0 && (
              <span className="ml-auto rounded-md bg-violet-500/15 px-2 py-0.5 text-xs text-violet-400">
                {pendingTasks}
              </span>
            )}
          </button>

          <div className="mt-auto pt-8">
            <div className="overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-cyan-400/[0.04] p-4">
              <div className="mb-3 flex items-center gap-2">
                <FaBolt className="text-sm text-cyan-400" />
                <span className="text-xs font-bold">Your workspace</span>
              </div>
              <p className={`text-xs leading-5 ${mutedText}`}>
                One place to manage learners, records and your academic
                ecosystem.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400">
                  Workspace ready
                </span>
              </div>
            </div>

            <div
              className={`mt-5 border-t pt-5 ${
                darkMode ? "border-white/[0.08]" : "border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 font-bold text-violet-400">
                  A
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`truncate text-sm font-semibold ${headingText}`}>
                    Administrator
                  </p>
                  <p className={`text-xs ${mutedText}`}>Control center</p>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main application */}
        <main className="min-w-0 flex-1">
          {/* Top bar */}
          <header
            className={`sticky top-0 z-20 border-b backdrop-blur-xl ${
              darkMode
                ? "border-white/[0.08] bg-[#080B16]/85"
                : "border-slate-200/80 bg-white/85"
            }`}
          >
            <div className="flex h-[76px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-9">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border md:hidden ${subtleSurface}`}
                  aria-label="Toggle navigation"
                >
                  {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className="min-w-0">
                  <div className={`flex items-center gap-2 text-xs ${mutedText}`}>
                    <span>EduNexus</span>
                    <span>/</span>
                    <span className="text-violet-400">Dashboard</span>
                  </div>
                  <h1 className={`truncate text-base font-bold sm:text-lg ${headingText}`}>
                    Admin workspace
                  </h1>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <div
                  className={`hidden items-center gap-2 rounded-xl border px-3 py-2 text-xs sm:flex ${subtleSurface} ${mutedText}`}
                >
                  <FaSearch className="text-[10px]" />
                  <span>Management console</span>
                </div>

                <ThemeToggle />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2.5 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20 sm:px-4 sm:text-sm"
                >
                  <FaSignOutAlt />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            </div>

            {/* Mobile navigation */}
            {mobileMenuOpen && (
              <nav
                className={`space-y-1 border-t px-4 py-3 md:hidden ${
                  darkMode ? "border-white/[0.08]" : "border-slate-200"
                }`}
              >
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm ${
                        item.active
                          ? "bg-violet-500/10 text-violet-400"
                          : mutedText
                      }`}
                    >
                      <Icon />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
            )}
          </header>

          <div className="mx-auto max-w-[1600px] space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-9">
            {/* Welcome section */}
            <section className="relative overflow-hidden rounded-3xl border border-violet-400/20 bg-[#101426] p-6 shadow-2xl shadow-violet-950/10 sm:p-8 lg:p-10">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-violet-600/15 via-transparent to-cyan-500/10" />
              <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full border border-violet-300/10" />
              <div className="pointer-events-none absolute -right-4 -top-16 h-52 w-52 rounded-full border border-cyan-300/10" />
              <div className="pointer-events-none absolute bottom-0 right-10 h-28 w-28 rounded-full bg-violet-500/10 blur-3xl" />

              <div className="relative flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
                <div className="max-w-2xl">
                  <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                    <FaBolt />
                    Your command center
                  </div>

                  <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                    Welcome back,
                    <br className="hidden sm:block" />{" "}
                    <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                      Administrator.
                    </span>
                  </h2>

                  <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                    Your academic ecosystem, all in one place. Keep track of
                    students, explore records, and keep the whole system
                    moving.
                  </p>
                </div>

                <button
                  onClick={() =>
                    document
                      .getElementById("student-management")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex w-fit items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/30 transition hover:-translate-y-0.5 hover:shadow-violet-500/20"
                >
                  <FaUsers />
                  Manage students
                  <FaArrowRight className="text-xs" />
                </button>
              </div>

              <div className="relative mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-white/[0.08] pt-5">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Dashboard initialized
                </div>
                <div className="hidden h-4 w-px bg-white/10 sm:block" />
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <FaUsers className="text-violet-400" />
                  <span>{studentCount} students in your records</span>
                </div>
                <div className="hidden h-4 w-px bg-white/10 sm:block" />
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <FaTasks className="text-cyan-400" />
                  <span>{pendingTasks} tasks pending</span>
                </div>
              </div>
            </section>

            {/* Overview heading */}
            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-400">
                    System overview
                  </p>
                  <h2 className={`text-xl font-bold sm:text-2xl ${headingText}`}>
                    Your numbers, at a glance<span className="text-violet-400">.</span>
                  </h2>
                </div>

                <div className={`flex items-center gap-2 text-xs ${mutedText}`}>
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Data from your records
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <article
                      key={stat.label}
                      className={`group relative overflow-hidden rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 ${
                        surface
                      }`}
                      style={{ animationDelay: `${index * 70}ms` }}
                    >
                      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/[0.05] blur-2xl transition group-hover:bg-violet-500/10" />

                      <div className="relative flex items-start justify-between gap-3">
                        <div>
                          <p className={`text-xs font-medium ${mutedText}`}>
                            {stat.label}
                          </p>
                          <p
                            className={`mt-3 break-words text-3xl font-black tracking-tight ${
                              stat.label === "Most popular course"
                                ? "text-xl sm:text-2xl"
                                : headingText
                            }`}
                          >
                            {stat.value}
                          </p>
                        </div>

                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ${stat.accent}`}
                        >
                          <Icon className="text-lg" />
                        </div>
                      </div>

                      <div className="relative mt-5 flex items-center justify-between gap-2 border-t border-slate-500/10 pt-3">
                        <span className={`text-[11px] ${mutedText}`}>
                          {stat.description}
                        </span>
                        <span
                          className={`whitespace-nowrap text-[9px] font-bold tracking-wider ${stat.accent}`}
                        >
                          {stat.trend}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Quick navigation */}
            <section>
              <div className="mb-5">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                  Quick access
                </p>
                <h2 className={`text-xl font-bold sm:text-2xl ${headingText}`}>
                  Jump back into work<span className="text-cyan-400">.</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {quickLinks.map((link) => {
                  const Icon = link.icon;

                  return (
                    <button
                      key={link.title}
                      onClick={link.action}
                      className={`group flex items-center gap-4 rounded-2xl p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-violet-400/30 ${surface}`}
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${link.iconBg} ${link.accent}`}
                      >
                        <Icon className="text-xl" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className={`font-bold ${headingText}`}>
                          {link.title}
                        </h3>
                        <p className={`mt-1 text-xs leading-5 ${mutedText}`}>
                          {link.description}
                        </p>
                        <p className={`mt-2 text-[11px] ${mutedText}`}>
                          <span className={`font-bold ${link.accent}`}>
                            {link.count}
                          </span>{" "}
                          {link.unit}
                        </p>
                      </div>

                      <FaArrowRight
                        className={`shrink-0 text-xs transition group-hover:translate-x-1 ${mutedText}`}
                      />
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Student management */}
            <section id="student-management" className="scroll-mt-28">
              <div className="mb-5">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-400">
                  Learner management
                </p>
                <h2 className={`text-xl font-bold sm:text-2xl ${headingText}`}>
                  The student hub<span className="text-violet-400">.</span>
                </h2>
                <p className={`mt-2 text-sm ${mutedText}`}>
                  Add learners, manage existing records, and keep your
                  directory organized.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(300px,0.85fr)_minmax(0,1.65fr)]">
                <div className={`min-w-0 rounded-2xl p-5 sm:p-6 ${surface}`}>
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <FaPlus />
                    </div>
                    <div>
                      <h3 className={`font-bold ${headingText}`}>
                        {editingStudent ? "Edit student" : "Add a student"}
                      </h3>
                      <p className={`mt-1 text-xs ${mutedText}`}>
                        {editingStudent
                          ? "Update the selected learner's details."
                          : "Add a new learner to your directory."}
                      </p>
                    </div>
                  </div>

                  <AddStudent
                    editingStudent={editingStudent}
                    setEditingStudent={setEditingStudent}
                    fetchStudents={fetchStudents}
                  />
                </div>

                <div className={`min-w-0 overflow-hidden rounded-2xl p-5 sm:p-6 ${surface}`}>
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                        <FaUsers />
                      </div>
                      <div>
                        <h3 className={`font-bold ${headingText}`}>
                          Student directory
                        </h3>
                        <p className={`mt-1 text-xs ${mutedText}`}>
                          Your current student records
                        </p>
                      </div>
                    </div>

                    <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1.5 text-xs font-bold text-cyan-400">
                      {studentCount} total
                    </span>
                  </div>

                  <StudentList
                    students={students}
                    setEditingStudent={setEditingStudent}
                    fetchStudents={fetchStudents}
                  />
                </div>
              </div>
            </section>

            {/* Analytics and tasks */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <div className={`min-w-0 rounded-2xl p-5 sm:p-6 ${surface}`}>
                <div className="mb-5">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                    Insights
                  </p>
                  <h2 className={`text-lg font-bold ${headingText}`}>
                    Student analytics
                  </h2>
                  <p className={`mt-1 text-xs ${mutedText}`}>
                    Explore the distribution of your student records.
                  </p>
                </div>

                <StudentChart students={students} />
              </div>

              {/* Task manager */}
              <div
                id="admin-tasks"
                className={`scroll-mt-28 rounded-2xl p-5 sm:p-6 ${surface}`}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-400">
                      Personal productivity
                    </p>
                    <h2 className={`text-lg font-bold ${headingText}`}>
                      Quick tasks
                    </h2>
                    <p className={`mt-1 text-xs ${mutedText}`}>
                      Keep track of your next moves.
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <FaTasks className="text-lg" />
                  </div>
                </div>

                <div className="mb-5 flex gap-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(event) => setNewTask(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") addTask();
                    }}
                    placeholder="What's the next move?"
                    aria-label="New task"
                    className={`min-w-0 flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/10 ${
                      darkMode
                        ? "border-white/10 bg-[#0b0f1c] text-white"
                        : "border-slate-200 bg-slate-50 text-slate-900"
                    }`}
                  />

                  <button
                    onClick={addTask}
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-500"
                  >
                    <FaPlus className="text-xs" />
                    <span className="hidden sm:inline">Add task</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>

                <div className="mb-4 flex flex-wrap gap-3">
                  <span className={`rounded-lg px-3 py-2 text-xs ${subtleSurface} ${mutedText}`}>
                    <span className="font-bold text-violet-400">{tasks.length}</span>{" "}
                    total
                  </span>
                  <span className={`rounded-lg px-3 py-2 text-xs ${subtleSurface} ${mutedText}`}>
                    <span className="font-bold text-cyan-400">{pendingTasks}</span>{" "}
                    pending
                  </span>
                  <span className={`rounded-lg px-3 py-2 text-xs ${subtleSurface} ${mutedText}`}>
                    <span className="font-bold text-emerald-400">{completedTasks}</span>{" "}
                    done
                  </span>
                </div>

                <div className="space-y-2">
                  {tasks.length === 0 ? (
                    <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-9 text-center ${subtleSurface}`}>
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                        <FaClock />
                      </div>
                      <p className={`text-sm font-semibold ${headingText}`}>
                        A clean slate.
                      </p>
                      <p className={`mt-1 text-xs ${mutedText}`}>
                        Add a task and make your next move.
                      </p>
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`group flex items-center gap-3 rounded-xl border p-3 transition ${
                          darkMode
                            ? "border-white/[0.06] bg-white/[0.025] hover:bg-white/[0.05]"
                            : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                        }`}
                      >
                        <button
                          onClick={() => toggleTask(task.id)}
                          aria-label={
                            task.completed
                              ? "Mark task as incomplete"
                              : "Mark task as complete"
                          }
                          className={`shrink-0 text-lg transition ${
                            task.completed
                              ? "text-emerald-400"
                              : "text-slate-500 hover:text-violet-400"
                          }`}
                        >
                          {task.completed ? <FaCheckCircle /> : <FaCircle className="text-sm" />}
                        </button>

                        <span
                          className={`min-w-0 flex-1 break-words text-sm ${
                            task.completed
                              ? "text-slate-500 line-through"
                              : headingText
                          }`}
                        >
                          {task.text}
                        </span>

                        {task.completed && (
                          <span className="hidden text-[9px] font-bold uppercase tracking-wider text-emerald-400 sm:inline">
                            Done
                          </span>
                        )}

                        <button
                          onClick={() => deleteTask(task.id)}
                          aria-label="Delete task"
                          className="shrink-0 rounded-lg p-2 text-slate-500 opacity-100 transition hover:bg-rose-500/10 hover:text-rose-400 sm:opacity-0 sm:group-hover:opacity-100"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Recent students */}
            <section>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                    Recently listed
                  </p>
                  <h2 className={`text-xl font-bold sm:text-2xl ${headingText}`}>
                    Student activity<span className="text-cyan-400">.</span>
                  </h2>
                </div>

                <button
                  onClick={() =>
                    document
                      .getElementById("student-management")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-2 text-xs font-semibold text-violet-400 transition hover:text-cyan-400"
                >
                  Open directory
                  <FaArrowRight />
                </button>
              </div>

              <div className={`overflow-hidden rounded-2xl ${surface}`}>
                {recentStudents.length === 0 ? (
                  <div className={`px-5 py-10 text-center text-sm ${mutedText}`}>
                    No student records to display yet. Add a student to get
                    started.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-500/10">
                    {recentStudents.map((student, index) => {
                      const studentName =
                        student.name ||
                        student.fullName ||
                        student.email ||
                        "Student";

                      return (
                        <div
                          key={student._id || student.id || student.email || index}
                          className={`flex items-center gap-3 px-4 py-4 transition sm:px-5 ${
                            darkMode
                              ? "hover:bg-white/[0.025]"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                              index % 3 === 0
                                ? "bg-violet-500/10 text-violet-400"
                                : index % 3 === 1
                                  ? "bg-cyan-400/10 text-cyan-400"
                                  : "bg-emerald-400/10 text-emerald-400"
                            }`}
                          >
                            {String(studentName).charAt(0).toUpperCase()}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className={`truncate text-sm font-semibold ${headingText}`}>
                              {studentName}
                            </p>
                            <p className={`mt-1 truncate text-xs ${mutedText}`}>
                              {student.course || "Course not specified"}
                              {student.year ? ` · Year ${student.year}` : ""}
                            </p>
                          </div>

                          <span className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-semibold text-emerald-400 sm:inline-flex">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            In directory
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>

            {/* Footer */}
            <footer
              className={`flex flex-col gap-3 border-t py-6 text-xs sm:flex-row sm:items-center sm:justify-between ${
                darkMode
                  ? "border-white/[0.08] text-slate-500"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              <p>
                <span className={`font-bold ${headingText}`}>EduNexus</span>
                <span className="mx-2">/</span>
                Built for better learning management.
              </p>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Admin workspace
                <span className="mx-1 text-slate-600">·</span>
                <span className="font-mono">EDU // CONTROL</span>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;