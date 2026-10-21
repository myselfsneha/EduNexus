
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
  FaCheckCircle,
  FaPlus,
  FaTrash,
  FaBell,
  FaArrowRight,
  FaClock,
  FaGraduationCap,
} from "react-icons/fa";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [profileError, setProfileError] = useState(false);

  const { darkMode } = useTheme();

  const isDark = Boolean(darkMode);

  const pageBg = isDark
    ? "bg-[#080d1b] text-slate-100"
    : "bg-slate-50 text-slate-900";

  const cardBg = isDark
    ? "border-white/10 bg-[#111a2e]"
    : "border-slate-200 bg-white";

  const mutedText = isDark ? "text-slate-400" : "text-slate-500";

  const inputStyle = isDark
    ? "border-white/10 bg-[#0b1222] text-white placeholder:text-slate-500 focus:border-violet-400"
    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-violet-500";

  useEffect(() => {
    fetchProfile();

    try {
      const savedTasks = JSON.parse(
        localStorage.getItem("studentTasks") || "[]"
      );

      setTasks(Array.isArray(savedTasks) ? savedTasks : []);
    } catch {
      setTasks([]);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      setStudent(res.data.user);
      setProfileError(false);
    } catch (error) {
      console.error("Failed to fetch student profile:", error);
      setProfileError(true);
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

  const addTask = (event) => {
    event?.preventDefault();

    const trimmedTask = newTask.trim();

    if (!trimmedTask) return;

    const updatedTasks = [
      ...tasks,
      {
        id: Date.now(),
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
        ? {
            ...task,
            completed: !task.completed,
          }
        : task
    );

    saveTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    saveTasks(tasks.filter((task) => task.id !== id));
  };

  const attendancePercentage = 88;

  const notifications = [
    {
      id: 1,
      title: "Attendance updated successfully",
      detail: "Your attendance record is ready to review.",
      icon: FaCalendarAlt,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      id: 2,
      title: "New course available",
      detail: "Explore the latest learning opportunities.",
      icon: FaBook,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      id: 3,
      title: "Fee status verified",
      detail: "Your fee status has been verified.",
      icon: FaCheckCircle,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
  ];

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.length - completedTasks;

  const joinedDate = student?.created_at
    ? new Date(student.created_at)
    : null;

  const formattedJoinedDate =
    joinedDate && !Number.isNaN(joinedDate.getTime())
      ? joinedDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Not available";

  if (!student && !profileError) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center px-6 ${pageBg}`}
      >
        <div className="flex w-full max-w-sm flex-col items-center rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 p-10 text-center shadow-2xl shadow-violet-950/10">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 text-2xl text-white shadow-lg shadow-violet-500/20">
            <FaGraduationCap />
          </div>

          <div className="mb-5 h-9 w-9 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />

          <h2 className="text-xl font-bold">
            Preparing your dashboard
          </h2>

          <p className={`mt-2 text-sm ${mutedText}`}>
            Fetching your student profile...
          </p>

          <p className="mt-5 text-xs font-semibold tracking-[0.2em] text-violet-400">
            EDUNEXUS
          </p>
        </div>
      </div>
    );
  }

  if (profileError || !student) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center px-6 ${pageBg}`}
      >
        <div
          className={`w-full max-w-md rounded-3xl border p-8 text-center shadow-xl ${cardBg}`}
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-2xl text-red-400">
            <FaUserCircle />
          </div>

          <h2 className="text-2xl font-bold">
            Couldn't load your profile
          </h2>

          <p className={`mt-3 text-sm leading-6 ${mutedText}`}>
            We couldn't retrieve your student information. Check your
            connection or sign in again.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setProfileError(false);
                fetchProfile();
              }}
              className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              Try again
            </button>

            <button
              onClick={handleLogout}
              className={`rounded-xl border px-5 py-3 text-sm font-bold transition ${
                isDark
                  ? "border-white/10 hover:bg-white/5"
                  : "border-slate-200 hover:bg-slate-100"
              }`}
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Account role",
      value: student.role || "Student",
      icon: FaUserGraduate,
      accent: "from-violet-500 to-indigo-500",
      iconBg: "bg-violet-500/10 text-violet-400",
      capitalize: true,
    },
    {
      label: "Email address",
      value: student.email || "Not available",
      icon: FaEnvelope,
      accent: "from-cyan-500 to-blue-500",
      iconBg: "bg-cyan-500/10 text-cyan-400",
      compact: true,
    },
    {
      label: "Member since",
      value: formattedJoinedDate,
      icon: FaCalendarAlt,
      accent: "from-fuchsia-500 to-pink-500",
      iconBg: "bg-fuchsia-500/10 text-fuchsia-400",
    },
    {
      label: "Student ID",
      value: `#${student.id ?? "—"}`,
      icon: FaBook,
      accent: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-500/10 text-amber-400",
    },
    {
      label: "Tasks completed",
      value: `${completedTasks}/${tasks.length}`,
      icon: FaTasks,
      accent: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500/10 text-emerald-400",
    },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${pageBg}`}>
      {/* Top navigation */}
      <header
        className={`sticky top-0 z-30 border-b backdrop-blur-xl ${
          isDark
            ? "border-white/10 bg-[#080d1b]/90"
            : "border-slate-200 bg-white/90"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-xl text-white shadow-lg shadow-violet-500/20">
              <FaGraduationCap />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-black tracking-tight sm:text-xl">
                EduNexus
                <span className="ml-2 hidden font-medium text-violet-400 sm:inline">
                  / Student Portal
                </span>
              </h1>

              <p className={`text-xs ${mutedText}`}>
                Your learning space
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2.5 text-sm font-bold text-red-400 transition hover:border-red-500/40 hover:bg-red-500/15 sm:px-4"
              aria-label="Log out"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        {/* Welcome hero */}
        <section className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#17143b] via-[#25205a] to-[#07556c] p-6 shadow-2xl shadow-violet-950/15 sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-3xl text-white shadow-lg backdrop-blur-md sm:h-20 sm:w-20 sm:text-4xl">
                <FaUserCircle />
              </div>

              <div className="min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold tracking-wide text-cyan-200">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  STUDENT WORKSPACE
                </div>

                <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Hey, {student.name || "Student"}{" "}
                  <span className="inline-block">👋</span>
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-100/80 sm:text-base">
                  Your next chapter starts here. Keep track of your
                  academic information, stay on top of your tasks, and
                  keep moving forward.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-medium text-indigo-100/80 sm:text-sm">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                    <FaUserGraduate className="text-cyan-300" />
                    {student.role || "Student"}
                  </span>

                  <span className="inline-flex min-w-0 items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                    <FaEnvelope className="shrink-0 text-violet-300" />
                    <span className="max-w-[220px] truncate">
                      {student.email}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 rounded-2xl border border-white/10 bg-black/15 p-5 backdrop-blur-md md:min-w-44">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-200/80">
                Your progress
              </p>

              <div className="mt-2 flex items-end gap-2">
                <span className="text-4xl font-black text-white">
                  {completedTasks}
                </span>
                <span className="mb-1 text-sm text-indigo-100/70">
                  tasks done
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 to-cyan-300 transition-all duration-500"
                  style={{
                    width: `${
                      tasks.length
                        ? (completedTasks / tasks.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <p className="mt-2 text-xs text-indigo-100/60">
                {pendingTasks} tasks left to tackle
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-10">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                Your overview
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                At a glance<span className="text-violet-400">.</span>
              </h2>
            </div>

            <p className={`text-sm ${mutedText}`}>
              Your academic snapshot
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {statCards.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.label}
                  className={`group relative overflow-hidden rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    isDark
                      ? "border-white/10 bg-[#111a2e] hover:border-violet-400/30 hover:shadow-violet-950/20"
                      : "border-slate-200 bg-white hover:border-violet-200 hover:shadow-violet-100"
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${stat.accent} opacity-80`}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${stat.iconBg}`}
                    >
                      <Icon />
                    </div>

                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        isDark
                          ? "bg-white/5 text-slate-500"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      Profile
                    </span>
                  </div>

                  <p className={`mt-5 text-sm ${mutedText}`}>
                    {stat.label}
                  </p>

                  <p
                    className={`mt-1 break-words font-black ${
                      stat.compact
                        ? "text-sm sm:text-base"
                        : "text-2xl"
                    } ${
                      stat.capitalize ? "capitalize" : ""
                    }`}
                  >
                    {stat.value}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Main information grid */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Profile */}
          <article
            className={`overflow-hidden rounded-3xl border shadow-sm ${cardBg}`}
          >
            <div className="border-b border-violet-500/10 bg-gradient-to-r from-violet-500/10 to-cyan-500/5 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <FaUserCircle className="text-lg" />
                </div>

                <div>
                  <h3 className="font-bold">My profile</h3>
                  <p className={`text-xs ${mutedText}`}>
                    Your account details
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center border-b border-dashed border-slate-500/20 pb-6 text-center">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 text-3xl text-white shadow-lg shadow-violet-500/20">
                  <FaUserGraduate />
                </div>

                <h4 className="text-xl font-black">
                  {student.name || "Student"}
                </h4>

                <p className={`mt-1 break-all text-sm ${mutedText}`}>
                  {student.email}
                </p>

                <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Account active
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className={`text-sm ${mutedText}`}>
                    Student ID
                  </span>
                  <span className="font-bold">
                    #{student.id ?? "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className={`text-sm ${mutedText}`}>
                    Account role
                  </span>
                  <span className="rounded-lg bg-violet-500/10 px-3 py-1 text-sm font-bold capitalize text-violet-400">
                    {student.role || "Student"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className={`text-sm ${mutedText}`}>
                    Joined
                  </span>
                  <span className="text-right text-sm font-semibold">
                    {formattedJoinedDate}
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* Attendance */}
          <article
            className={`overflow-hidden rounded-3xl border shadow-sm ${cardBg}`}
          >
            <div className="border-b border-violet-500/10 bg-gradient-to-r from-cyan-500/10 to-emerald-500/5 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <FaCalendarAlt className="text-lg" />
                </div>

                <div>
                  <h3 className="font-bold">Attendance</h3>
                  <p className={`text-xs ${mutedText}`}>
                    Your attendance snapshot
                  </p>
                </div>
              </div>
            </div>

            <div className="flex h-[calc(100%-81px)] flex-col justify-center p-6">
              <div className="flex flex-col items-center py-4 text-center">
                <div className="relative flex h-44 w-44 items-center justify-center">
                  <svg
                    viewBox="0 0 160 160"
                    className="h-full w-full -rotate-90"
                    aria-label={`${attendancePercentage}% attendance`}
                    role="img"
                  >
                    <circle
                      cx="80"
                      cy="80"
                      r="66"
                      fill="none"
                      stroke={isDark ? "#263247" : "#e2e8f0"}
                      strokeWidth="12"
                    />

                    <circle
                      cx="80"
                      cy="80"
                      r="66"
                      fill="none"
                      stroke="url(#attendanceGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 66}`}
                      strokeDashoffset={`${
                        2 *
                        Math.PI *
                        66 *
                        (1 - attendancePercentage / 100)
                      }`}
                      className="transition-all duration-1000"
                    />

                    <defs>
                      <linearGradient
                        id="attendanceGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#22d3ee" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black">
                      {attendancePercentage}%
                    </span>
                    <span className={`mt-1 text-xs ${mutedText}`}>
                      Attendance
                    </span>
                  </div>
                </div>

                <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                  <FaCheckCircle />
                  Great consistency!
                </span>

                <p className={`mt-4 max-w-xs text-sm leading-6 ${mutedText}`}>
                  You're building a strong attendance record. Keep
                  showing up and stay consistent with your learning.
                </p>
              </div>

              <div
                className={`mt-3 rounded-xl border p-4 ${
                  isDark
                    ? "border-white/5 bg-white/[0.03]"
                    : "border-slate-100 bg-slate-50"
                }`}
              >
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className={mutedText}>Attendance target</span>
                  <span className="font-bold">75%</span>
                </div>

                <div
                  className={`h-2 overflow-hidden rounded-full ${
                    isDark ? "bg-slate-800" : "bg-slate-200"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: "75%" }}
                  />
                </div>

                <p className="mt-2 text-xs font-medium text-emerald-400">
                  {attendancePercentage - 75}% above the target
                </p>
              </div>
            </div>
          </article>

          {/* Notifications */}
          <article
            className={`overflow-hidden rounded-3xl border shadow-sm ${cardBg}`}
          >
            <div className="border-b border-violet-500/10 bg-gradient-to-r from-fuchsia-500/10 to-violet-500/5 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
                  <FaBell className="text-lg" />
                </div>

                <div>
                  <h3 className="font-bold">Notifications</h3>
                  <p className={`text-xs ${mutedText}`}>
                    A few things to know
                  </p>
                </div>

                <span className="ml-auto flex h-7 min-w-7 items-center justify-center rounded-full bg-violet-500/10 px-2 text-xs font-bold text-violet-400">
                  {notifications.length}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-5 sm:p-6">
              {notifications.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.id}
                    className={`flex gap-3 rounded-2xl border p-4 transition ${
                      isDark
                        ? "border-white/5 bg-white/[0.025] hover:bg-white/[0.05]"
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.color}`}
                    >
                      <Icon />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-bold leading-5">
                        {item.title}
                      </p>

                      <p className={`mt-1 text-xs leading-5 ${mutedText}`}>
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}

              <div
                className={`flex items-center gap-2 px-1 pt-1 text-xs ${mutedText}`}
              >
                <FaClock className="text-violet-400" />
                You're all caught up on your current updates.
              </div>
            </div>
          </article>
        </section>

        {/* Task manager */}
        <section
          className={`mt-8 overflow-hidden rounded-3xl border shadow-sm ${cardBg}`}
        >
          <div className="flex flex-col justify-between gap-5 border-b border-violet-500/10 bg-gradient-to-r from-violet-500/10 via-transparent to-cyan-500/5 px-5 py-6 sm:flex-row sm:items-center sm:px-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-500/10 text-xl text-violet-400">
                <FaTasks />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-400">
                  Stay on track
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight">
                  My tasks<span className="text-violet-400">.</span>
                </h2>

                <p className={`mt-1 text-sm ${mutedText}`}>
                  Small steps. Big progress.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <div
                className={`rounded-xl border px-4 py-3 ${
                  isDark
                    ? "border-white/5 bg-white/[0.03]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className={`text-xs ${mutedText}`}>Pending</p>
                <p className="mt-1 text-xl font-black text-amber-400">
                  {pendingTasks}
                </p>
              </div>

              <div
                className={`rounded-xl border px-4 py-3 ${
                  isDark
                    ? "border-white/5 bg-white/[0.03]"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className={`text-xs ${mutedText}`}>Completed</p>
                <p className="mt-1 text-xl font-black text-emerald-400">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.65fr)]">
            <div>
              <form
                onSubmit={addTask}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="text"
                  value={newTask}
                  onChange={(event) => setNewTask(event.target.value)}
                  placeholder="What do you need to get done?"
                  aria-label="New task"
                  className={`min-w-0 flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-violet-500/20 ${inputStyle}`}
                />

                <button
                  type="submit"
                  disabled={!newTask.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/15 transition hover:-translate-y-0.5 hover:shadow-violet-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaPlus />
                  Add task
                </button>
              </form>

              <div className="mt-5 space-y-3">
                {tasks.length === 0 ? (
                  <div
                    className={`rounded-2xl border border-dashed p-8 text-center ${
                      isDark
                        ? "border-white/10 bg-white/[0.02]"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-xl text-violet-400">
                      <FaTasks />
                    </div>

                    <h3 className="mt-4 font-bold">A fresh start!</h3>

                    <p className={`mt-2 text-sm ${mutedText}`}>
                      Add your first task and start building momentum.
                    </p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 rounded-2xl border p-4 transition ${
                        isDark
                          ? "border-white/5 bg-white/[0.025] hover:border-violet-500/20"
                          : "border-slate-100 bg-slate-50 hover:border-violet-200 hover:bg-white"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        aria-label={
                          task.completed
                            ? `Mark ${task.text} as pending`
                            : `Complete ${task.text}`
                        }
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
                          task.completed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : isDark
                              ? "border-slate-600 hover:border-violet-400"
                              : "border-slate-300 hover:border-violet-500"
                        }`}
                      >
                        {task.completed && (
                          <FaCheckCircle className="text-sm" />
                        )}
                      </button>

                      <span
                        className={`min-w-0 flex-1 break-words text-sm font-medium transition ${
                          task.completed
                            ? `line-through ${mutedText}`
                            : ""
                        }`}
                      >
                        {task.text}
                      </span>

                      <button
                        type="button"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Delete ${task.text}`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Task progress panel */}
            <aside
              className={`flex flex-col justify-between rounded-2xl border p-5 sm:p-6 ${
                isDark
                  ? "border-violet-500/15 bg-gradient-to-br from-violet-500/[0.08] to-cyan-500/[0.04]"
                  : "border-violet-100 bg-gradient-to-br from-violet-50 to-cyan-50"
              }`}
            >
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-lg text-white">
                  <FaGraduationCap />
                </div>

                <h3 className="mt-5 text-xl font-black">
                  Progress, not perfection.
                </h3>

                <p className={`mt-2 text-sm leading-6 ${mutedText}`}>
                  Keep your next step clear. Every task you finish
                  brings you a little closer to your goals.
                </p>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className={mutedText}>Overall completion</span>
                    <span className="font-black text-violet-400">
                      {tasks.length
                        ? Math.round(
                            (completedTasks / tasks.length) * 100
                          )
                        : 0}
                      %
                    </span>
                  </div>

                  <div
                    className={`h-3 overflow-hidden rounded-full ${
                      isDark ? "bg-slate-800" : "bg-white"
                    }`}
                  >
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all duration-500"
                      style={{
                        width: `${
                          tasks.length
                            ? (completedTasks / tasks.length) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div
                className={`mt-7 flex items-start gap-3 rounded-xl border p-4 ${
                  isDark
                    ? "border-white/5 bg-black/10"
                    : "border-white/80 bg-white/70"
                }`}
              >
                <FaArrowRight className="mt-1 shrink-0 text-violet-400" />

                <p className={`text-sm leading-6 ${mutedText}`}>
                  <span className="font-bold text-violet-400">
                    Pro tip:
                  </span>{" "}
                  Break big assignments into smaller tasks. They're
                  easier to start and even better to finish.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`mt-10 flex flex-col items-center justify-between gap-3 border-t py-6 text-center text-xs sm:flex-row sm:text-left ${
            isDark
              ? "border-white/10 text-slate-500"
              : "border-slate-200 text-slate-500"
          }`}
        >
          <p>
            <span className="font-black tracking-wide text-violet-400">
              EDUNEXUS
            </span>{" "}
            <span className="mx-1">·</span>
            Your learning ecosystem.
          </p>

          <p>Learn something. Build something. Repeat. ✦</p>
        </footer>
      </main>
    </div>
  );
}

export default StudentDashboard;