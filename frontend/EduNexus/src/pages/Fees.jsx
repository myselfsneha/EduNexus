import { useEffect, useState } from "react";
import API from "../api";

function Fees() {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);

  const [formData, setFormData] = useState({
    student_id: "",
    amount: "",
    status: "Pending",
    payment_date: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchFees();
  }, []);

  const fetchStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data.data || []);
  };

  const fetchFees = async () => {
    const res = await API.get("/fees");
    setFees(res.data.data || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.post("/fees", formData);

    setFormData({
      student_id: "",
      amount: "",
      status: "Pending",
      payment_date: "",
    });

    fetchFees();
  };

  const paidCount = fees.filter(
    (f) => f.status === "Paid"
  ).length;

  const pendingCount = fees.filter(
    (f) => f.status === "Pending"
  ).length;

  return (
    <div className="p-6 space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-green-500 text-white p-6 rounded-2xl">
          <h3>Paid</h3>
          <p className="text-4xl font-bold">
            {paidCount}
          </p>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-2xl">
          <h3>Pending</h3>
          <p className="text-4xl font-bold">
            {pendingCount}
          </p>
        </div>

        <div className="bg-blue-500 text-white p-6 rounded-2xl">
          <h3>Total Records</h3>
          <p className="text-4xl font-bold">
            {fees.length}
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">
          Add Fee Record
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-4 gap-4"
        >
          <select
            className="border p-3 rounded-xl"
            value={formData.student_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                student_id: e.target.value,
              })
            }
            required
          >
            <option value="">
              Select Student
            </option>

            {students.map((student) => (
              <option
                key={student.id}
                value={student.id}
              >
                {student.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Amount"
            className="border p-3 rounded-xl"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
            required
          />

          <select
            className="border p-3 rounded-xl"
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value,
              })
            }
          >
            <option>Paid</option>
            <option>Pending</option>
          </select>

          <input
            type="date"
            className="border p-3 rounded-xl"
            value={formData.payment_date}
            onChange={(e) =>
              setFormData({
                ...formData,
                payment_date: e.target.value,
              })
            }
          />

          <button className="bg-blue-600 text-white p-3 rounded-xl">
            Save Fee
          </button>
        </form>
      </div>
    </div>
  );
}

export default Fees;