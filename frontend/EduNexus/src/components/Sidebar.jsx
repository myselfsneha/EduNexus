import {
  FaUsers,
  FaGraduationCap,
  FaChartLine,
  FaCog
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white p-6">

      <h1 className="text-2xl font-bold mb-10">
        EduNexus
      </h1>

      <ul className="space-y-6">

        <li className="flex items-center gap-3">
          <FaUsers />
          Students
        </li>

        <li className="flex items-center gap-3">
          <FaGraduationCap />
          Courses
        </li>

        <li className="flex items-center gap-3">
          <FaChartLine />
          Analytics
        </li>

        <li className="flex items-center gap-3">
          <FaCog />
          Settings
        </li>

      </ul>
    </div>
  );
}