import AdminLayout from "../../components/admin/AdminLayout";

function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded shadow">Users</div>
        <div className="bg-white p-4 rounded shadow">Books</div>
        <div className="bg-white p-4 rounded shadow">Equipments</div>
        <div className="bg-white p-4 rounded shadow">Bookings</div>
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;
