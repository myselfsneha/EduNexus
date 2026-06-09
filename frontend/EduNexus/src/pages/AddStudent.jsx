import { useState, useEffect } from "react";
import axios from "axios";

function AddStudent({
  editingStudent,
  setEditingStudent,
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    year: "",
    phone: "",
  });

  useEffect(() => {
    if (editingStudent) {
      setForm(editingStudent);
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStudent) {
        await axios.put(
          `http://localhost:5000/students/${editingStudent.id}`,
          form
        );

        alert("Student updated successfully");

        setEditingStudent(null);
      } else {
        const res = await axios.post(
          "http://localhost:5000/students",
          form
        );

        alert(res.data.message);
      }

      setForm({
        name: "",
        email: "",
        course: "",
        year: "",
        phone: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="course"
        placeholder="Course"
        value={form.course}
        onChange={handleChange}
      />

      <input
        name="year"
        placeholder="Year"
        value={form.year}
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone"
        value={form.phone}
        onChange={handleChange}
      />

      <button type="submit">
        {editingStudent
          ? "Update Student"
          : "Add Student"}
      </button>
    </form>
  );
}

export default AddStudent;