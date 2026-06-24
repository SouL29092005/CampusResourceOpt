import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Users,
  BookOpen,
  FlaskConical,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { getDashboardStats } from "../../api/admin.api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    totalEquipments: 0,
    totalActiveBookings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch stats");
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardStats = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      title: "Books",
      value: stats.totalBooks,
      icon: BookOpen,
    },
    {
      title: "Equipments",
      value: stats.totalEquipments,
      icon: FlaskConical,
    },
    {
      title: "Active Bookings",
      value: stats.totalActiveBookings,
      icon: CalendarDays,
    },
  ];

  return (
    <AdminLayout>
      {/* Welcome Banner */}
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold">
          Welcome Back, Admin 👋
        </h1>

        <p className="mt-2 text-blue-100">
          Manage campus resources, monitor activity,
          and keep everything running smoothly.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700 border border-red-200">
          Failed to load statistics: {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                rounded-3xl
                border
                bg-white
                p-6
                shadow-sm
                transition-all
                hover:-translate-y-1
                hover:shadow-xl
              "
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {loading ? "..." : item.value.toLocaleString()}
                  </h2>
                </div>

                <div className="rounded-2xl bg-blue-100 p-3">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lower Grid */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="space-y-3">
            <button 
              onClick={() => navigate("/admin/users")}
              className="flex w-full items-center justify-between rounded-xl border p-3 hover:bg-gray-50 transition-colors"
            >
              Add New User
              <ArrowUpRight size={18} />
            </button>

            <button 
              onClick={() => navigate("/admin/library")}
              className="flex w-full items-center justify-between rounded-xl border p-3 hover:bg-gray-50 transition-colors"
            >
              Add Book
              <ArrowUpRight size={18} />
            </button>

            <button 
              onClick={() => navigate("/admin/lab")}
              className="flex w-full items-center justify-between rounded-xl border p-3 hover:bg-gray-50 transition-colors"
            >
              Add Equipment
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Recent Activity
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <span>User registered</span>
              <span className="text-sm text-gray-500">
                2 mins ago
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <span>Equipment booked</span>
              <span className="text-sm text-gray-500">
                15 mins ago
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <span>Book issued</span>
              <span className="text-sm text-gray-500">
                30 mins ago
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Room reservation created</span>
              <span className="text-sm text-gray-500">
                1 hour ago
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;