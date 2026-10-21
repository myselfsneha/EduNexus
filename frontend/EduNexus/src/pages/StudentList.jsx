
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import API from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaFileExcel,
  FaFilePdf,
  FaEye,
  FaTimes,
  FaGraduationCap,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope,
  FaPhone,
  FaBook,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDownload,
  FaUserGraduate,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const STUDENTS_PER_PAGE = 5;

function StudentList({
  setEditingStudent,
  students = [],
  fetchStudents,
}) {
  const role = localStorage.getItem("role");
  const themeContext = useTheme();

  // Supports common ThemeContext return shapes.
  const isDark =
    themeContext?.darkMode ??
    themeContext?.isDark ??
    themeContext?.isDarkMode ??
    themeContext?.theme === "dark";

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const colors = {
    page: isDark ? "bg-[#080b16] text-slate-100" : "bg-slate-50 text-slate-900",
    panel: isDark
      ? "bg-[#111629] border-slate-800"
      : "bg-white border-slate-200",
    muted: isDark ? "text-slate-400" : "text-slate-500",
    input: isDark
      ? "bg-[#0b1020] border-slate-700 text-white placeholder:text-slate-500 focus:border-violet-500"
      : "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-violet-500",
    row: isDark
      ? "border-slate-800 hover:bg-violet-500/5"
      : "border-slate-100 hover:bg-violet-50/70",
    heading: isDark ? "text-white" : "text-slate-900",
    subtle: isDark ? "text-slate-300" : "text-slate-700",
    modal: isDark
      ? "bg-[#111629] border border-slate-700 text-white"
      : "bg-white text-slate-900",
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return students;

    return students.filter((student) =>
      [
        student.name,
        student.email,
        student.course,
        student.year,
        student.phone,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      )
    );
  }, [students, search]);

  const totalPages = Math.ceil(
    filteredStudents.length / STUDENTS_PER_PAGE
  );

  const safePage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const currentStudents = filteredStudents.slice(
    (safePage - 1) * STUDENTS_PER_PAGE,
    safePage * STUDENTS_PER_PAGE
  );

  const deleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await API.delete(`/students/${id}`);

      toast.success("Student deleted successfully");

      if (selectedStudent?.id === id) {
        setSelectedStudent(null);
      }

      await fetchStudents?.();
    } catch (error) {
      console.error("Failed to delete student:", error);
      toast.error("Failed to delete student");
    } finally {
      setDeletingId(null);
    }
  };

  const exportToExcel = () => {
    try {
      const exportData = students.map((student) => ({
        Name: student.name ?? "",
        Email: student.email ?? "",
        Course: student.course ?? "",
        Year: student.year ?? "",
        Phone: student.phone ?? "",
        Address: student.address ?? "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      worksheet["!cols"] = [
        { wch: 24 },
        { wch: 32 },
        { wch: 24 },
        { wch: 12 },
        { wch: 18 },
        { wch: 32 },
      ];

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Students"
      );

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileData = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(fileData, "edunexus-students.xlsx");
      toast.success("Excel report exported");
    } catch (error) {
      console.error("Excel export failed:", error);
      toast.error("Could not export Excel report");
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();

      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 210, 34, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(19);
      doc.text("EduNexus", 14, 15);

      doc.setFontSize(10);
      doc.setTextColor(196, 181, 253);
      doc.text("STUDENT DIRECTORY REPORT", 14, 24);

      doc.setTextColor(100, 116, 139);
      doc.setFontSize(9);
      doc.text(
        `Total students: ${students.length}`,
        14,
        42
      );
      doc.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        196,
        42,
        { align: "right" }
      );

      autoTable(doc, {
        startY: 49,
        head: [
          ["Name", "Email", "Course", "Year", "Phone"],
        ],
        body: students.map((student) => [
          student.name ?? "",
          student.email ?? "",
          student.course ?? "",
          student.year ?? "",
          student.phone ?? "",
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [91, 62, 210],
          textColor: [255, 255, 255],
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 243, 255],
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: "linebreak",
        },
        margin: { left: 14, right: 14 },
      });

      doc.save("edunexus-students-report.pdf");
      toast.success("PDF report exported");
    } catch (error) {
      console.error("PDF export failed:", error);
      toast.error("Could not export PDF report");
    }
  };

  const actionButton =
    "inline-flex items-center justify-center rounded-xl p-2.5 transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-50";

  if (role !== "admin") {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">
        <FaUsers className="text-3xl text-red-500" />
        <h2 className="text-xl font-bold text-red-500">
          Access Denied
        </h2>
        <p className="text-sm text-slate-500">
          You need administrator access to view the student directory.
        </p>
      </div>
    );
  }

  return (
    <section
      className={`min-w-0 space-y-6 rounded-3xl transition-colors duration-300 ${colors.page}`}
    >
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#17132f] via-[#211747] to-[#10263d] p-6 text-white shadow-xl shadow-violet-950/10 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-200">
              <FaGraduationCap />
              EDUNEXUS / STUDENT DIRECTORY
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Your students,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300">
                one space.
              </span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Manage student records, find details instantly, and export
              reports whenever you need them.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-64">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <FaUsers className="mb-3 text-lg text-cyan-300" />
              <p className="text-2xl font-black">
                {students.length}
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Total students
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <FaSearch className="mb-3 text-lg text-violet-300" />
              <p className="text-2xl font-black">
                {filteredStudents.length}
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Matching records
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Directory toolbar */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 ${colors.panel}`}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-xl">
            <FaSearch
              className={`absolute left-4 top-1/2 -translate-y-1/2 ${colors.muted}`}
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email, course, year or phone..."
              aria-label="Search students"
              className={`w-full rounded-xl border py-3.5 pl-11 pr-11 text-sm outline-none transition-all focus:ring-4 focus:ring-violet-500/10 ${colors.input}`}
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className={`absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 transition hover:bg-slate-500/10 ${colors.muted}`}
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={exportToExcel}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-500 transition hover:bg-emerald-500/20 sm:flex-none"
            >
              <FaFileExcel />
              Export Excel
            </button>

            <button
              type="button"
              onClick={exportToPDF}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-500 transition hover:bg-rose-500/20 sm:flex-none"
            >
              <FaFilePdf />
              Export PDF
            </button>
          </div>
        </div>

        <div
          className={`mt-4 flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs ${isDark ? "border-slate-800" : "border-slate-100"}`}
        >
          <p className={colors.muted}>
            Showing{" "}
            <span className={`font-bold ${colors.heading}`}>
              {filteredStudents.length === 0
                ? 0
                : (safePage - 1) * STUDENTS_PER_PAGE + 1}
              {"–"}
              {Math.min(
                safePage * STUDENTS_PER_PAGE,
                filteredStudents.length
              )}
            </span>{" "}
            of{" "}
            <span className={`font-bold ${colors.heading}`}>
              {filteredStudents.length}
            </span>{" "}
            students
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="font-semibold text-violet-500 hover:text-cyan-500"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Desktop table */}
      <div
        className={`hidden overflow-hidden rounded-2xl border shadow-sm md:block ${colors.panel}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead>
              <tr className="bg-gradient-to-r from-[#191532] to-[#13253b] text-xs uppercase tracking-wider text-slate-300">
                <th className="px-5 py-4 font-bold">Student</th>
                <th className="px-5 py-4 font-bold">Course</th>
                <th className="px-5 py-4 font-bold">Year</th>
                <th className="px-5 py-4 font-bold">Phone</th>
                <th className="px-5 py-4 text-right font-bold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((student) => (
                  <tr
                    key={student.id}
                    className={`border-b transition-colors last:border-b-0 ${colors.row}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex min-w-56 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/15 to-cyan-500/15 text-base font-black text-violet-500">
                          {student.name?.charAt(0)?.toUpperCase() || "S"}
                        </div>

                        <div className="min-w-0">
                          <p className={`truncate font-bold ${colors.heading}`}>
                            {student.name || "Unnamed student"}
                          </p>
                          <p className={`mt-1 flex items-center gap-1.5 truncate text-xs ${colors.muted}`}>
                            <FaEnvelope className="shrink-0" />
                            {student.email || "No email provided"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 rounded-lg border border-violet-500/15 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-500">
                        <FaBook />
                        {student.course || "Not assigned"}
                      </span>
                    </td>

                    <td className={`px-5 py-4 text-sm ${colors.subtle}`}>
                      {student.year || "—"}
                    </td>

                    <td className={`px-5 py-4 text-sm ${colors.subtle}`}>
                      {student.phone || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          title="View student"
                          aria-label={`View ${student.name || "student"}`}
                          onClick={() => setSelectedStudent(student)}
                          className={`${actionButton} bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20`}
                        >
                          <FaEye />
                        </button>

                        <button
                          type="button"
                          title="Edit student"
                          aria-label={`Edit ${student.name || "student"}`}
                          onClick={() => setEditingStudent(student)}
                          className={`${actionButton} bg-amber-500/10 text-amber-500 hover:bg-amber-500/20`}
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          title="Delete student"
                          aria-label={`Delete ${student.name || "student"}`}
                          disabled={deletingId === student.id}
                          onClick={() => deleteStudent(student.id)}
                          className={`${actionButton} bg-rose-500/10 text-rose-500 hover:bg-rose-500/20`}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center">
                      <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? "bg-slate-800" : "bg-violet-50"}`}>
                        <FaSearch className="text-2xl text-violet-500" />
                      </div>
                      <h3 className={`text-lg font-bold ${colors.heading}`}>
                        {search ? "No matching students" : "No students yet"}
                      </h3>
                      <p className={`mt-2 text-sm ${colors.muted}`}>
                        {search
                          ? "Try a different search term or clear your search."
                          : "Student records will appear here when they are added."}
                      </p>
                      {search && (
                        <button
                          type="button"
                          onClick={() => setSearch("")}
                          className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-violet-700"
                        >
                          Clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile student cards */}
      <div className="space-y-3 md:hidden">
        {currentStudents.length > 0 ? (
          currentStudents.map((student) => (
            <article
              key={student.id}
              className={`rounded-2xl border p-4 shadow-sm ${colors.panel}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 text-lg font-black text-violet-500">
                  {student.name?.charAt(0)?.toUpperCase() || "S"}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className={`break-words font-bold ${colors.heading}`}>
                    {student.name || "Unnamed student"}
                  </h3>
                  <p className={`mt-1 break-all text-xs ${colors.muted}`}>
                    {student.email || "No email provided"}
                  </p>
                  <span className="mt-2 inline-flex max-w-full items-center gap-2 rounded-lg bg-violet-500/10 px-2.5 py-1.5 text-xs font-bold text-violet-500">
                    <FaBook className="shrink-0" />
                    <span className="break-words">
                      {student.course || "Not assigned"}
                    </span>
                  </span>
                </div>
              </div>

              <div className={`mt-4 grid grid-cols-2 gap-3 border-t pt-4 text-sm ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                <div>
                  <p className={`text-xs ${colors.muted}`}>Year</p>
                  <p className={`mt-1 font-semibold ${colors.subtle}`}>
                    {student.year || "—"}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${colors.muted}`}>Phone</p>
                  <p className={`mt-1 break-words font-semibold ${colors.subtle}`}>
                    {student.phone || "—"}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(student)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500/10 px-3 py-2.5 text-sm font-bold text-cyan-500 transition hover:bg-cyan-500/20"
                >
                  <FaEye /> View
                </button>

                <button
                  type="button"
                  onClick={() => setEditingStudent(student)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500/10 px-3 py-2.5 text-sm font-bold text-amber-500 transition hover:bg-amber-500/20"
                >
                  <FaEdit /> Edit
                </button>

                <button
                  type="button"
                  disabled={deletingId === student.id}
                  onClick={() => deleteStudent(student.id)}
                  aria-label={`Delete ${student.name || "student"}`}
                  className="inline-flex items-center justify-center rounded-xl bg-rose-500/10 px-3 py-2.5 text-rose-500 transition hover:bg-rose-500/20 disabled:opacity-50"
                >
                  <FaTrash />
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className={`rounded-2xl border px-5 py-12 text-center ${colors.panel}`}>
            <FaUserGraduate className="mx-auto mb-4 text-4xl text-violet-500" />
            <h3 className={`text-lg font-bold ${colors.heading}`}>
              {search ? "No matching students" : "No students yet"}
            </h3>
            <p className={`mt-2 text-sm ${colors.muted}`}>
              {search
                ? "Try another search term."
                : "Student records will appear here once added."}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className={`flex flex-col items-center justify-between gap-4 rounded-2xl border p-4 sm:flex-row ${colors.panel}`}
        >
          <p className={`text-sm ${colors.muted}`}>
            Page{" "}
            <span className={`font-bold ${colors.heading}`}>
              {safePage}
            </span>{" "}
            of{" "}
            <span className={`font-bold ${colors.heading}`}>
              {totalPages}
            </span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage(safePage - 1)}
              aria-label="Previous page"
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"}`}
            >
              <FaChevronLeft />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  Math.abs(page - safePage) <= 1
              )
              .reduce((result, page, index, pages) => {
                if (index > 0 && page - pages[index - 1] > 1) {
                  result.push("ellipsis-" + page);
                }
                result.push(page);
                return result;
              }, [])
              .map((page) =>
                typeof page === "string" ? (
                  <span
                    key={page}
                    className={`px-1 ${colors.muted}`}
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Page ${page}`}
                    aria-current={safePage === page ? "page" : undefined}
                    className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition ${
                      safePage === page
                        ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20"
                        : isDark
                          ? "text-slate-300 hover:bg-slate-800"
                          : "text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage(safePage + 1)}
              aria-label="Next page"
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"}`}
            >
              <span>Next</span>
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      {/* Student details modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedStudent(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-detail-title"
            className={`relative my-auto w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl ${colors.modal}`}
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-[#191532] via-[#30215d] to-[#103044] px-6 pb-7 pt-6 text-white">
              <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-cyan-400/20 blur-3xl" />

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                aria-label="Close student details"
                className="absolute right-4 top-4 z-10 rounded-xl border border-white/10 bg-white/10 p-2 text-white transition hover:bg-white/20"
              >
                <FaTimes />
              </button>

              <div className="relative flex items-center gap-4 pr-8">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl font-black text-cyan-200 backdrop-blur">
                  {selectedStudent.name?.charAt(0)?.toUpperCase() || "S"}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-widest text-violet-200">
                    Student profile
                  </p>
                  <h2
                    id="student-detail-title"
                    className="mt-1 break-words text-xl font-black sm:text-2xl"
                  >
                    {selectedStudent.name || "Unnamed student"}
                  </h2>
                  <p className="mt-1 break-all text-sm text-slate-300">
                    {selectedStudent.email || "No email provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5 sm:p-6">
              <div className={`flex items-start gap-3 rounded-2xl p-4 ${isDark ? "bg-slate-800/60" : "bg-slate-50"}`}>
                <FaBook className="mt-1 shrink-0 text-violet-500" />
                <div className="min-w-0">
                  <p className={`text-xs ${colors.muted}`}>Course</p>
                  <p className={`mt-1 break-words font-semibold ${colors.heading}`}>
                    {selectedStudent.course || "Not assigned"}
                  </p>
                </div>
              </div>

              <div className={`flex items-start gap-3 rounded-2xl p-4 ${isDark ? "bg-slate-800/60" : "bg-slate-50"}`}>
                <FaCalendarAlt className="mt-1 shrink-0 text-cyan-500" />
                <div>
                  <p className={`text-xs ${colors.muted}`}>Academic year</p>
                  <p className={`mt-1 font-semibold ${colors.heading}`}>
                    {selectedStudent.year || "Not specified"}
                  </p>
                </div>
              </div>

              <div className={`flex items-start gap-3 rounded-2xl p-4 ${isDark ? "bg-slate-800/60" : "bg-slate-50"}`}>
                <FaPhone className="mt-1 shrink-0 text-emerald-500" />
                <div className="min-w-0">
                  <p className={`text-xs ${colors.muted}`}>Phone number</p>
                  <p className={`mt-1 break-words font-semibold ${colors.heading}`}>
                    {selectedStudent.phone || "Not provided"}
                  </p>
                </div>
              </div>

              {selectedStudent.address && (
                <div className={`flex items-start gap-3 rounded-2xl p-4 ${isDark ? "bg-slate-800/60" : "bg-slate-50"}`}>
                  <FaMapMarkerAlt className="mt-1 shrink-0 text-rose-500" />
                  <div className="min-w-0">
                    <p className={`text-xs ${colors.muted}`}>Address</p>
                    <p className={`mt-1 break-words font-semibold ${colors.heading}`}>
                      {selectedStudent.address}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStudent(null);
                    setEditingStudent(selectedStudent);
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-bold text-white transition hover:from-violet-700 hover:to-indigo-700"
                >
                  <FaEdit />
                  Edit student
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${isDark ? "border-slate-700 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-100"}`}
                >
                  Close
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default StudentList;