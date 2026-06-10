import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../api";

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
        await API.put(
          `/students/${editingStudent.id}`,
          form
        );

        toast.success(
          "Student updated successfully"
        );

        setEditingStudent(null);
      } else {
        await API.post(
          "/students",
          form
        );

        toast.success(
          "Student added successfully"
        );
      }

      setForm({
        name: "",
        email: "",
        course: "",
        year: "",
        phone: "",
      });

      setTimeout(() => {
        window.location.reload();
      }, 1200);

    } catch (error) {
      console.error(error);

      toast.error(
        "Something went wrong"
      );
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        {editingStudent
          ? "Update Student"
          : "Add New Student"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          name="course"
          placeholder="Course"
          value={form.course}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="number"
          name="year"
          placeholder="Year"
          value={form.year}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-xl md:col-span-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          className="md:col-span-2 bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-semibold transition"
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