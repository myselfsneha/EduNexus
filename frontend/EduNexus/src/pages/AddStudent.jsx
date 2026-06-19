import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../api";
import {
  FaUserGraduate,
  FaEnvelope,
  FaBook,
  FaCalendarAlt,
  FaPhone,
} from "react-icons/fa";

function AddStudent({
  editingStudent,
  setEditingStudent,
  fetchStudents,
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
        await API.post("/students", form);

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

      await fetchStudents();

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">
          {editingStudent
            ? "✏️ Update Student"
            : "➕ Add New Student"}
        </h2>

        <p className="text-gray-500 mt-1">
          Manage student information quickly.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div className="relative">
          <FaUserGraduate className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={form.name}
            onChange={handleChange}
            className="w-full pl-12 border-2 border-gray-200 p-3 rounded-2xl focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="relative">
          <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className="w-full pl-12 border-2 border-gray-200 p-3 rounded-2xl focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="relative">
          <FaBook className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            name="course"
            placeholder="Course"
            value={form.course}
            onChange={handleChange}
            className="w-full pl-12 border-2 border-gray-200 p-3 rounded-2xl focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="relative">
          <FaCalendarAlt className="absolute left-4 top-4 text-gray-400" />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            className="w-full pl-12 border-2 border-gray-200 p-3 rounded-2xl focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="relative md:col-span-2">
          <FaPhone className="absolute left-4 top-4 text-gray-400" />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="w-full pl-12 border-2 border-gray-200 p-3 rounded-2xl focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="md:col-span-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-4 rounded-2xl font-bold shadow-lg transition-all hover:scale-[1.02]"
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