
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../api";
import { useTheme } from "../context/ThemeContext";

import {
  FaUserGraduate,
  FaEnvelope,
  FaBook,
  FaCalendarAlt,
  FaPhone,
  FaSave,
  FaUserPlus,
  FaTimes,
} from "react-icons/fa";

const EMPTY_FORM = {
  name: "",
  email: "",
  course: "",
  year: "",
  phone: "",
};

function AddStudent({
  editingStudent,
  setEditingStudent,
  fetchStudents,
}) {
  const { darkMode } = useTheme();
  const role = localStorage.getItem("role");
  const isEditing = Boolean(editingStudent);

  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingStudent) {
      setForm({
        name: editingStudent.name ?? "",
        email: editingStudent.email ?? "",
        course: editingStudent.course ?? "",
        year: editingStudent.year ?? "",
        phone: editingStudent.phone ?? "",
      });
    } else {
      setForm({ ...EMPTY_FORM });
    }
  }, [editingStudent]);

  const inputClass = `w-full rounded-xl border py-3 pl-11 pr-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-2 focus:ring-violet-400/10 ${
    darkMode
      ? "border-white/10 bg-[#0b0f1c] text-white"
      : "border-slate-200 bg-slate-50 text-slate-900 focus:bg-white"
  }`;

  const labelClass = `mb-2 block text-xs font-semibold ${
    darkMode ? "text-slate-300" : "text-slate-700"
  }`;

  const iconClass = `pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
    darkMode ? "text-slate-500" : "text-slate-400"
  }`;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditingStudent(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setSubmitting(true);

    try {
      if (isEditing) {
        await API.put(`/students/${editingStudent.id}`, form);

        toast.success("Student updated successfully");
        setEditingStudent(null);
      } else {
        await API.post("/students", form);

        toast.success("Student added successfully");
      }

      setForm({ ...EMPTY_FORM });
      await fetchStudents();
    } catch (error) {
      console.error("Unable to save student:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to save student. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (role !== "admin") {
    return null;
  }

  const fields = [
    {
      name: "name",
      label: "Full name",
      placeholder: "e.g. Aditi Sharma",
      icon: FaUserGraduate,
      type: "text",
      autoComplete: "name",
    },
    {
      name: "email",
      label: "Email address",
      placeholder: "student@example.com",
      icon: FaEnvelope,
      type: "email",
      autoComplete: "email",
    },
    {
      name: "course",
      label: "Course",
      placeholder: "e.g. Computer Science",
      icon: FaBook,
      type: "text",
    },
    {
      name: "year",
      label: "Academic year",
      placeholder: "Enter year (e.g. 1)",
      icon: FaCalendarAlt,
      type: "number",
      min: "1",
      step: "1",
    },
    {
      name: "phone",
      label: "Phone number",
      placeholder: "Enter phone number",
      icon: FaPhone,
      type: "tel",
      autoComplete: "tel",
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-400">
          {isEditing ? <FaSave /> : <FaUserPlus />}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`text-base font-bold ${
              darkMode ? "text-white" : "text-slate-900"
            }`}
          >
            {isEditing ? "Update student" : "New student"}
          </h3>

          <p
            className={`mt-1 text-xs leading-5 ${
              darkMode ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {isEditing
              ? "Make changes to this student's details."
              : "Enter the details to create a student record."}
          </p>
        </div>

        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
              darkMode
                ? "text-slate-400 hover:bg-white/10 hover:text-white"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
            aria-label="Cancel editing"
            title="Cancel editing"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map((field) => {
          const Icon = field.icon;

          return (
            <div key={field.name}>
              <label htmlFor={`student-${field.name}`} className={labelClass}>
                {field.label}
              </label>

              <div className="relative">
                <Icon className={iconClass} aria-hidden="true" />

                <input
                  id={`student-${field.name}`}
                  name={field.name}
                  type={field.type}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  min={field.min}
                  step={field.step}
                  className={inputClass}
                  required
                  disabled={submitting}
                />
              </div>
            </div>
          );
        })}

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isEditing ? <FaSave /> : <FaUserPlus />}

            {submitting
              ? "Saving..."
              : isEditing
                ? "Save student changes"
                : "Add student"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className={`w-full rounded-xl border px-4 py-3 text-sm font-semibold transition disabled:opacity-50 ${
                darkMode
                  ? "border-white/10 text-slate-300 hover:bg-white/[0.05]"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              Cancel editing
            </button>
          )}
        </div>

        <p
          className={`text-center text-[11px] leading-5 ${
            darkMode ? "text-slate-500" : "text-slate-400"
          }`}
        >
          Student information is saved to your EduNexus records.
        </p>
      </form>
    </div>
  );
}

export default AddStudent;