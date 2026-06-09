import { useEffect, useState } from "react";
import axios from "axios";

function StudentList({ setEditingStudent }) {
  const [students, setStudents] = useState([]);

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

  return (
    <div>
      <h2>Students List</h2>

      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        students.map((student) => (
          <div
            key={student.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>{student.name}</p>
            <p>{student.email}</p>

            <button
              onClick={() =>
                setEditingStudent(student)
              }
            >
              Edit
            </button>

            <button
              onClick={() =>
                deleteStudent(student.id)
              }
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default StudentList;