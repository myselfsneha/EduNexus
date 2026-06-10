import { useState, useEffect } from "react";
import API from "../api";
import AddStudent from "./AddStudent";
import StudentList from "./StudentList";

function AdminDashboard() {
  const [studentCount, setStudentCount] = useState(0);

  useEffect(() => {
    fetchStudentsCount();
  }, []);

  const fetchStudentsCount = async () => {
    try {
      const res = await API.get("/students");

      setStudentCount(res.data.data.length);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Admin Dashboard 👨‍💼
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg">Total Students</h2>
          <p className="text-3xl font-bold">
            {studentCount}
          </p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg">Courses</h2>
          <p className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-xl shadow">
          <h2 className="text-lg">Admins</h2>
          <p className="text-3xl font-bold">1</p>
        </div>
      </div>

      <AddStudent />

      <hr className="my-6" />

      <StudentList />
    </div>
  );
}

export default AdminDashboard;