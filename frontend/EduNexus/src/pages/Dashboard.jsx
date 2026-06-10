import { useState } from "react";
import AddStudent from "./AddStudent";
import StudentList from "./StudentList";

function Dashboard() {
  const [editingStudent, setEditingStudent] =
    useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          EduNexus Dashboard
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <AddStudent
        editingStudent={editingStudent}
        setEditingStudent={setEditingStudent}
      />

      <hr className="my-6" />

      <StudentList
        setEditingStudent={setEditingStudent}
      />
    </div>
  );
}

export default Dashboard;