import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      const payload = JSON.parse(
        atob(res.data.token.split(".")[1])
      );

      localStorage.setItem("role", payload.role);

      alert("Login successful!");

      if (payload.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (error) {
      console.error(error);
      alert("Login failed!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">
        Login
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;