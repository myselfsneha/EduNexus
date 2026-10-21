
import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../api";
import { useTheme } from "../context/ThemeContext";

const initialFormData = {
  student_id: "",
  amount: "",
  status: "Pending",
  payment_date: "",
};

function formatDate(dateValue) {
  if (!dateValue) return "—";

  const dateString = String(dateValue).split("T")[0];
  const parts = dateString.split("-");

  if (parts.length !== 3) return dateString;

  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

function formatAmount(amount) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) return "—";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

function Fees() {
  const { darkMode } = useTheme();

  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  const fetchStudents = useCallback(async () => {
    const response = await API.get("/students");
    setStudents(response.data.data || []);
  }, []);

  const fetchFees = useCallback(async () => {
    const response = await API.get("/fees");
    setFees(response.data.data || []);
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([fetchStudents(), fetchFees()]);
    } catch (err) {
      console.error("Failed to load fee data:", err);
      setError("Couldn't load fee records. Please try refreshing the data.");
    } finally {
      setLoading(false);
    }
  }, [fetchStudents, fetchFees]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.student_id) {
      setError("Please select a student.");
      return;
    }

    if (
      formData.amount === "" ||
      !Number.isFinite(Number(formData.amount)) ||
      Number(formData.amount) <= 0
    ) {
      setError("Please enter an amount greater than zero.");
      return;
    }

    setSaving(true);

    try {
      await API.post("/fees", formData);

      setFormData(initialFormData);
      setSuccess("Fee record added successfully.");

      await fetchFees();
    } catch (err) {
      console.error("Failed to save fee record:", err);

      setError(
        err.response?.data?.message ||
          "Couldn't save the fee record. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const getStudentForFee = (fee) => {
    const student = students.find(
      (item) => String(item.id) === String(fee.student_id)
    );

    return student || null;
  };

  const getStudentName = (fee) => {
    const student = getStudentForFee(fee);

    return (
      fee.student_name ||
      fee.name ||
      student?.name ||
      `Student #${fee.student_id ?? "—"}`
    );
  };

  const paidFees = fees.filter((fee) => fee.status === "Paid");
  const pendingFees = fees.filter((fee) => fee.status === "Pending");

  const totalPaid = paidFees.reduce(
    (total, fee) => total + (Number(fee.amount) || 0),
    0
  );

  const totalPending = pendingFees.reduce(
    (total, fee) => total + (Number(fee.amount) || 0),
    0
  );

  const filteredFees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return fees.filter((fee) => {
      const studentName = getStudentName(fee).toLowerCase();
      const studentId = String(fee.student_id ?? "").toLowerCase();
      const amount = String(fee.amount ?? "").toLowerCase();
      const date = String(fee.payment_date ?? "").toLowerCase();
      const status = String(fee.status ?? "").toLowerCase();

      const matchesSearch =
        !query ||
        studentName.includes(query) ||
        studentId.includes(query) ||
        amount.includes(query) ||
        date.includes(query) ||
        status.includes(query);

      const matchesStatus =
        statusFilter === "All" || fee.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [fees, searchTerm, statusFilter, students]);

  const summaryCards = [
    {
      title: "Total collected",
      value: formatAmount(totalPaid),
      count: `${paidFees.length} paid record${paidFees.length === 1 ? "" : "s"}`,
      icon: "₹",
      color: "emerald",
    },
    {
      title: "Pending amount",
      value: formatAmount(totalPending),
      count: `${pendingFees.length} pending record${pendingFees.length === 1 ? "" : "s"}`,
      icon: "◷",
      color: "amber",
    },
    {
      title: "Total records",
      value: fees.length.toLocaleString("en-IN"),
      count: `${students.length} student${students.length === 1 ? "" : "s"} available`,
      icon: "▤",
      color: "violet",
    },
  ];

  const colorStyles = {
    emerald: darkMode
      ? "border-emerald-900/70 bg-emerald-950/40 text-emerald-300"
      : "border-emerald-100 bg-emerald-50 text-emerald-700",
    amber: darkMode
      ? "border-amber-900/70 bg-amber-950/40 text-amber-300"
      : "border-amber-100 bg-amber-50 text-amber-700",
    violet: darkMode
      ? "border-violet-900/70 bg-violet-950/40 text-violet-300"
      : "border-violet-100 bg-violet-50 text-violet-700",
  };

  const statusStyles = (status) => {
    if (status === "Paid") {
      return darkMode
        ? "border-emerald-800 bg-emerald-950/60 text-emerald-300"
        : "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    return darkMode
      ? "border-amber-800 bg-amber-950/60 text-amber-300"
      : "border-amber-200 bg-amber-50 text-amber-700";
  };

  return (
    <div className={`min-h-screen p-4 transition-colors sm:p-6 lg:p-8 ${pageBackground}`}>
      <div className="mx-auto max-w-7xl space-y-7">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-violet-500" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">
                EduNexus / Finance
              </p>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Fee management<span className="text-violet-500">.</span>
            </h1>

            <p className={`mt-2 max-w-xl text-sm leading-6 ${mutedText}`}>
              Track fee records, monitor pending payments, and keep student
              finances organized in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-violet-500/30 px-4 py-3 text-sm font-semibold text-violet-500 transition hover:bg-violet-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
          >
            <span aria-hidden="true">↻</span>
            {loading ? "Refreshing..." : "Refresh data"}
          </button>
        </header>

        {/* Summary cards */}
        <section
          aria-label="Fee summary"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {summaryCards.map((card) => (
            <article
              key={card.title}
              className={`rounded-2xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${panelBackground}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-sm font-medium ${mutedText}`}>
                    {card.title}
                  </p>

                  <p className="mt-3 break-words text-2xl font-black tracking-tight sm:text-3xl">
                    {card.value}
                  </p>

                  <p className={`mt-2 text-xs ${mutedText}`}>
                    {card.count}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-black ${colorStyles[card.color]}`}
                  aria-hidden="true"
                >
                  {card.icon}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Feedback messages */}
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
              onClick={loadData}
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

        {/* Add fee form */}
        <section
          className={`overflow-hidden rounded-2xl border shadow-sm ${panelBackground}`}
        >
          <div
            className={`border-b p-5 sm:p-6 ${
              darkMode ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-xl text-violet-500">
                +
              </div>

              <div>
                <h2 className="text-lg font-bold">Add fee record</h2>
                <p className={`mt-1 text-sm ${mutedText}`}>
                  Record a student's fee amount and payment status.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 p-5 sm:p-6 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label
                htmlFor="fee-student"
                className="mb-2 block text-sm font-semibold"
              >
                Student <span className="text-red-500">*</span>
              </label>

              <select
                id="fee-student"
                name="student_id"
                className={inputStyles}
                value={formData.student_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select student</option>

                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (#{student.id})
                  </option>
                ))}
              </select>

              {students.length === 0 && !loading && (
                <p className={`mt-2 text-xs ${mutedText}`}>
                  No students found. Add a student before recording fees.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="fee-amount"
                className="mb-2 block text-sm font-semibold"
              >
                Amount (₹) <span className="text-red-500">*</span>
              </label>

              <input
                id="fee-amount"
                name="amount"
                type="number"
                min="0.01"
                step="any"
                inputMode="decimal"
                placeholder="e.g. 5000"
                className={inputStyles}
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="fee-status"
                className="mb-2 block text-sm font-semibold"
              >
                Payment status
              </label>

              <select
                id="fee-status"
                name="status"
                className={inputStyles}
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="fee-date"
                className="mb-2 block text-sm font-semibold"
              >
                Payment date
              </label>

              <input
                id="fee-date"
                name="payment_date"
                type="date"
                className={inputStyles}
                value={formData.payment_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row md:col-span-2 xl:col-span-4 xl:justify-end">
              <button
                type="button"
                onClick={() => {
                  setFormData(initialFormData);
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
                disabled={saving || loading || students.length === 0}
                className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving fee..." : "＋ Save fee record"}
              </button>
            </div>
          </form>
        </section>

        {/* Fee records */}
        <section
          className={`overflow-hidden rounded-2xl border shadow-sm ${panelBackground}`}
        >
          <div
            className={`border-b p-5 sm:p-6 ${
              darkMode ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold">Fee records</h2>
                <p className={`mt-1 text-sm ${mutedText}`}>
                  Showing {filteredFees.length} of {fees.length} records
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative">
                  <label htmlFor="fee-search" className="sr-only">
                    Search fee records
                  </label>

                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 ${mutedText}`}
                  >
                    ⌕
                  </span>

                  <input
                    id="fee-search"
                    type="search"
                    placeholder="Search records..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className={`${inputStyles} pl-9`}
                  />
                </div>

                <div>
                  <label htmlFor="fee-filter" className="sr-only">
                    Filter by payment status
                  </label>

                  <select
                    id="fee-filter"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className={inputStyles}
                  >
                    <option value="All">All statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-violet-500/20 border-t-violet-500" />
              <p className={`text-sm ${mutedText}`}>
                Loading fee records...
              </p>
            </div>
          ) : fees.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-2xl text-violet-500">
                ₹
              </div>

              <h3 className="mt-4 font-bold">No fee records yet</h3>
              <p className={`mx-auto mt-2 max-w-sm text-sm ${mutedText}`}>
                Your fee records will appear here once you add the first
                entry using the form above.
              </p>
            </div>
          ) : filteredFees.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <h3 className="font-bold">No matching records</h3>
              <p className={`mt-2 text-sm ${mutedText}`}>
                Try changing your search or status filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-4 text-sm font-bold text-violet-500 hover:text-violet-400"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
                {filteredFees.map((fee, index) => (
                  <article
                    key={fee.id ?? `${fee.student_id}-${fee.payment_date}-${index}`}
                    className={`rounded-xl border p-4 ${
                      darkMode ? "border-slate-800 bg-slate-950/60" : "border-slate-100 bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words font-bold">
                          {getStudentName(fee)}
                        </p>
                        <p className={`mt-1 text-xs ${mutedText}`}>
                          Student ID: {fee.student_id ?? "—"}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(fee.status)}`}
                      >
                        {fee.status || "Unknown"}
                      </span>
                    </div>

                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className={`text-xs ${mutedText}`}>Amount</p>
                        <p className="mt-1 text-lg font-black">
                          {formatAmount(fee.amount)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className={`text-xs ${mutedText}`}>Payment date</p>
                        <p className="mt-1 text-sm font-medium">
                          {formatDate(fee.payment_date)}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead
                    className={
                      darkMode
                        ? "bg-slate-950/70 text-slate-400"
                        : "bg-slate-50 text-slate-500"
                    }
                  >
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student</th>
                      <th className="px-6 py-4 font-semibold">Student ID</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Payment date</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody
                    className={`divide-y ${
                      darkMode ? "divide-slate-800" : "divide-slate-100"
                    }`}
                  >
                    {filteredFees.map((fee, index) => (
                      <tr
                        key={fee.id ?? `${fee.student_id}-${fee.payment_date}-${index}`}
                        className={`transition ${
                          darkMode ? "hover:bg-slate-800/40" : "hover:bg-violet-50/40"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-black text-violet-500">
                              {getStudentName(fee).charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold">
                              {getStudentName(fee)}
                            </span>
                          </div>
                        </td>

                        <td className={`px-6 py-4 ${mutedText}`}>
                          #{fee.student_id ?? "—"}
                        </td>

                        <td className="px-6 py-4 font-bold">
                          {formatAmount(fee.amount)}
                        </td>

                        <td className={`px-6 py-4 ${mutedText}`}>
                          {formatDate(fee.payment_date)}
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusStyles(fee.status)}`}
                          >
                            <span
                              className={`mr-2 mt-1 h-1.5 w-1.5 rounded-full ${
                                fee.status === "Paid"
                                  ? "bg-emerald-500"
                                  : "bg-amber-500"
                              }`}
                            />
                            {fee.status || "Unknown"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div
            className={`border-t px-5 py-4 text-xs ${mutedText} ${
              darkMode ? "border-slate-800" : "border-slate-100"
            }`}
          >
            Fee records are displayed from your existing EduNexus API.
          </div>
        </section>
      </div>
    </div>
  );
}

export default Fees;