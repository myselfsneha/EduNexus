import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function StudentList({ setEditingStudent }) {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <p>Access denied</p>;
  }

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
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

      toast.success("Student deleted successfully");

      fetchStudents();
    } catch (error) {
      console.error(error);

      toast.error("Failed to delete student");
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      students
    );

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
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      }
    );

    saveAs(fileData, "students.xlsx");

    toast.success("Excel exported successfully");
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Students List
        </h2>

        <button
          onClick={exportToExcel}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          Export Excel
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, email or course..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full border p-3 rounded-lg mb-4"
      />

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Course</th>
              <th className="p-3">Year</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">
                    {student.name}
                  </td>

                  <td className="p-3">
                    {student.email}
                  </td>

                  <td className="p-3">
                    {student.course}
                  </td>

                  <td className="p-3">
                    {student.year}
                  </td>

                  <td className="p-3">
                    {student.phone}
                  </td>

                  <td className="p-3">
                    {setEditingStudent && (
                      <button
                        onClick={() =>
                          setEditingStudent(
                            student
                          )
                        }
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() =>
                        deleteStudent(student.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-gray-500"
                >
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;