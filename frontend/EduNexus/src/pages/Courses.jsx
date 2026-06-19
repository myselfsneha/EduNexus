import { useEffect, useState } from "react";
import API from "../api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [course_name, setCourseName] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await API.get("/courses");
    setCourses(res.data.data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/courses", {
      course_name,
      duration,
    });

    setCourseName("");
    setDuration("");

    fetchCourses();
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-3xl shadow-xl mb-6">
        <h2 className="text-2xl font-bold mb-4">
          Add Course
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="Course Name"
            className="border p-3 rounded-xl"
            value={course_name}
            onChange={(e) =>
              setCourseName(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Duration"
            className="border p-3 rounded-xl"
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
          />

          <button className="bg-blue-600 text-white rounded-xl">
            Add Course
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">
          Courses
        </h2>

        {courses.map((course) => (
          <div
            key={course.id}
            className="border-b py-3"
          >
            <h3 className="font-semibold">
              {course.course_name}
            </h3>
            <p className="text-gray-500">
              {course.duration}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Courses;