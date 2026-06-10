import { useState, useEffect } from "react";
import axios from "axios";

function AddStudent({
  editingStudent,
  setEditingStudent,
}) {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return null;
  }

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
        await axios.post(
          "http://localhost:5000/students",
          form
        );

        alert("Student added successfully");
      }

      setForm({
        name: "",
        email: "",
        course: "",
        year: "",
        phone: "",
      });

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        {editingStudent
          ? "Update Student"
          : "Add Student"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="border p-3 rounded-lg md:col-span-2"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg"
        >
          {editingStudent
            ? "Update Student"
            : "Add Student"}
        </button>
      </form>
    </div>
  );
}

export default AddStudent;