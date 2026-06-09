import { useEffect, useState } from "react";
import axios from "axios";

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

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
            <p>
              <strong>Name:</strong> {student.name}
            </p>

            <p>
              <strong>Email:</strong> {student.email}
            </p>

            <p>
              <strong>Course:</strong> {student.course}
            </p>

            <p>
              <strong>Year:</strong> {student.year}
            </p>

            <p>
              <strong>Phone:</strong> {student.phone}
            </p>

            <button
              onClick={() => deleteStudent(student.id)}
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