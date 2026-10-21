
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaGraduationCap,
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
import API from "../api";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await API.post("/auth/register", form);

      toast.success("Account created successfully!");

      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080B16] text-white">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-[-8rem] h-[28rem] w-[28rem] rounded-full bg-violet-600/20 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-[-8rem] h-[28rem] w-[28rem] rounded-full bg-cyan-500/15 blur-[120px]"
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/15 text-xl text-violet-300">
            <FaGraduationCap />
          </span>

          <span>
            <span className="block text-lg font-bold tracking-tight">
              Edu<span className="text-cyan-300">Nexus</span>
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.24em] text-slate-500">
              Learn beyond limits
            </span>
          </span>
        </Link>

        <Link
          to="/"
          className="text-sm text-slate-400 transition hover:text-cyan-300"
        >
          Already a member?{" "}
          <span className="font-semibold text-white">Sign in</span>
        </Link>
      </header>

      {/* Signup content */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-[1250px] items-center gap-12 px-5 pb-12 pt-5 sm:px-8 lg:grid-cols-[1fr_0.9fr] lg:gap-20 lg:px-14">
        {/* Intro panel */}
        <div className="mx-auto w-full max-w-xl lg:mx-0">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3.5 py-2 text-xs font-medium text-cyan-200">
            <FaCheckCircle />
            YOUR JOURNEY STARTS HERE
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Make room for
            <br />
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              what’s next.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-slate-400 sm:text-lg">
            Create your EduNexus account and step into a
            more connected academic experience. Your next
            chapter deserves a better workspace.
          </p>

          <div className="mt-9 space-y-4">
            {[
              {
                title: "Everything in one space",
                description:
                  "Keep your academic experience connected.",
              },
              {
                title: "Built around your journey",
                description:
                  "A dedicated space to access your learning tools.",
              },
              {
                title: "Simple, focused, accessible",
                description:
                  "Spend less time navigating and more time learning.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition hover:border-violet-400/30"
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-400/10 text-sm text-violet-300">
                  <FaCheckCircle />
                </span>

                <div>
                  <h2 className="font-semibold text-white">
                    {feature.title}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
            <FaShieldAlt className="text-emerald-400" />
            Keep your login credentials private and secure.
          </div>
        </div>

        {/* Form panel */}
        <div className="mx-auto w-full max-w-[460px] lg:mx-0 lg:ml-auto">
          <div className="rounded-[28px] border border-white/[0.12] bg-[#101525]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-9">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-300/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-xl text-violet-200">
                <FaUser />
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Create your account
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                Start fresh.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                A few details and you’re ready to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full name
                </label>

                <div className="group relative">
                  <FaUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition group-focus-within:text-cyan-300" />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[#090D19] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/[0.08]"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email address
                </label>

                <div className="group relative">
                  <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition group-focus-within:text-cyan-300" />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[#090D19] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/[0.08]"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="group relative">
                  <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition group-focus-within:text-cyan-300" />

                  <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[#090D19] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/[0.08]"
                    required
                  />
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Choose a strong password to help protect
                  your account.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-900/40 focus:outline-none focus:ring-4 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {loading ? "Creating account..." : "Create my account"}
                </span>

                {!loading && (
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-xs text-slate-600">
                ALREADY HAVE AN ACCOUNT?
              </span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <Link
              to="/"
              className="flex w-full items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.025] px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.05] hover:text-cyan-200"
            >
              Back to sign in
            </Link>
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            © 2026 EduNexus · Learn beyond limits.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Signup;