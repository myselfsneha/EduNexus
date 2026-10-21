
import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../api";
import { useTheme } from "../context/ThemeContext";

function Courses() {
  const { darkMode } = useTheme();

  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const pageBackground = darkMode
    ? "bg-slate-950 text-slate-100"
    : "bg-slate-50 text-slate-900";

  const panelBackground = darkMode
    ? "border-slate-800 bg-slate-900"
    : "border-slate-200 bg-white";

  const mutedText = darkMode ? "text-slate-400" : "text-slate-500";

  const inputStyles = `w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 ${
    darkMode
      ? "border-slate-700 bg-slate-950 text-slate-100 placeholder:text-slate-500"
      : "border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
  }`;

  const fetchCourses = useCallback(async () => {
    const response = await API.get("/courses");
    setCourses(response.data.data || []);
  }, []);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await fetchCourses();
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Couldn't load courses. Please try refreshing.");
    } finally {
      setLoading(false);
    }
  }, [fetchCourses]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setError("Please enter a course name.");
      return;
    }

    setSaving(true);

    try {
      await API.post("/courses", {
        name: trimmedName,
        description: trimmedDescription,
      });

      setName("");
      setDescription("");
      setSuccess("Course added successfully.");

      await fetchCourses();
    } catch (err) {
      console.error("Failed to add course:", err);

      setError(
        err.response?.data?.message ||
          "Couldn't add the course. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredCourses = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return courses;

    return courses.filter((course) => {
      const courseName = String(course.name || "").toLowerCase();
      const courseDescription = String(course.description || "").toLowerCase();
      const courseId = String(course.id ?? "").toLowerCase();

      return (
        courseName.includes(query) ||
        courseDescription.includes(query) ||
        courseId.includes(query)
      );
    });
  }, [courses, searchTerm]);

  const getInitial = (courseName) =>
    String(courseName || "C").trim().charAt(0).toUpperCase() || "C";

  const courseColors = [
    "from-violet-500 to-indigo-600",
    "from-cyan-500 to-blue-600",
    "from-fuchsia-500 to-violet-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-sky-500 to-indigo-600",
  ];

  return (
    <div
      className={`min-h-screen p-4 transition-colors sm:p-6 lg:p-8 ${pageBackground}`}
    >
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">
                EduNexus / Academics
              </p>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Course studio<span className="text-violet-500">.</span>
            </h1>

            <p className={`mt-2 max-w-xl text-sm leading-6 ${mutedText}`}>
              Organize your learning ecosystem, create courses, and keep
              course information easy to find.
            </p>
          </div>

          <button
            type="button"
            onClick={loadCourses}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-violet-500/30 px-4 py-3 text-sm font-semibold text-violet-500 transition hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
          >
            <span aria-hidden="true">↻</span>
            {loading ? "Refreshing..." : "Refresh courses"}
          </button>
        </header>

        {/* Overview cards */}
        <section
          aria-label="Course overview"
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <article
            className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${panelBackground}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={`text-sm font-medium ${mutedText}`}>
                  Total courses
                </p>
                <p className="mt-3 text-3xl font-black">
                  {courses.length.toLocaleString("en-IN")}
                </p>
                <p className={`mt-2 text-xs ${mutedText}`}>
                  In your course catalog
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
                  darkMode
                    ? "bg-violet-950/60 text-violet-300"
                    : "bg-violet-50 text-violet-600"
                }`}
                aria-hidden="true"
              >
                ▤
              </div>
            </div>
          </article>

          <article
            className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${panelBackground}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={`text-sm font-medium ${mutedText}`}>
                  Search results
                </p>
                <p className="mt-3 text-3xl font-black">
                  {filteredCourses.length.toLocaleString("en-IN")}
                </p>
                <p className={`mt-2 text-xs ${mutedText}`}>
                  Matching your search
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
                  darkMode
                    ? "bg-cyan-950/60 text-cyan-300"
                    : "bg-cyan-50 text-cyan-700"
                }`}
                aria-hidden="true"
              >
                ⌕
              </div>
            </div>
          </article>

          <article
            className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${panelBackground}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className={`text-sm font-medium ${mutedText}`}>
                  Catalog status
                </p>
                <p className="mt-3 text-2xl font-black">
                  {loading ? "Loading" : error ? "Needs attention" : "Connected"}
                </p>
                <p className={`mt-2 text-xs ${mutedText}`}>
                  {loading
                    ? "Fetching course data"
                    : error
                      ? "Check your connection"
                      : "Course data loaded"}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${
                  error
                    ? darkMode
                      ? "bg-amber-950/60 text-amber-300"
                      : "bg-amber-50 text-amber-700"
                    : darkMode
                      ? "bg-emerald-950/60 text-emerald-300"
                      : "bg-emerald-50 text-emerald-700"
                }`}
                aria-hidden="true"
              >
                {loading ? "◷" : error ? "!" : "✓"}
              </div>
            </div>
          </article>
        </section>

        {/* Feedback */}
        {error && (
          <div
            role="alert"
            className={`flex flex-col justify-between gap-3 rounded-xl border border-red-500/30 p-4 text-sm sm:flex-row sm:items-center ${
              darkMode
                ? "bg-red-950/30 text-red-300"
                : "bg-red-50 text-red-700"
            }`}
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={loadCourses}
              className="shrink-0 font-bold underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        {success && (
          <div
            role="status"
            className={`rounded-xl border border-emerald-500/30 p-4 text-sm ${
              darkMode
                ? "bg-emerald-950/30 text-emerald-300"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            ✓ {success}
          </div>
        )}

        {/* Create course */}
        <section
          className={`overflow-hidden rounded-2xl border shadow-sm ${panelBackground}`}
        >
          <div
            className={`border-b p-5 sm:p-6 ${
              darkMode ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-xl font-bold text-violet-500">
                +
              </div>

              <div>
                <h2 className="text-lg font-bold">Create a course</h2>
                <p className={`mt-1 text-sm ${mutedText}`}>
                  Add a new course to your existing catalog.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-2"
          >
            <div>
              <label
                htmlFor="course-name"
                className="mb-2 block text-sm font-semibold"
              >
                Course name <span className="text-red-500">*</span>
              </label>

              <input
                id="course-name"
                type="text"
                placeholder="e.g. Computer Science"
                className={inputStyles}
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                maxLength={150}
                required
              />
            </div>

            <div>
              <label
                htmlFor="course-description"
                className="mb-2 block text-sm font-semibold"
              >
                Description
              </label>

              <input
                id="course-description"
                type="text"
                placeholder="A short course description"
                className={inputStyles}
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                maxLength={500}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:col-span-2 md:justify-end">
              <button
                type="button"
                onClick={() => {
                  setName("");
                  setDescription("");
                  setError("");
                  setSuccess("");
                }}
                className={`rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                  darkMode
                    ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                Clear form
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Creating course..." : "＋ Add course"}
              </button>
            </div>
          </form>
        </section>

        {/* Course catalog */}
        <section
          className={`overflow-hidden rounded-2xl border shadow-sm ${panelBackground}`}
        >
          <div
            className={`flex flex-col justify-between gap-4 border-b p-5 sm:flex-row sm:items-center sm:p-6 ${
              darkMode ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <div>
              <h2 className="text-lg font-bold">Your course catalog</h2>
              <p className={`mt-1 text-sm ${mutedText}`}>
                Explore the courses currently available in EduNexus.
              </p>
            </div>

            <div className="w-full sm:max-w-xs">
              <label htmlFor="course-search" className="sr-only">
                Search courses
              </label>

              <input
                id="course-search"
                type="search"
                placeholder="Search by name or description..."
                className={inputStyles}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
              <p className={`text-sm ${mutedText}`}>Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl text-violet-500">
                ▤
              </div>

              <h3 className="mt-4 font-bold">Your catalog starts here</h3>
              <p className={`mx-auto mt-2 max-w-sm text-sm ${mutedText}`}>
                No courses have been added yet. Use the form above to create
                your first course.
              </p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <h3 className="font-bold">No matching courses</h3>
              <p className={`mt-2 text-sm ${mutedText}`}>
                Try a different course name or description.
              </p>

              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="mt-4 text-sm font-bold text-violet-500 hover:text-violet-400"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-3">
              {filteredCourses.map((course, index) => (
                <article
                  key={course.id}
                  className={`group overflow-hidden rounded-2xl border transition duration-200 hover:-translate-y-1 hover:shadow-lg ${
                    darkMode
                      ? "border-slate-800 bg-slate-950/50 hover:border-violet-500/40"
                      : "border-slate-200 bg-white hover:border-violet-200"
                  }`}
                >
                  <div
                    className={`h-1.5 bg-gradient-to-r ${
                      courseColors[index % courseColors.length]
                    }`}
                  />

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-black text-white ${
                          courseColors[index % courseColors.length]
                        }`}
                        aria-hidden="true"
                      >
                        {getInitial(course.name)}
                      </div>

                      <span
                        className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                          darkMode
                            ? "bg-slate-800 text-slate-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {course.id != null ? `#${course.id}` : "Course"}
                      </span>
                    </div>

                    <h3 className="mt-5 break-words text-lg font-bold transition group-hover:text-violet-500">
                      {course.name || "Untitled course"}
                    </h3>

                    <p
                      className={`mt-2 min-h-12 break-words text-sm leading-6 ${
                        course.description ? mutedText : `${mutedText} italic`
                      }`}
                    >
                      {course.description || "No description provided yet."}
                    </p>

                    <div
                      className={`mt-5 flex items-center gap-2 border-t pt-4 text-xs font-semibold ${
                        darkMode
                          ? "border-slate-800 text-slate-500"
                          : "border-slate-100 text-slate-400"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      In course catalog
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div
            className={`border-t px-5 py-4 text-xs ${mutedText} ${
              darkMode ? "border-slate-800" : "border-slate-100"
            }`}
          >
            {filteredCourses.length} course
            {filteredCourses.length === 1 ? "" : "s"} displayed
          </div>
        </section>
      </div>
    </div>
  );
}

export default Courses;