import { useEffect, useState } from "react";
import API from "../api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/courses", {
        name,
        description,
      });

      setName("");
      setDescription("");

      fetchCourses();

      alert("Course added successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to add course");
    }
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
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <input
            type="text"
            placeholder="Description"
            className="border p-3 rounded-xl"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
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

        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.id}
              className="border-b py-3"
            >
              <h3 className="font-semibold">
                {course.name}
              </h3>

              <p className="text-gray-500">
                {course.description}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
            No courses found
          </p>
        )}
      </div>
    </div>
  );
}

export default Courses;