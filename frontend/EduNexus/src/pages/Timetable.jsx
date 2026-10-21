
import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../api";

const emptyForm = {
  course_id: "",
  subject_id: "",
  teacher_id: "",
  classroom_id: "",
  day_of_week: "Monday",
  start_time: "09:00",
  end_time: "10:00",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

const labelClass =
  "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300";

function getError(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

function formatTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export default function Timetable() {
  const [options, setOptions] = useState({
    courses: [],
    subjects: [],
    faculty: [],
    classrooms: [],
    days: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  });

  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDay, setSelectedDay] = useState("All");

  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    course_id: "",
    name: "",
  });
  const [roomForm, setRoomForm] = useState({
    room_number: "",
    building: "",
    capacity: "40",
  });
  const [creatingResource, setCreatingResource] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [optionsResponse, timetableResponse] = await Promise.all([
        API.get("/timetables/options"),
        API.get("/timetables"),
      ]);

      setOptions(optionsResponse.data.data);
      setEntries(timetableResponse.data.data || []);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const availableSubjects = useMemo(
    () =>
      options.subjects.filter(
        (subject) => String(subject.course_id) === String(form.course_id)
      ),
    [options.subjects, form.course_id]
  );

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesDay =
        selectedDay === "All" || entry.day_of_week === selectedDay;

      const searchable = [
        entry.course_name,
        entry.subject_name,
        entry.teacher_name,
        entry.room_number,
        entry.building,
        entry.employee_code,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesDay && searchable.includes(query);
    });
  }, [entries, search, selectedDay]);

  const stats = useMemo(
    () => ({
      total: entries.length,
      courses: new Set(entries.map((entry) => entry.course_id)).size,
      faculty: new Set(entries.map((entry) => entry.teacher_id)).size,
      rooms: new Set(
        entries.map((entry) => entry.classroom_id).filter(Boolean)
      ).size,
    }),
    [entries]
  );

  function updateForm(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };

      if (field === "course_id") {
        next.subject_id = "";
      }

      return next;
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(entry) {
    setForm({
      course_id: String(entry.course_id),
      subject_id: String(entry.subject_id),
      teacher_id: String(entry.teacher_id),
      classroom_id: entry.classroom_id
        ? String(entry.classroom_id)
        : "",
      day_of_week: entry.day_of_week,
      start_time: entry.start_time?.slice(0, 5) || "09:00",
      end_time: entry.end_time?.slice(0, 5) || "10:00",
    });

    setEditingId(entry.id);
    setError("");
    setNotice("");
    setShowSubjectForm(false);
    setShowRoomForm(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (
      !form.course_id ||
      !form.subject_id ||
      !form.teacher_id ||
      !form.day_of_week ||
      !form.start_time ||
      !form.end_time
    ) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.start_time >= form.end_time) {
      setError("End time must be later than start time.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        ...form,
        classroom_id: form.classroom_id || null,
      };

      if (editingId !== null) {
        await API.put(`/timetables/${editingId}`, payload);
        setNotice("Timetable entry updated successfully.");
      } else {
        await API.post("/timetables", payload);
        setNotice("Class scheduled successfully.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(getError(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(entry) {
    const confirmed = window.confirm(
      `Delete the ${entry.subject_name} class for ${entry.course_name} on ${entry.day_of_week}?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      await API.delete(`/timetables/${entry.id}`);

      if (editingId === entry.id) resetForm();

      setNotice("Timetable entry deleted successfully.");
      await loadData();
    } catch (err) {
      setError(getError(err));
    }
  }

  async function handleAddSubject(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!subjectForm.course_id || !subjectForm.name.trim()) {
      setError("Select a course and enter a subject name.");
      return;
    }

    setCreatingResource(true);

    try {
      const response = await API.post("/timetables/subjects", {
        course_id: subjectForm.course_id,
        name: subjectForm.name.trim(),
      });

      const created = response.data.data;

      setOptions((current) => ({
        ...current,
        subjects: [...current.subjects, created].sort((a, b) =>
          a.name.localeCompare(b.name)
        ),
      }));

      setForm((current) => ({
        ...current,
        course_id: String(created.course_id),
        subject_id: String(created.id),
      }));

      setSubjectForm({ course_id: "", name: "" });
      setShowSubjectForm(false);
      setNotice("Subject added. You can now schedule its classes.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setCreatingResource(false);
    }
  }

  async function handleAddClassroom(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    if (!roomForm.room_number.trim() || Number(roomForm.capacity) <= 0) {
      setError("Enter a room number and a positive capacity.");
      return;
    }

    setCreatingResource(true);

    try {
      const response = await API.post("/timetables/classrooms", {
        ...roomForm,
        room_number: roomForm.room_number.trim(),
        building: roomForm.building.trim(),
        capacity: Number(roomForm.capacity),
      });

      const created = response.data.data;

      setOptions((current) => ({
        ...current,
        classrooms: [...current.classrooms, created].sort((a, b) =>
          a.room_number.localeCompare(b.room_number)
        ),
      }));

      setForm((current) => ({
        ...current,
        classroom_id: String(created.id),
      }));

      setRoomForm({
        room_number: "",
        building: "",
        capacity: "40",
      });

      setShowRoomForm(false);
      setNotice("Classroom added successfully.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setCreatingResource(false);
    }
  }

  const cardClass =
    "rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
              Academic administration
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Timetable Management
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Plan weekly classes, assign faculty and rooms, and manage
              scheduling conflicts.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          >
            {loading ? "Refreshing..." : "↻ Refresh schedule"}
          </button>
        </header>

        {/* Alerts */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
          >
            <strong>Unable to complete the action:</strong> {error}
          </div>
        )}

        {notice && !error && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            {notice}
          </div>
        )}

        {/* Statistics */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Scheduled classes",
              value: stats.total,
              symbol: "▦",
              color: "text-indigo-600 dark:text-indigo-400",
            },
            {
              label: "Courses scheduled",
              value: stats.courses,
              symbol: "▤",
              color: "text-sky-600 dark:text-sky-400",
            },
            {
              label: "Faculty assigned",
              value: stats.faculty,
              symbol: "♙",
              color: "text-violet-600 dark:text-violet-400",
            },
            {
              label: "Rooms in use",
              value: stats.rooms,
              symbol: "⌂",
              color: "text-emerald-600 dark:text-emerald-400",
            },
          ].map((stat) => (
            <div key={stat.label} className={`${cardClass} p-5`}>
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <span className={`text-xl ${stat.color}`}>
                  {stat.symbol}
                </span>
              </div>
              <p className="mt-3 text-3xl font-bold">{stat.value}</p>
            </div>
          ))}
        </section>

        {/* Scheduling form */}
        <section className={`${cardClass} overflow-hidden`}>
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:px-6">
            <h2 className="text-lg font-bold">
              {editingId !== null ? "Edit class schedule" : "Schedule a class"}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select the course, subject, faculty member, and time slot.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-5 p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className={labelClass}>Course *</label>
                <select
                  className={inputClass}
                  value={form.course_id}
                  onChange={(event) =>
                    updateForm("course_id", event.target.value)
                  }
                  required
                >
                  <option value="">Select course</option>
                  {options.courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Subject *</label>
                <select
                  className={inputClass}
                  value={form.subject_id}
                  onChange={(event) =>
                    updateForm("subject_id", event.target.value)
                  }
                  disabled={!form.course_id}
                  required
                >
                  <option value="">Select subject</option>
                  {availableSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {form.course_id && availableSubjects.length === 0 && (
                  <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                    No subjects for this course yet. Add one below.
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Faculty *</label>
                <select
                  className={inputClass}
                  value={form.teacher_id}
                  onChange={(event) =>
                    updateForm("teacher_id", event.target.value)
                  }
                  required
                >
                  <option value="">Select faculty</option>
                  {options.faculty.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                      {person.employee_code
                        ? ` (${person.employee_code})`
                        : ""}
                    </option>
                  ))}
                </select>
                {options.faculty.length === 0 && (
                  <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                    Add an active faculty member before scheduling.
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Classroom</label>
                <select
                  className={inputClass}
                  value={form.classroom_id}
                  onChange={(event) =>
                    updateForm("classroom_id", event.target.value)
                  }
                >
                  <option value="">No classroom assigned</option>
                  {options.classrooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.room_number}
                      {room.building ? ` · ${room.building}` : ""}
                      {room.capacity ? ` · ${room.capacity} seats` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Day *</label>
                <select
                  className={inputClass}
                  value={form.day_of_week}
                  onChange={(event) =>
                    updateForm("day_of_week", event.target.value)
                  }
                  required
                >
                  {options.days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Start time *</label>
                  <input
                    className={inputClass}
                    type="time"
                    value={form.start_time}
                    onChange={(event) =>
                      updateForm("start_time", event.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>End time *</label>
                  <input
                    className={inputClass}
                    type="time"
                    value={form.end_time}
                    onChange={(event) =>
                      updateForm("end_time", event.target.value)
                    }
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
              <button
                type="submit"
                disabled={saving || loading}
                className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId !== null
                    ? "Save changes"
                    : "+ Schedule class"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
                >
                  Cancel edit
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setShowSubjectForm((current) => !current);
                  setShowRoomForm(false);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
              >
                + Add subject
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowRoomForm((current) => !current);
                  setShowSubjectForm(false);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
              >
                + Add classroom
              </button>
            </div>
          </form>

          {/* Add subject */}
          {showSubjectForm && (
            <form
              onSubmit={handleAddSubject}
              className="border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
            >
              <h3 className="mb-4 font-bold">Create a subject</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Course *</label>
                  <select
                    className={inputClass}
                    value={subjectForm.course_id}
                    onChange={(event) =>
                      setSubjectForm((current) => ({
                        ...current,
                        course_id: event.target.value,
                      }))
                    }
                    required
                  >
                    <option value="">Select course</option>
                    {options.courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Subject name *</label>
                  <input
                    className={inputClass}
                    value={subjectForm.name}
                    onChange={(event) =>
                      setSubjectForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Computer Networks"
                    maxLength={255}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={creatingResource}
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {creatingResource ? "Adding..." : "Create subject"}
              </button>
            </form>
          )}

          {/* Add classroom */}
          {showRoomForm && (
            <form
              onSubmit={handleAddClassroom}
              className="border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50 sm:p-6"
            >
              <h3 className="mb-4 font-bold">Register a classroom</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={labelClass}>Room number *</label>
                  <input
                    className={inputClass}
                    value={roomForm.room_number}
                    onChange={(event) =>
                      setRoomForm((current) => ({
                        ...current,
                        room_number: event.target.value,
                      }))
                    }
                    placeholder="e.g. Lab-101"
                    maxLength={50}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Building</label>
                  <input
                    className={inputClass}
                    value={roomForm.building}
                    onChange={(event) =>
                      setRoomForm((current) => ({
                        ...current,
                        building: event.target.value,
                      }))
                    }
                    placeholder="e.g. Block A"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className={labelClass}>Capacity *</label>
                  <input
                    className={inputClass}
                    type="number"
                    min="1"
                    step="1"
                    value={roomForm.capacity}
                    onChange={(event) =>
                      setRoomForm((current) => ({
                        ...current,
                        capacity: event.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={creatingResource}
                className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {creatingResource ? "Adding..." : "Create classroom"}
              </button>
            </form>
          )}
        </section>

        {/* Weekly schedule */}
        <section className={`${cardClass} overflow-hidden`}>
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-bold">Weekly schedule</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {filteredEntries.length}{" "}
                {filteredEntries.length === 1 ? "class" : "classes"} displayed
              </p>
            </div>

            <input
              className={`${inputClass} sm:max-w-xs`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search course, subject, faculty..."
              aria-label="Search timetable"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto border-b border-slate-200 px-5 py-3 dark:border-slate-800 sm:px-6">
            {["All", ...options.days].map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => setSelectedDay(day)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  selectedDay === day
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="p-12 text-center text-sm text-slate-500">
              Loading timetable...
            </div>
          ) : filteredEntries.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                ▦
              </div>
              <h3 className="mt-4 font-bold">No classes found</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                {entries.length === 0
                  ? "Your timetable is empty. Add a subject and schedule your first class above."
                  : "Try another day or search term, or schedule a new class."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Day & time</th>
                    <th className="px-5 py-4 font-semibold">Course / subject</th>
                    <th className="px-5 py-4 font-semibold">Faculty</th>
                    <th className="px-5 py-4 font-semibold">Classroom</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className="transition hover:bg-slate-50/80 dark:hover:bg-slate-900/50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">{entry.day_of_week}</p>
                        <p className="mt-1 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                          {formatTime(entry.start_time)} –{" "}
                          {formatTime(entry.end_time)}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold">{entry.subject_name}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {entry.course_name}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">{entry.teacher_name}</p>
                        {entry.employee_code && (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {entry.employee_code}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {entry.room_number ? (
                          <>
                            <p className="font-medium">{entry.room_number}</p>
                            {entry.building && (
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {entry.building}
                              </p>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Not assigned
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(entry)}
                            className="rounded-lg border border-indigo-200 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-950/50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(entry)}
                            className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="text-center text-xs text-slate-400">
          EduNexus · Timetable Management · Scheduling conflicts are checked
          before saving.
        </p>
      </div>
    </main>
  );
}
