import AdminLayout from "../../components/admin/AdminLayout";
import { useEffect, useState } from "react";
import api from "../../api/axios";

const ROLES = [
  "student",
  "faculty",
  "librarian",
  "lab_admin",
  "admin"
];

function Users() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("student");
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);


  useEffect(() => {
  const fetchUsers = async () => {
    const res = await api.get(`users/admin/getUsers?role=${role}`);
    setUsers(res.data.users);
    setSelectedUserId(null);
  };

  fetchUsers();
}, [role]);

  const confirmDeleteUser = async () => {
    if (!selectedUserId) return;

    await api.delete(`users/admin/delete/${selectedUserId}`);
    setUsers(users.filter((u) => u._id !== selectedUserId));
    setSelectedUserId(null);
    setShowConfirmModal(false);
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    semester: "",
    labName: ""
  });

  const handleCreateUser = async () => {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    if (formData.role === "student") {
      payload.extra = { semester: formData.semester };
    }

    if (formData.role === "lab_admin") {
      payload.extra = { labName: formData.labName };
    }

    try {
      await api.post("users/admin/create", payload);

      // close modal & reset form
      setShowAddUserModal(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
        semester: "",
        labName: ""
      });

      // refresh list
      const res = await api.get(`users/admin/getUsers?role=${role}`);
      setUsers(res.data.users);

    } catch (err) {
      console.error("User creation failed:", err);
    }
  };


  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Users</h1>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded w-64"
          />

          <button
            onClick={() => setShowAddUserModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Role Dropdown */}
      <div className="mb-4">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Users Table */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr
              key={u._id}
              onClick={() => setSelectedUserId(u._id)}
              className={`border-b text-center cursor-pointer ${
                selectedUserId === u._id ? "bg-blue-100" : ""
              }`}
            >
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Button */}
      {selectedUserId && (
        <div className="mt-4">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete Selected User
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">
              Confirm Deletion
            </h2>
            <p className="mb-6">
              Are you sure you want to delete this user?  
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDeleteUser}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddUserModal && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add New User</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border px-3 py-2 w-full rounded"
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="border px-3 py-2 w-full rounded"
              />

              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="border px-3 py-2 w-full rounded"
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="border px-3 py-2 w-full rounded"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.toUpperCase()}
                  </option>
                ))}
              </select>

              {/* Conditional fields */}
              {formData.role === "student" && (
                <input
                  type="number"
                  placeholder="Semester"
                  value={formData.semester}
                  onChange={(e) =>
                    setFormData({ ...formData, semester: e.target.value })
                  }
                  className="border px-3 py-2 w-full rounded"
                />
              )}

              {formData.role === "lab_admin" && (
                <input
                  type="text"
                  placeholder="Lab Name"
                  value={formData.labName}
                  onChange={(e) =>
                    setFormData({ ...formData, labName: e.target.value })
                  }
                  className="border px-3 py-2 w-full rounded"
                />
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Create User
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}

export default Users;
