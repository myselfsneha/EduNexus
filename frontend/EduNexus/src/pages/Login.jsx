import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api";
import { FaGraduationCap, FaLock, FaEnvelope } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      const payload = JSON.parse(
        atob(res.data.token.split(".")[1])
      );

      localStorage.setItem("role", payload.role);

      toast.success("Login successful!");

      setTimeout(() => {
        if (payload.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/student");
        }
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 px-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaGraduationCap className="text-white text-3xl" />
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            EduNexus
          </h1>

          <p className="text-gray-500 mt-2">
            Student Management System
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="text-sm text-gray-600 font-medium">
              Email Address
            </label>

            <div className="relative mt-2">
              <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 font-medium">
              Password
            </label>

            <div className="relative mt-2">
              <FaLock className="absolute left-4 top-4 text-gray-400" />

              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 pl-12 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          © 2026 EduNexus Portal
        </div>
      </div>
    </div>
  );
}

export default Login;