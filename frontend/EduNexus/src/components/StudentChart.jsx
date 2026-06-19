import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function StudentChart({ students = [] }) {
  const courseCount = {};
  const yearCount = {};

  students.forEach((student) => {
    const course = student.course || "Unknown";
    const year = student.year || "Unknown";

    courseCount[course] =
      (courseCount[course] || 0) + 1;

    yearCount[year] =
      (yearCount[year] || 0) + 1;
  });

  const pieData = Object.keys(courseCount).map(
    (course) => ({
      name: course,
      value: courseCount[course],
    })
  );

  const barData = Object.keys(yearCount).map(
    (year) => ({
      year,
      students: yearCount[year],
    })
  );

  const firstYear =
    yearCount["1"] ||
    yearCount["First Year"] ||
    0;

  const secondYear =
    yearCount["2"] ||
    yearCount["Second Year"] ||
    0;

  const thirdYear =
    yearCount["3"] ||
    yearCount["Third Year"] ||
    0;

  const fourthYear =
    yearCount["4"] ||
    yearCount["Fourth Year"] ||
    0;

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EF4444",
    "#06B6D4",
    "#EC4899",
    "#14B8A6",
    "#F97316",
  ];

  if (students.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Analytics Dashboard
        </h2>

        <div className="text-gray-500 py-16">
          No student data available
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Analytics Cards */}
      <div className="grid md:grid-cols-5 gap-6">
        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-gray-500">
            Total Students
          </h3>

          <p className="text-4xl font-bold text-blue-600">
            {students.length}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-gray-500">
            1st Year
          </h3>

          <p className="text-4xl font-bold text-green-600">
            {firstYear}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-gray-500">
            2nd Year
          </h3>

          <p className="text-4xl font-bold text-purple-600">
            {secondYear}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-gray-500">
            3rd Year
          </h3>

          <p className="text-4xl font-bold text-orange-600">
            {thirdYear}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-6">
          <h3 className="text-gray-500">
            4th Year
          </h3>

          <p className="text-4xl font-bold text-red-600">
            {fourthYear}
          </p>
        </div>
      </div>

      {/* Course Pie Chart */}
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Students By Course
          </h2>

          <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
            {students.length} Students
          </span>
        </div>

        <ResponsiveContainer
          width="100%"
          height={400}
        >
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={130}
              paddingAngle={4}
              label={({ name, percent }) =>
                `${name} (${(
                  percent * 100
                ).toFixed(0)}%)`
              }
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index %
                      COLORS.length]
                  }
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Year Distribution */}
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Students By Year
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="year" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="students"
              fill="#3B82F6"
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StudentChart;