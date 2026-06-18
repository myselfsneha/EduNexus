import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaFileExcel,
} from "react-icons/fa";

function StudentList({ setEditingStudent }) {
  const role = localStorage.getItem("role");

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] =
    useState(1);

  const studentsPerPage = 5;

  if (role !== "admin") {
    return (
      <div className="text-center p-10 text-red-500">
        Access Denied
      </div>
    );
  }

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await API.get("/students");

      setStudents(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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

        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2"
        >
          <FaFileExcel />
          Export Excel
        </button>
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

      {loading ? (
        <div className="text-center py-10">
          Loading students...
        </div>
      ) : (
        <>
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
                {currentStudents.length >
                0 ? (
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

                        <td className="p-4 flex gap-2">
                          <button
                            onClick={() =>
                              setEditingStudent(
                                student
                              )
                            }
                            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl"
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() =>
                              deleteStudent(
                                student.id
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl"
                          >
                            <FaTrash />
                          </button>
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
        </>
      )}
    </div>
  );
}

export default StudentList;