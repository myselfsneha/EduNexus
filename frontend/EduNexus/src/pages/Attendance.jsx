
import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../api";
import { useTheme } from "../context/ThemeContext";

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) return "—";

  const dateString = String(value).slice(0, 10);
  const parts = dateString.split("-");

  if (parts.length !== 3) return String(value);

  const [year, month, day] = parts;

  if (!year || !month || !day) return String(value);

  return `${day}/${month}/${year}`;
}

function Attendance() {
  const { darkMode } = useTheme();

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [formData, setFormData] = useState({
    student_id: "",
    date: getLocalDate(),
    status: "Present",
  });

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingAttendance, setLoadingAttendance] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  const [message, setMessage] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoadingStudents(true);

    try {
      const res = await API.get("/students");
      setStudents(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      setMessage({
        type: "error",
        text: "Unable to load students. Please refresh and try again.",
      });
    } finally {
      setLoadingStudents(false);
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    setLoadingAttendance(true);

    try {
      const res = await API.get("/attendance");
      setAttendance(
        Array.isArray(res.data?.data) ? res.data.data : []
      );
    } catch (error) {
      console.error("Failed to fetch attendance:", error);
      setMessage({
        type: "error",
        text: "Unable to load attendance records. Please try again.",
      });
    } finally {
      setLoadingAttendance(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, [fetchStudents, fetchAttendance]);

  const updateForm = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);

    if (!formData.student_id || !formData.date || !formData.status) {
      setMessage({
        type: "error",
        text: "Please complete all attendance fields.",
      });
      return;
    }

    setSubmitting(true);

    try {
      await API.post("/attendance", formData);

      setFormData({
        student_id: "",
        date: getLocalDate(),
        status: "Present",
      });

      setMessage({
        type: "success",
        text: "Attendance marked successfully!",
      });

      await fetchAttendance();
    } catch (error) {
      console.error("Failed to mark attendance:", error);

      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to mark attendance. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAttendance = useMemo(() => {
    const query = search.trim().toLowerCase();

    return attendance.filter((record) => {
      const student = students.find(
        (item) => String(item.id) === String(record.student_id)
      );

      const studentName = student?.name || "";
      const studentEmail = student?.email || "";
      const recordDate = String(record.date || "").slice(0, 10);
      const recordStatus = String(record.status || "");

      const matchesSearch =
        !query ||
        String(record.student_id ?? "").toLowerCase().includes(query) ||
        studentName.toLowerCase().includes(query) ||
        studentEmail.toLowerCase().includes(query) ||
        recordDate.toLowerCase().includes(query) ||
        recordStatus.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || recordStatus === statusFilter;

      const matchesDate =
        !selectedDate || recordDate === selectedDate;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [attendance, students, search, statusFilter, selectedDate]);

  const presentCount = attendance.filter(
    (record) => record.status === "Present"
  ).length;

  const absentCount = attendance.filter(
    (record) => record.status === "Absent"
  ).length;

  const attendanceRate =
    attendance.length > 0
      ? Math.round((presentCount / attendance.length) * 100)
      : 0;

  const panelClass = darkMode
    ? "border-white/10 bg-[#111a2e]/90"
    : "border-slate-200 bg-white";

  const headingClass = darkMode ? "text-white" : "text-slate-900";

  const mutedClass = darkMode ? "text-slate-400" : "text-slate-500";

  const inputClass = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 ${
    darkMode
      ? "border-white/10 bg-[#0b1222] text-white placeholder:text-slate-500"
      : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
  }`;

  const statCards = [
    {
      label: "Total Records",
      value: attendance.length,
      detail: "All recorded entries",
      icon: "▤",
      color: "violet",
    },
    {
      label: "Present",
      value: presentCount,
      detail: "Marked present",
      icon: "✓",
      color: "emerald",
    },
    {
      label: "Absent",
      value: absentCount,
      detail: "Marked absent",
      icon: "×",
      color: "rose",
    },
    {
      label: "Attendance Rate",
      value: `${attendanceRate}%`,
      detail: "Of recorded entries",
      icon: "↗",
      color: "cyan",
    },
  ];

  const statColors = {
    violet: darkMode
      ? "border-violet-400/20 bg-violet-400/10 text-violet-300"
      : "border-violet-100 bg-violet-50 text-violet-600",
    emerald: darkMode
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : "border-emerald-100 bg-emerald-50 text-emerald-600",
    rose: darkMode
      ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
      : "border-rose-100 bg-rose-50 text-rose-600",
    cyan: darkMode
      ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
      : "border-cyan-100 bg-cyan-50 text-cyan-700",
  };

  return (
    <div
      className={`min-h-screen px-4 py-6 transition-colors duration-300 sm:px-6 lg:px-8 lg:py-8 ${
        darkMode ? "bg-[#080d1b]" : "bg-slate-50"
      }`}
    >
      <div className="mx-auto max-w-[1440px]">
        {/* Page heading */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-400">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              Admin workspace
            </div>

            <h1
              className={`text-3xl font-black tracking-tight sm:text-4xl ${headingClass}`}
            >
              Attendance{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>

            <p className={`mt-2 max-w-2xl text-sm leading-6 ${mutedClass}`}>
              Track student attendance, record daily status, and review
              attendance history in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setMessage(null);
              fetchStudents();
              fetchAttendance();
            }}
            disabled={loadingStudents || loadingAttendance}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-3 text-sm font-bold text-violet-400 transition hover:bg-violet-500/15 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
          >
            <span aria-hidden="true">↻</span>
            Refresh data
          </button>
        </header>

        {/* Feedback */}
        {message && (
          <div
            role="status"
            className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-sm ${
              message.type === "success"
                ? darkMode
                  ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
                : darkMode
                  ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
                  : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            <span className="font-bold" aria-hidden="true">
              {message.type === "success" ? "✓" : "!"}
            </span>
            <p>{message.text}</p>
            <button
              type="button"
              onClick={() => setMessage(null)}
              className="ml-auto font-bold opacity-70 hover:opacity-100"
              aria-label="Dismiss message"
            >
              ×
            </button>
          </div>
        )}

        {/* Summary cards */}
        <section
          aria-label="Attendance summary"
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg ${panelClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-sm font-medium ${mutedClass}`}>
                    {stat.label}
                  </p>
                  <p
                    className={`mt-3 text-3xl font-black tracking-tight ${headingClass}`}
                  >
                    {loadingAttendance ? "—" : stat.value}
                  </p>
                  <p className={`mt-1 text-xs ${mutedClass}`}>
                    {stat.detail}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border text-xl font-bold ${statColors[stat.color]}`}
                  aria-hidden="true"
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Mark attendance */}
        <section
          className={`mb-8 overflow-hidden rounded-3xl border shadow-sm ${panelClass}`}
        >
          <div
            className={`border-b px-5 py-5 sm:px-7 ${
              darkMode ? "border-white/10" : "border-slate-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-violet-500/20">
                +
              </div>
              <div>
                <h2 className={`text-lg font-bold ${headingClass}`}>
                  Mark Attendance
                </h2>
                <p className={`mt-1 text-sm ${mutedClass}`}>
                  Add an attendance record for a student.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <label
                  htmlFor="attendance-student"
                  className={`mb-2 block text-sm font-semibold ${headingClass}`}
                >
                  Student <span className="text-rose-500">*</span>
                </label>

                <select
                  id="attendance-student"
                  value={formData.student_id}
                  onChange={(event) =>
                    updateForm("student_id", event.target.value)
                  }
                  className={inputClass}
                  required
                  disabled={loadingStudents || submitting}
                >
                  <option value="">
                    {loadingStudents
                      ? "Loading students..."
                      : students.length
                        ? "Select a student"
                        : "No students available"}
                  </option>

                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} · ID {student.id}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="attendance-date"
                  className={`mb-2 block text-sm font-semibold ${headingClass}`}
                >
                  Attendance Date <span className="text-rose-500">*</span>
                </label>

                <input
                  id="attendance-date"
                  type="date"
                  value={formData.date}
                  onChange={(event) =>
                    updateForm("date", event.target.value)
                  }
                  className={inputClass}
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label
                  htmlFor="attendance-status"
                  className={`mb-2 block text-sm font-semibold ${headingClass}`}
                >
                  Status <span className="text-rose-500">*</span>
                </label>

                <select
                  id="attendance-status"
                  value={formData.status}
                  onChange={(event) =>
                    updateForm("status", event.target.value)
                  }
                  className={inputClass}
                  required
                  disabled={submitting}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    loadingStudents ||
                    students.length === 0
                  }
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                        aria-hidden="true"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <span aria-hidden="true">✓</span>
                      Mark Attendance
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className={`mt-4 text-xs ${mutedClass}`}>
              Fields marked with * are required. Records are saved through
              the existing EduNexus attendance API.
            </p>
          </form>
        </section>

        {/* Attendance records */}
        <section
          className={`overflow-hidden rounded-3xl border shadow-sm ${panelClass}`}
        >
          <div
            className={`border-b px-5 py-5 sm:px-7 ${
              darkMode ? "border-white/10" : "border-slate-100"
            }`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className={`text-lg font-bold ${headingClass}`}>
                  Attendance Records
                </h2>
                <p className={`mt-1 text-sm ${mutedClass}`}>
                  Browse, search, and filter recorded attendance.
                </p>
              </div>

              <span
                className={`inline-flex w-fit items-center rounded-full border px-3 py-1.5 text-xs font-bold ${
                  darkMode
                    ? "border-white/10 bg-white/5 text-slate-300"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {filteredAttendance.length}{" "}
                {filteredAttendance.length === 1 ? "record" : "records"}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="relative md:col-span-1">
                <span
                  className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${mutedClass}`}
                  aria-hidden="true"
                >
                  ⌕
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search student, ID, or status..."
                  aria-label="Search attendance records"
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div>
                <label htmlFor="filter-status" className="sr-only">
                  Filter by status
                </label>
                <select
                  id="filter-status"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className={inputClass}
                >
                  <option value="All">All statuses</option>
                  <option value="Present">Present only</option>
                  <option value="Absent">Absent only</option>
                </select>
              </div>

              <div>
                <label htmlFor="filter-date" className="sr-only">
                  Filter by date
                </label>
                <input
                  id="filter-date"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className={inputClass}
                  aria-label="Filter attendance by date"
                />
              </div>
            </div>

            {(search || statusFilter !== "All" || selectedDate) && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setSelectedDate("");
                }}
                className="mt-3 text-xs font-bold text-violet-400 transition hover:text-violet-300"
              >
                Clear all filters ×
              </button>
            )}
          </div>

          {loadingAttendance ? (
            <div className="flex flex-col items-center justify-center px-6 py-16">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-violet-500/20 border-t-violet-500" />
              <p className={`mt-4 text-sm ${mutedClass}`}>
                Loading attendance records...
              </p>
            </div>
          ) : filteredAttendance.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${
                  darkMode
                    ? "bg-white/5 text-slate-400"
                    : "bg-slate-100 text-slate-400"
                }`}
                aria-hidden="true"
              >
                ▤
              </div>

              <h3 className={`text-base font-bold ${headingClass}`}>
                {attendance.length === 0
                  ? "No attendance records yet"
                  : "No matching records"}
              </h3>

              <p className={`mt-2 max-w-sm text-sm leading-6 ${mutedClass}`}>
                {attendance.length === 0
                  ? "Once you mark attendance for a student, their records will appear here."
                  : "Try changing your search or filters to find the records you need."}
              </p>

              {attendance.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setSelectedDate("");
                  }}
                  className="mt-4 rounded-xl bg-violet-500/10 px-4 py-2.5 text-sm font-bold text-violet-400 transition hover:bg-violet-500/15"
                >
                  Reset filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                {filteredAttendance.map((record, index) => {
                  const student = students.find(
                    (item) =>
                      String(item.id) === String(record.student_id)
                  );

                  const isPresent = record.status === "Present";

                  return (
                    <article
                      key={record.id ?? `${record.student_id}-${record.date}-${index}`}
                      className={`rounded-2xl border p-4 ${
                        darkMode
                          ? "border-white/10 bg-white/[0.02]"
                          : "border-slate-100 bg-slate-50/70"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className={`truncate font-bold ${headingClass}`}>
                            {student?.name || `Student #${record.student_id}`}
                          </p>
                          <p className={`mt-1 text-xs ${mutedClass}`}>
                            Student ID: {record.student_id ?? "—"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                            isPresent
                              ? darkMode
                                ? "bg-emerald-400/10 text-emerald-300"
                                : "bg-emerald-50 text-emerald-700"
                              : darkMode
                                ? "bg-rose-400/10 text-rose-300"
                                : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {record.status || "Unknown"}
                        </span>
                      </div>

                      <div
                        className={`mt-4 border-t pt-3 text-xs ${
                          darkMode
                            ? "border-white/10 text-slate-400"
                            : "border-slate-200 text-slate-500"
                        }`}
                      >
                        <span className="font-semibold">Date:</span>{" "}
                        {formatDate(record.date)}
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr
                      className={`text-xs uppercase tracking-wider ${
                        darkMode
                          ? "bg-white/[0.03] text-slate-400"
                          : "bg-slate-50 text-slate-500"
                      }`}
                    >
                      <th className="px-6 py-4 font-bold">Student</th>
                      <th className="px-6 py-4 font-bold">Student ID</th>
                      <th className="px-6 py-4 font-bold">Date</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAttendance.map((record, index) => {
                      const student = students.find(
                        (item) =>
                          String(item.id) === String(record.student_id)
                      );

                      const isPresent = record.status === "Present";

                      return (
                        <tr
                          key={record.id ?? `${record.student_id}-${record.date}-${index}`}
                          className={`border-t transition-colors ${
                            darkMode
                              ? "border-white/[0.06] hover:bg-white/[0.025]"
                              : "border-slate-100 hover:bg-slate-50/80"
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-sm font-black text-violet-400">
                                {(student?.name || "S")
                                  .trim()
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div className="min-w-0">
                                <p
                                  className={`font-semibold ${headingClass}`}
                                >
                                  {student?.name ||
                                    `Student #${record.student_id}`}
                                </p>
                                {student?.email && (
                                  <p
                                    className={`mt-0.5 truncate text-xs ${mutedClass}`}
                                  >
                                    {student.email}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          <td
                            className={`px-6 py-4 text-sm ${mutedClass}`}
                          >
                            {record.student_id ?? "—"}
                          </td>

                          <td
                            className={`px-6 py-4 text-sm ${mutedClass}`}
                          >
                            {formatDate(record.date)}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                                isPresent
                                  ? darkMode
                                    ? "bg-emerald-400/10 text-emerald-300"
                                    : "bg-emerald-50 text-emerald-700"
                                  : darkMode
                                    ? "bg-rose-400/10 text-rose-300"
                                    : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isPresent
                                    ? "bg-emerald-500"
                                    : "bg-rose-500"
                                }`}
                              />
                              {record.status || "Unknown"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div
            className={`flex flex-col gap-2 border-t px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-7 ${
              darkMode
                ? "border-white/10 text-slate-500"
                : "border-slate-100 text-slate-400"
            }`}
          >
            <span>EduNexus · Attendance Management</span>
            <span>Showing {filteredAttendance.length} of {attendance.length} records</span>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Attendance;