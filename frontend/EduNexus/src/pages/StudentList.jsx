import { useEffect, useState } from "react";
import axios from "axios";

function StudentList({ setEditingStudent }) {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <p>Access denied</p>;
  }

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/students"
      );

      setStudents(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteStudent = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/students/${id}`
      );

      fetchStudents();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      student.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Students List
      </h2>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border p-3 rounded-lg mb-4"
      />

      <div className="overflow-x-auto">
        <table className="w-full border">
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
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.email}</td>
                <td className="p-3">{student.course}</td>
                <td className="p-3">{student.year}</td>
                <td className="p-3">{student.phone}</td>

                <td className="p-3">
                  <button
                    onClick={() =>
                      setEditingStudent(student)
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteStudent(student.id)
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentList;