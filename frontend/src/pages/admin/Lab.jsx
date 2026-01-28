import AdminLayout from "../../components/admin/AdminLayout";

function Lab() {
  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-4">Lab Equipments</h1>

      <div className="bg-white p-6 rounded shadow">
        <p>Add equipments & view bookings</p>
      </div>
    </AdminLayout>
  );
}

export default Lab;
