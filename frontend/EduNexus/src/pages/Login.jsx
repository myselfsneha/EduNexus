
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaGraduationCap,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaShieldAlt,
  FaBolt,
  FaCheckCircle,
} from "react-icons/fa";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
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
      const response = await API.post("/auth/login", form);

      localStorage.setItem("token", response.data.token);

      const payload = JSON.parse(
        atob(response.data.token.split(".")[1])
      );

      localStorage.setItem("role", payload.role);

      toast.success("Welcome to EduNexus!");

      if (payload.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080B16] text-white">
      {/* Background effects */}
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
        className="pointer-events-none absolute -left-40 top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-violet-600/20 blur-[120px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-[-8rem] h-[28rem] w-[28rem] rounded-full bg-cyan-500/15 blur-[120px]"
      />

      {/* Top navigation */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 lg:px-14">
        <Link
          to="/"
          className="group flex items-center gap-3"
          aria-label="EduNexus home"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/15 text-xl text-violet-300 shadow-lg shadow-violet-950/30 transition group-hover:border-cyan-300/60">
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

        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-400 sm:flex">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          Your learning space, reimagined
        </div>
      </header>

      {/* Main layout */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-88px)] max-w-[1440px] items-center gap-12 px-5 pb-12 pt-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-14 lg:pb-16">
        {/* Brand panel */}
        <div className="mx-auto w-full max-w-2xl lg:mx-0">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-3.5 py-2 text-xs font-medium text-violet-200">
            <FaBolt className="text-cyan-300" />
            ONE PLATFORM. MORE POSSIBILITIES.
          </div>

          <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
            Your next chapter
            <br />
            starts{" "}
            <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              right here.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            Less scattered work. More meaningful progress.
            Bring your academic journey together in one
            connected learning space.
          </p>

          {/* Feature cards */}
          <div className="mt-9 grid gap-3 sm:grid-cols-2">
            <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4 transition duration-300 hover:border-violet-400/40 hover:bg-violet-400/[0.06]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-lg text-violet-300">
                <FaGraduationCap />
              </div>

              <h2 className="font-semibold text-white">
                One connected campus
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Keep student records and academic tools
                within reach.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.09] bg-white/[0.035] p-4 transition duration-300 hover:border-cyan-400/40 hover:bg-cyan-400/[0.05]">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-lg text-cyan-300">
                <FaBolt />
              </div>

              <h2 className="font-semibold text-white">
                Progress, made clearer
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-slate-500">
                Access the information you need without
                the unnecessary clutter.
              </p>
            </div>
          </div>

          {/* Trust note */}
          <div className="mt-8 flex items-center gap-3 text-sm text-slate-500">
            <FaShieldAlt className="shrink-0 text-emerald-400" />
            <span>
              A dedicated space for your academic journey.
            </span>
          </div>

          {/* Decorative terminal strip */}
          <div className="mt-10 hidden max-w-lg rounded-2xl border border-white/[0.08] bg-[#0D1221]/80 p-4 font-mono text-xs sm:block">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span className="ml-2 text-slate-600">
                edunexus / your-space
              </span>
            </div>

            <p className="text-slate-500">
              <span className="text-violet-300">const</span>{" "}
              future ={" "}
              <span className="text-cyan-300">
                "yours to build"
              </span>
              ;
            </p>

            <p className="mt-2 flex items-center gap-2 text-emerald-300">
              <FaCheckCircle />
              <span>workspace.ready()</span>
              <span className="animate-pulse">_</span>
            </p>
          </div>
        </div>

        {/* Login panel */}
        <div className="mx-auto w-full max-w-[460px] lg:mx-0 lg:ml-auto">
          <div className="rounded-[28px] border border-white/[0.12] bg-[#101525]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-9">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-xl text-cyan-200">
                <FaGraduationCap />
              </div>

              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-white">
                Sign in to your space.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Pick up where your learning journey left off.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
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
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <span className="text-xs text-slate-600">
                    Keep it secure
                  </span>
                </div>

                <div className="group relative">
                  <FaLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 transition group-focus-within:text-cyan-300" />

                  <input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-[#090D19] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 hover:border-white/20 focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/[0.08]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-950/40 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-900/40 focus:outline-none focus:ring-4 focus:ring-violet-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {loading ? "Signing you in..." : "Enter EduNexus"}
                </span>

                {!loading && (
                  <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.08]" />
              <span className="text-xs text-slate-600">
                NEW AROUND HERE?
              </span>
              <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            <Link
              to="/signup"
              className="flex w-full items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.025] px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.05] hover:text-cyan-200"
            >
              Create your account
            </Link>

            <p className="mt-6 text-center text-xs leading-5 text-slate-600">
              By continuing, you agree to use your account
              responsibly and keep your credentials private.
            </p>
          </div>

          <p className="mt-5 text-center text-xs text-slate-600">
            © 2026 EduNexus · Learn beyond limits.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;