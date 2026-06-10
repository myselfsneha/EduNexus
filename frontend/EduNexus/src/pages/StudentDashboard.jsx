function StudentDashboard() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">
        Student Dashboard 🎓
      </h1>

      <p className="mb-4">
        Welcome Student
      </p>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}

export default StudentDashboard;