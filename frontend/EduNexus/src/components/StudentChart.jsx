import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function StudentChart({ students = [] }) {
  const courseCount = {};

  students.forEach((student) => {
    const course = student.course || "Unknown";

    courseCount[course] =
      (courseCount[course] || 0) + 1;
  });

  const data = Object.keys(courseCount).map(
    (course) => ({
      name: course,
      value: courseCount[course],
    })
  );

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

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Students By Course
        </h2>

        <div className="text-gray-500 py-16">
          No student data available
        </div>
      </div>
    );
  }

  return (
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
        height={380}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={75}
            outerRadius={125}
            paddingAngle={4}
            label={({ name, percent }) =>
              `${name} (${(
                percent * 100
              ).toFixed(0)}%)`
            }
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  COLORS[index % COLORS.length]
                }
              />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow:
                "0 8px 24px rgba(0,0,0,0.15)",
            }}
          />

          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StudentChart;