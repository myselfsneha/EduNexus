
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { useTheme } from "../context/ThemeContext";

const emptyForm = {
  name: "",
  email: "",
  employee_code: "",
  phone: "",
  department: "",
  designation: "",
  status: "active",
};

const inputBase =
  "w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

function Faculty() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const page = darkMode
    ? "min-h-screen bg-[#080d1b] text-slate-100"
    : "min-h-screen bg-slate-50 text-slate-900";

  const panel = darkMode
    ? "border-white/10 bg-[#111a2e]/90"
    : "border-slate-200 bg-white";

  const muted = darkMode ? "text-slate-400" : "text-slate-500";

  const fieldStyle = darkMode
    ? "border-white/10 bg-[#0b1222] text-white placeholder:text-slate-500"
    : "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400";

  const loadFaculty = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/faculty");
      setFaculty(response.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load faculty. Check your login and backend deployment."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFaculty();
  }, [loadFaculty]);

  const departments = useMemo(
    () =>
      [...new Set(faculty.map((person) => person.department).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b)),
    [faculty]
  );

  const filteredFaculty = useMemo(() => {
    const term = search.trim().toLowerCase();

    return faculty.filter((person) => {
      const matchesSearch =
        !term ||
        [
          person.name,
          person.email,
          person.employee_code,
          person.phone,
          person.department,
          person.designation,
        ].some((value) => String(value || "").toLowerCase().includes(term));

      const matchesDepartment =
        departmentFilter === "all" ||
        person.department === departmentFilter;

      const matchesStatus =
        statusFilter === "all" || person.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [faculty, search, departmentFilter, statusFilter]);

  const activeCount = faculty.filter(
    (person) => person.status === "active"
  ).length;

  const inactiveCount = faculty.length - activeCount;

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setShowForm(true);
  };

  const openEditForm = (person) => {
    setEditingId(person.id);
    setForm({
      name: person.name || "",
      email: person.email || "",
      employee_code: person.employee_code || "",
      phone: person.phone || "",
      department: person.department || "",
      designation: person.designation || "",
      status: person.status || "active",
    });
    setError("");
    setNotice("");
    setShowForm(true);
  };

  const closeForm = () => {
    if (saving) return;
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const saveFaculty = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    const payload = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      employee_code: form.employee_code.trim() || null,
      phone: form.phone.trim() || null,
      department: form.department.trim() || null,
      designation: form.designation.trim() || null,
    };

    try {
      if (editingId) {
        await API.put(`/faculty/${editingId}`, payload);
        setNotice("Faculty member updated successfully.");
      } else {
        await API.post("/faculty", payload);
        setNotice("Faculty member added successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadFaculty();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save faculty details. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteFaculty = async (person) => {
    const confirmed = window.confirm(
      `Delete ${person.name} from the faculty directory? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(person.id);
    setError("");
    setNotice("");

    try {
      await API.delete(`/faculty/${person.id}`);
      setNotice(`${person.name} was removed from the faculty directory.`);
      await loadFaculty();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete this faculty member."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const initials = (name) =>
    String(name || "F")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");

  return (
    <div className={page}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <main className="relative mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className={`mb-4 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-violet-400 ${muted}`}
            >
              <span aria-hidden="true">←</span> Back to dashboard
            </button>

            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
              EduNexus · Administration
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Faculty Management
            </h1>
            <p className={`mt-2 max-w-2xl text-sm leading-6 ${muted}`}>
              Manage faculty profiles, departments, designations, and staff
              status from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:-translate-y-0.5 hover:shadow-violet-600/30"
          >
            <span className="text-lg" aria-hidden="true">+</span>
            Add faculty
          </button>
        </header>

        {error && !showForm && (
          <div
            role="alert"
            className="mb-5 flex flex-col gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-500 sm:flex-row sm:items-center sm:justify-between"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={loadFaculty}
              className="font-bold underline underline-offset-4"
            >
              Retry
            </button>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-500"
          >
            {notice}
          </div>
        )}

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Total faculty",
              value: faculty.length,
              icon: "◈",
              accent: "from-violet-500 to-indigo-500",
            },
            {
              label: "Active members",
              value: activeCount,
              icon: "✓",
              accent: "from-emerald-500 to-teal-500",
            },
            {
              label: "Inactive members",
              value: inactiveCount,
              icon: "○",
              accent: "from-amber-500 to-orange-500",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 ${panel}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className={`text-sm font-medium ${muted}`}>{stat.label}</p>
                  <p className="mt-3 text-3xl font-black tabular-nums">
                    {loading ? "—" : stat.value}
                  </p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.accent} text-xl font-black text-white shadow-lg`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className={`overflow-hidden rounded-2xl border shadow-sm ${panel}`}>
          <div className="border-b border-inherit p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-extrabold">Faculty directory</h2>
                <p className={`mt-1 text-sm ${muted}`}>
                  {loading
                    ? "Loading faculty records…"
                    : `${filteredFaculty.length} of ${faculty.length} members`}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[650px]">
                <label className="relative block sm:col-span-3 lg:col-span-1">
                  <span className="sr-only">Search faculty</span>
                  <span className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${muted}`}>
                    ⌕
                  </span>
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search faculty…"
                    className={`${inputBase} ${fieldStyle} pl-9`}
                  />
                </label>

                <label>
                  <span className="sr-only">Filter by department</span>
                  <select
                    value={departmentFilter}
                    onChange={(event) => setDepartmentFilter(event.target.value)}
                    className={`${inputBase} ${fieldStyle}`}
                  >
                    <option value="all">All departments</option>
                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="sr-only">Filter by status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className={`${inputBase} ${fieldStyle}`}
                  >
                    <option value="all">All statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          {loading ? (
            <div className={`flex flex-col items-center justify-center px-6 py-20 text-center ${muted}`}>
              <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
              <p className="text-sm font-semibold">Loading faculty directory…</p>
            </div>
          ) : error && faculty.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="font-bold text-rose-500">Could not load faculty</p>
              <p className={`mt-2 text-sm ${muted}`}>{error}</p>
              <button
                type="button"
                onClick={loadFaculty}
                className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white"
              >
                Try again
              </button>
            </div>
          ) : filteredFaculty.length === 0 ? (
            <div className="px-6 py-16 text-center sm:py-20">
              <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${darkMode ? "bg-white/5" : "bg-slate-100"}`}>
                ◈
              </div>
              <h3 className="mt-5 text-lg font-extrabold">
                {faculty.length === 0
                  ? "Your faculty directory starts here"
                  : "No matching faculty"}
              </h3>
              <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${muted}`}>
                {faculty.length === 0
                  ? "Add your first faculty profile to start organizing staff details, departments, and designations."
                  : "Try a different search term or change your department and status filters."}
              </p>
              {faculty.length === 0 ? (
                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-6 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white"
                >
                  + Add your first faculty member
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setDepartmentFilter("all");
                    setStatusFilter("all");
                  }}
                  className="mt-5 text-sm font-bold text-violet-400 hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[900px] text-left">
                  <thead className={darkMode ? "bg-white/[0.03]" : "bg-slate-50"}>
                    <tr className={`text-xs uppercase tracking-wider ${muted}`}>
                      <th className="px-6 py-4 font-bold">Faculty member</th>
                      <th className="px-6 py-4 font-bold">Department</th>
                      <th className="px-6 py-4 font-bold">Designation</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFaculty.map((person) => (
                      <tr
                        key={person.id}
                        className={`border-t border-inherit transition ${darkMode ? "hover:bg-white/[0.025]" : "hover:bg-slate-50"}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-sm font-black text-white">
                              {initials(person.name)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-bold">{person.name}</p>
                              <p className={`mt-1 truncate text-sm ${muted}`}>{person.email}</p>
                              {person.employee_code && (
                                <p className={`mt-1 text-xs ${muted}`}>ID: {person.employee_code}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">{person.department || "—"}</td>
                        <td className="px-6 py-4 text-sm">{person.designation || "—"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                              person.status === "active"
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-slate-500/10 text-slate-500"
                            }`}
                          >
                            {person.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(person)}
                              className={`rounded-lg border px-3 py-2 text-xs font-bold transition hover:border-violet-500 hover:text-violet-400 ${fieldStyle}`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              disabled={deletingId === person.id}
                              onClick={() => deleteFaculty(person)}
                              className="rounded-lg border border-rose-500/20 px-3 py-2 text-xs font-bold text-rose-500 transition hover:bg-rose-500/10 disabled:opacity-50"
                            >
                              {deletingId === person.id ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                {filteredFaculty.map((person) => (
                  <article
                    key={person.id}
                    className={`rounded-xl border p-4 ${darkMode ? "border-white/10 bg-white/[0.02]" : "border-slate-200 bg-slate-50"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 text-sm font-black text-white">
                        {initials(person.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="break-words font-bold">{person.name}</p>
                        <p className={`mt-1 break-all text-sm ${muted}`}>{person.email}</p>
                        <p className={`mt-2 text-sm ${muted}`}>
                          {person.designation || "Faculty"} · {person.department || "No department"}
                        </p>
                        <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${person.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-500/10 text-slate-500"}`}>
                          {person.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2 border-t border-inherit pt-3">
                      <button
                        type="button"
                        onClick={() => openEditForm(person)}
                        className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-bold ${fieldStyle}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === person.id}
                        onClick={() => deleteFaculty(person)}
                        className="flex-1 rounded-lg border border-rose-500/20 px-3 py-2.5 text-sm font-bold text-rose-500 disabled:opacity-50"
                      >
                        {deletingId === person.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <p className={`mt-5 text-center text-xs ${muted}`}>
          EduNexus · Faculty directory · Admin access only
        </p>
      </main>

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="faculty-form-title"
            className={`my-auto w-full max-w-2xl rounded-2xl border p-5 shadow-2xl sm:p-7 ${panel}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
                  Faculty directory
                </p>
                <h2 id="faculty-form-title" className="mt-2 text-xl font-black sm:text-2xl">
                  {editingId ? "Edit faculty member" : "Add faculty member"}
                </h2>
                <p className={`mt-2 text-sm ${muted}`}>
                  Enter the staff details below. Name and email are required.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                aria-label="Close form"
                className={`rounded-lg px-3 py-2 text-xl transition hover:text-violet-400 ${muted}`}
              >
                ×
              </button>
            </div>

            {error && (
              <div role="alert" className="mt-5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500">
                {error}
              </div>
            )}

            <form onSubmit={saveFaculty} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Full name *</span>
                  <input
                    required
                    maxLength={100}
                    name="name"
                    value={form.name}
                    onChange={updateField}
                    placeholder="e.g. Dr. Aditi Sharma"
                    className={`${inputBase} ${fieldStyle}`}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Email address *</span>
                  <input
                    required
                    type="email"
                    maxLength={100}
                    name="email"
                    value={form.email}
                    onChange={updateField}
                    placeholder="faculty@college.edu"
                    className={`${inputBase} ${fieldStyle}`}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Employee ID</span>
                  <input
                    maxLength={50}
                    name="employee_code"
                    value={form.employee_code}
                    onChange={updateField}
                    placeholder="e.g. FAC-001"
                    className={`${inputBase} ${fieldStyle}`}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Phone</span>
                  <input
                    type="tel"
                    maxLength={20}
                    name="phone"
                    value={form.phone}
                    onChange={updateField}
                    placeholder="Contact number"
                    className={`${inputBase} ${fieldStyle}`}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Department</span>
                  <input
                    maxLength={100}
                    name="department"
                    value={form.department}
                    onChange={updateField}
                    placeholder="e.g. Computer Science"
                    className={`${inputBase} ${fieldStyle}`}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Designation</span>
                  <input
                    maxLength={100}
                    name="designation"
                    value={form.designation}
                    onChange={updateField}
                    placeholder="e.g. Assistant Professor"
                    className={`${inputBase} ${fieldStyle}`}
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-sm font-semibold">Employment status</span>
                  <select
                    name="status"
                    value={form.status}
                    onChange={updateField}
                    className={`${inputBase} ${fieldStyle}`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </label>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-inherit pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className={`rounded-xl border px-5 py-3 text-sm font-bold transition hover:border-violet-500 disabled:opacity-50 ${fieldStyle}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Saving…"
                    : editingId
                      ? "Save changes"
                      : "Add faculty member"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

export default Faculty;
