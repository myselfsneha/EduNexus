import { useEffect, useState } from "react";
import API from "../api";

function Attendance() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [formData, setFormData] = useState({
    student_id: "",
    date: new Date().toISOString().split("T")[0],
    status: "Present",
  });

  useEffect(() => {
    fetchStudents();
    fetchAttendance();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/students");
      setStudents(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance");
      setAttendance(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/attendance", formData);

      alert("Attendance marked successfully");

      setFormData({
        student_id: "",
        date: new Date().toISOString().split("T")[0],
        status: "Present",
      });

      fetchAttendance();
    } catch (err) {
      console.error(err);
      alert("Failed to mark attendance");
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Mark Attendance
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4"
        >
          <select
            value={formData.student_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                student_id: e.target.value,
              })
            }
            className="border p-3 rounded-xl"
            required
          >
            <option value="">
              Select Student
            </option>

            {students.map((student) => (
              <option
                key={student.id}
                value={student.id}
              >
                {student.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({
                ...formData,
                date: e.target.value,
              })
            }
            className="border p-3 rounded-xl"
          />

          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
            className="border p-3 rounded-xl"
          >
            <option>Present</option>
            <option>Absent</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded-xl"
          >
            Mark Attendance
          </button>
        </form>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-4">
          Attendance Records
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">
                Student ID
              </th>
              <th className="p-3 text-left">
                Date
              </th>
              <th className="p-3 text-left">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((record) => (
              <tr
                key={record.id}
                className="border-b"
              >
                <td className="p-3">
                  {record.student_id}
                </td>

                <td className="p-3">
                  {record.date}
                </td>

                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      record.status === "Present"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;