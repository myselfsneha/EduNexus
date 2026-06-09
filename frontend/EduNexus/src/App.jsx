import { useState } from "react";
import AddStudent from "./pages/AddStudent";
import StudentList from "./pages/StudentList";

function App() {
  const [editingStudent, setEditingStudent] = useState(null);

  return (
    <>
      <AddStudent
        editingStudent={editingStudent}
        setEditingStudent={setEditingStudent}
      />

      <hr />

      <StudentList
        setEditingStudent={setEditingStudent}
      />
    </>
  );
}

export default App;