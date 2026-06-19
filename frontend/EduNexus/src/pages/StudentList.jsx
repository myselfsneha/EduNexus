import { useState } from "react";
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
} from "react-icons/fa";

function StudentList({
  setEditingStudent,
  students = [],
  fetchStudents,
}) {
  const role = localStorage.getItem("role");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const studentsPerPage = 5;

  if (role !== "admin") {
    return (
      <div className="text-center p-10 text-red-500">
        Access Denied
      </div>
    );
  }

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/students/${id}`);

      toast.success(
        "Student deleted successfully"
      );

      fetchStudents();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete student");
    }
  };

  const exportToExcel = () => {
    const worksheet =
      XLSX.utils.json_to_sheet(students);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Students"
    );

    const excelBuffer = XLSX.write(
      workbook,
      {
        bookType: "xlsx",
        type: "array",
      }
    );

    const fileData = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );

    saveAs(fileData, "students.xlsx");

    toast.success("Excel exported");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(
      "EduNexus Student Report",
      14,
      20
    );

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Name",
          "Email",
          "Course",
          "Year",
          "Phone",
        ],
      ],
      body: students.map((student) => [
        student.name || "",
        student.email || "",
        student.course || "",
        student.year || "",
        student.phone || "",
      ]),
    });

    doc.save("students-report.pdf");

    toast.success("PDF exported");
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      student.email
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      student.course
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const lastIndex =
    currentPage * studentsPerPage;

  const firstIndex =
    lastIndex - studentsPerPage;

  const currentStudents =
    filteredStudents.slice(
      firstIndex,
      lastIndex
    );

  const totalPages = Math.ceil(
    filteredStudents.length /
      studentsPerPage
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Students List
          </h2>

          <p className="text-gray-500">
            Total Students:{" "}
            {filteredStudents.length}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <FaFileExcel />
            Excel
          </button>

          <button
            onClick={exportToPDF}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2"
          >
            <FaFilePdf />
            PDF
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <FaSearch className="absolute left-4 top-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search by name, email or course..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full pl-12 border-2 border-gray-200 focus:border-blue-500 focus:outline-none p-4 rounded-2xl"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="p-4 text-left">
                Name
              </th>
              <th className="p-4 text-left">
                Email
              </th>
              <th className="p-4 text-left">
                Course
              </th>
              <th className="p-4 text-left">
                Year
              </th>
              <th className="p-4 text-left">
                Phone
              </th>
              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {currentStudents.length > 0 ? (
              currentStudents.map(
                (student) => (
                  <tr
                    key={student.id}
                    className="border-t hover:bg-blue-50 transition"
                  >
                    <td className="p-4 font-medium">
                      {student.name}
                    </td>

                    <td className="p-4">
                      {student.email}
                    </td>

                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {student.course}
                      </span>
                    </td>

                    <td className="p-4">
                      {student.year}
                    </td>

                    <td className="p-4">
                      {student.phone}
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setSelectedStudent(
                              student
                            )
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-xl"
                        >
                          <FaEye />
                        </button>

                        <button
                          onClick={() =>
                            setEditingStudent(
                              student
                            )
                          }
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-xl"
                        >
                          <FaEdit />
                        </button>

                        <button
                          onClick={() =>
                            deleteStudent(
                              student.id
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-xl"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-8 text-gray-500"
                >
                  🔍 No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {[...Array(totalPages)].map(
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrentPage(
                    index + 1
                  )
                }
                className={`px-4 py-2 rounded-lg ${
                  currentPage ===
                  index + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      )}

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() =>
                setSelectedStudent(null)
              }
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <FaTimes size={20} />
            </button>

            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {selectedStudent.name
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <h2 className="text-2xl font-bold mb-6">
                {selectedStudent.name}
              </h2>
            </div>

            <div className="space-y-3">
              <p>
                <strong>Email:</strong>{" "}
                {selectedStudent.email}
              </p>

              <p>
                <strong>Course:</strong>{" "}
                {selectedStudent.course}
              </p>

              <p>
                <strong>Year:</strong>{" "}
                {selectedStudent.year}
              </p>

              <p>
                <strong>Phone:</strong>{" "}
                {selectedStudent.phone}
              </p>

              {selectedStudent.address && (
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedStudent.address}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentList;