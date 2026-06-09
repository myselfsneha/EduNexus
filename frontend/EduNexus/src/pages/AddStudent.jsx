import { useState } from "react";
import axios from "axios";

function AddStudent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    course: "",
    year: "",
    phone: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "http://localhost:5000/students",
      form
    );

    alert(res.data.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="course" placeholder="Course" onChange={handleChange} />
      <input name="year" placeholder="Year" onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />

      <button type="submit">
        Add Student
      </button>
    </form>
  );
}

export default AddStudent;