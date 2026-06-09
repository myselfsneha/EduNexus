import { useState } from "react";
import AddStudent from "./pages/AddStudent";
import StudentList from "./pages/StudentList";

function App() {
  const [editingStudent, setEditingStudent] = useState(null);

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        EduNexus Dashboard
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <AddStudent
          editingStudent={editingStudent}
          setEditingStudent={setEditingStudent}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md mt-6">
        <StudentList
          setEditingStudent={setEditingStudent}
        />
      </div>
    </div>
  );
}

export default App;