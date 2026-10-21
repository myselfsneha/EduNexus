
import { useMemo } from "react";
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
import {
  FaUsers,
  FaGraduationCap,
  FaChartPie,
  FaChartBar,
  FaArrowUp,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const CHART_COLORS = [
  "#8B5CF6",
  "#06B6D4",
  "#A78BFA",
  "#22D3EE",
  "#F59E0B",
  "#F472B6",
  "#34D399",
  "#FB7185",
  "#818CF8",
];

function StudentChart({ students = [] }) {
  const themeContext = useTheme();

  const isDark =
    themeContext?.darkMode ??
    themeContext?.isDark ??
    themeContext?.isDarkMode ??
    themeContext?.theme === "dark";

  const theme = {
    panel: isDark
      ? "border-slate-800 bg-[#111629]"
      : "border-slate-200 bg-white",
    heading: isDark ? "text-white" : "text-slate-900",
    muted: isDark ? "text-slate-400" : "text-slate-500",
    grid: isDark ? "#293247" : "#E2E8F0",
    axis: isDark ? "#94A3B8" : "#64748B",
    tooltipBg: isDark ? "#111629" : "#FFFFFF",
    tooltipBorder: isDark ? "#334155" : "#E2E8F0",
    tooltipText: isDark ? "#F8FAFC" : "#0F172A",
  };

  const { pieData, barData, yearTotals } = useMemo(() => {
    const courseCount = {};
    const yearCount = {};

    students.forEach((student) => {
      const course = student.course || "Unknown";
      const year = String(student.year || "Unknown").trim();

      courseCount[course] = (courseCount[course] || 0) + 1;
      yearCount[year] = (yearCount[year] || 0) + 1;
    });

    const courses = Object.entries(courseCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const years = Object.entries(yearCount).map(([year, count]) => ({
      year,
      students: count,
    }));

    const getYearCount = (...aliases) =>
      aliases.reduce((total, alias) => total + (yearCount[alias] || 0), 0);

    return {
      pieData: courses,
      barData: years,
      yearTotals: [
        {
          label: "1st Year",
          value: getYearCount("1", "First Year"),
          color: "from-violet-500 to-indigo-500",
          iconColor: "text-violet-500",
          iconBg: "bg-violet-500/10",
        },
        {
          label: "2nd Year",
          value: getYearCount("2", "Second Year"),
          color: "from-cyan-500 to-blue-500",
          iconColor: "text-cyan-500",
          iconBg: "bg-cyan-500/10",
        },
        {
          label: "3rd Year",
          value: getYearCount("3", "Third Year"),
          color: "from-amber-500 to-orange-500",
          iconColor: "text-amber-500",
          iconBg: "bg-amber-500/10",
        },
        {
          label: "4th Year",
          value: getYearCount("4", "Fourth Year"),
          color: "from-rose-500 to-pink-500",
          iconColor: "text-rose-500",
          iconBg: "bg-rose-500/10",
        },
      ],
    };
  }, [students]);

  const totalStudents = students.length;
  const courseCount = pieData.length;
  const yearCount = barData.length;

  const chartTooltipStyle = {
    backgroundColor: theme.tooltipBg,
    border: `1px solid ${theme.tooltipBorder}`,
    borderRadius: "12px",
    color: theme.tooltipText,
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    padding: "10px 14px",
  };

  const chartHeading = (icon, eyebrow, title, description) => (
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-violet-500/15 bg-violet-500/10 text-violet-500">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-500">
          {eyebrow}
        </p>
        <h2 className={`mt-1 text-lg font-bold sm:text-xl ${theme.heading}`}>
          {title}
        </h2>
        <p className={`mt-1 text-sm ${theme.muted}`}>
          {description}
        </p>
      </div>
    </div>
  );

  if (totalStudents === 0) {
    return (
      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#17132f] via-[#211747] to-[#10263d] p-6 text-white sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />

          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-violet-200">
              <FaChartBar />
              EDUNEXUS / ANALYTICS
            </div>
            <h1 className="text-2xl font-black sm:text-3xl">
              Student Analytics
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Your institution's student insights, all in one place.
            </p>
          </div>
        </div>

        <div
          className={`rounded-3xl border p-8 text-center sm:p-14 ${theme.panel}`}
        >
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 text-3xl text-violet-500">
            <FaChartPie />
          </div>
          <h2 className={`text-xl font-bold ${theme.heading}`}>
            Your analytics start here
          </h2>
          <p className={`mx-auto mt-2 max-w-md text-sm leading-6 ${theme.muted}`}>
            No student records are available yet. Once students are added,
            course distribution, year-wise enrollment, and student statistics
            will appear here automatically.
          </p>
          <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 text-sm font-semibold text-violet-500">
            <FaGraduationCap />
            Waiting for student data
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-w-0 space-y-6">
      {/* Analytics hero */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-[#17132f] via-[#211747] to-[#10263d] p-6 text-white shadow-xl shadow-violet-950/10 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 right-1/3 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-white/5 px-3 py-1.5 text-xs font-semibold tracking-wide text-violet-200">
              <FaChartBar />
              EDUNEXUS / ANALYTICS
            </div>

            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Student Analytics
              <span className="ml-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300">
                / Insights.
              </span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Less guesswork, more insight. Explore student enrollment by
              course and academic year.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:min-w-56">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl text-cyan-300">
              <FaUsers />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300">
                Total enrollment
              </p>
              <p className="mt-0.5 text-3xl font-black">
                {totalStudents}
              </p>
              <p className="mt-1 text-xs text-cyan-300">
                <FaArrowUp className="mr-1 inline" />
                Live student data
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div
          className={`group relative overflow-hidden rounded-2xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${theme.panel}`}
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/10 blur-2xl transition group-hover:bg-violet-500/20" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className={`text-sm font-medium ${theme.muted}`}>
                Total Students
              </p>
              <p className={`mt-3 text-3xl font-black ${theme.heading}`}>
                {totalStudents}
              </p>
              <p className="mt-2 text-xs font-semibold text-violet-500">
                Across all courses
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-lg text-violet-500">
              <FaUsers />
            </div>
          </div>
          <div className="mt-5 h-1 overflow-hidden rounded-full bg-violet-500/10">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" />
          </div>
        </div>

        {yearTotals.map((year) => {
          const percentage =
            totalStudents > 0
              ? Math.round((year.value / totalStudents) * 100)
              : 0;

          return (
            <div
              key={year.label}
              className={`group rounded-2xl border p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lg ${theme.panel}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className={`text-sm font-medium ${theme.muted}`}>
                    {year.label}
                  </p>
                  <p className={`mt-3 text-3xl font-black ${theme.heading}`}>
                    {year.value}
                  </p>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${year.iconBg} ${year.iconColor}`}
                >
                  <FaGraduationCap className="text-lg" />
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-2">
                <span className={`text-xs ${theme.muted}`}>
                  Share of students
                </span>
                <span className={`text-xs font-bold ${year.iconColor}`}>
                  {percentage}%
                </span>
              </div>

              <div
                className={`mt-2 h-1.5 overflow-hidden rounded-full ${isDark ? "bg-slate-800" : "bg-slate-100"}`}
              >
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${year.color} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Course distribution */}
        <div className={`min-w-0 rounded-3xl border p-5 shadow-sm sm:p-6 ${theme.panel}`}>
          {chartHeading(
            <FaChartPie />,
            "COURSE BREAKDOWN",
            "Students by Course",
            "See how enrollment is distributed across courses."
          )}

          <div className="mb-4 flex flex-wrap gap-2">
            <span className={`rounded-lg px-3 py-2 text-xs ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
              {courseCount} {courseCount === 1 ? "course" : "courses"}
            </span>
            <span className="rounded-lg bg-violet-500/10 px-3 py-2 text-xs font-semibold text-violet-500">
              {totalStudents} students
            </span>
          </div>

          {pieData.length === 0 ? (
            <div className={`flex h-72 items-center justify-center text-sm ${theme.muted}`}>
              No course data available.
            </div>
          ) : (
            <div className="h-[320px] w-full sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius="48%"
                    outerRadius="72%"
                    paddingAngle={3}
                    cornerRadius={5}
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`${entry.name}-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    itemStyle={{ color: theme.tooltipText }}
                    formatter={(value, name) => [
                      `${value} ${Number(value) === 1 ? "student" : "students"}`,
                      name,
                    ]}
                  />

                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{
                      fontSize: "12px",
                      color: theme.axis,
                      paddingTop: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className={`mt-4 space-y-3 border-t pt-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
            {pieData.slice(0, 5).map((course, index) => {
              const percentage = Math.round(
                (course.value / totalStudents) * 100
              );

              return (
                <div key={course.name}>
                  <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                    <span className={`flex min-w-0 items-center gap-2 font-medium ${theme.heading}`}>
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      <span className="truncate">{course.name}</span>
                    </span>
                    <span className={`shrink-0 ${theme.muted}`}>
                      {course.value} · {percentage}%
                    </span>
                  </div>
                  <div
                    className={`h-1.5 overflow-hidden rounded-full ${isDark ? "bg-slate-800" : "bg-slate-100"}`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor:
                          CHART_COLORS[index % CHART_COLORS.length],
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Year distribution */}
        <div className={`min-w-0 rounded-3xl border p-5 shadow-sm sm:p-6 ${theme.panel}`}>
          {chartHeading(
            <FaChartBar />,
            "ACADEMIC BREAKDOWN",
            "Students by Year",
            "Compare student counts across recorded academic years."
          )}

          <div className="mb-4 flex flex-wrap gap-2">
            <span className={`rounded-lg px-3 py-2 text-xs ${isDark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
              {yearCount} {yearCount === 1 ? "year group" : "year groups"}
            </span>
            <span className="rounded-lg bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-500">
              {totalStudents} students
            </span>
          </div>

          {barData.length === 0 ? (
            <div className={`flex h-72 items-center justify-center text-sm ${theme.muted}`}>
              No academic-year data available.
            </div>
          ) : (
            <div className="h-[320px] w-full sm:h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 12, right: 8, left: -18, bottom: 8 }}
                  barCategoryGap="28%"
                >
                  <defs>
                    <linearGradient
                      id="studentBarGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke={theme.grid}
                    strokeDasharray="4 5"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="year"
                    tick={{ fill: theme.axis, fontSize: 11 }}
                    axisLine={{ stroke: theme.grid }}
                    tickLine={false}
                    tickMargin={10}
                    interval={0}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: theme.axis, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                  />

                  <Tooltip
                    contentStyle={chartTooltipStyle}
                    itemStyle={{ color: theme.tooltipText }}
                    cursor={{
                      fill: isDark
                        ? "rgba(139,92,246,0.08)"
                        : "rgba(139,92,246,0.06)",
                    }}
                    formatter={(value) => [
                      `${value} ${Number(value) === 1 ? "student" : "students"}`,
                      "Enrollment",
                    ]}
                    labelStyle={{
                      color: theme.tooltipText,
                      fontWeight: 700,
                      marginBottom: 4,
                    }}
                  />

                  <Bar
                    dataKey="students"
                    name="Students"
                    fill="url(#studentBarGradient)"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={56}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className={`mt-4 flex items-start gap-3 rounded-xl border p-4 ${isDark ? "border-cyan-500/15 bg-cyan-500/5" : "border-cyan-500/15 bg-cyan-50/60"}`}>
            <FaGraduationCap className="mt-0.5 shrink-0 text-cyan-500" />
            <p className={`text-xs leading-5 ${theme.muted}`}>
              Year groups are based on the values stored in student records.
              Unrecognized or missing year values remain visible as their
              recorded group instead of being discarded.
            </p>
          </div>
        </div>
      </div>

      {/* Summary footer */}
      <div className={`flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 ${theme.panel}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 text-violet-500">
            <FaChartBar />
          </div>
          <div>
            <p className={`text-sm font-bold ${theme.heading}`}>
              Analytics overview
            </p>
            <p className={`mt-1 text-xs ${theme.muted}`}>
              Calculated from the current student records.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-lg bg-violet-500/10 px-3 py-2 font-semibold text-violet-500">
            {courseCount} courses
          </span>
          <span className="rounded-lg bg-cyan-500/10 px-3 py-2 font-semibold text-cyan-500">
            {yearCount} year groups
          </span>
        </div>
      </div>
    </section>
  );
}

export default StudentChart;