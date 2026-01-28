import AdminLayout from "../../components/admin/AdminLayout";

function Timetable() {
  const uploadCSV = (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    // api.post("/admin/timetable/upload", formData)
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-bold mb-4">Upload Timetable</h1>

      <input type="file" accept=".csv" onChange={uploadCSV} />
    </AdminLayout>
  );
}

export default Timetable;
