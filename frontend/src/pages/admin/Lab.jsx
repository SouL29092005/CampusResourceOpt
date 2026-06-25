import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  getActiveBookings,
  getAllEquipments,
  addEquipment,
  deleteEquipment,
} from "../../api/lab.api";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Cpu,
  User,
  Hash,
  Search,
  Plus,
  CalendarClock,
  FlaskConical,
  Activity,
  Wrench,
} from "lucide-react";

function Lab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [equipments, setEquipments] = useState([]);
  const [equipmentsLoading, setEquipmentsLoading] = useState(true);
  const [equipmentsError, setEquipmentsError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    labName: "",
    location: "",
    maintainedByEmail: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleAddEquipment = async () => {
    try {
      setSubmitLoading(true);

      await addEquipment(formData);

      await fetchEquipments();

      setShowAddModal(false);

      setFormData({
        name: "",
        description: "",
        labName: "",
        location: "",
        maintainedByEmail: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add equipment");
    } finally {
      setSubmitLoading(false);
    }
  };

  const fetchEquipments = async () => {
    try {
      setEquipmentsLoading(true);
      const res = await getAllEquipments();
      setEquipments(
        Array.isArray(res?.data?.equipments) ? res.data.equipments : [],
      );
    } catch (err) {
      setEquipmentsError(
        err.response?.data?.message || "Failed to load equipments",
      );
    } finally {
      setEquipmentsLoading(false);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getActiveBookings();
        setBookings(
          Array.isArray(res?.data?.bookings) ? res.data.bookings : [],
        );
      } catch (err) {
        console.error("Bookings error:", err);
        setBookings([]);
        setError(err.response?.data?.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
    fetchEquipments();
  }, []);

  return (
    <>
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg p-6 relative">
            <h2 className="text-lg font-semibold mb-4">Add Equipment</h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Equipment Name"
                className="w-full border p-2 rounded"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Lab Name"
                className="w-full border p-2 rounded"
                value={formData.labName}
                onChange={(e) =>
                  setFormData({ ...formData, labName: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Location"
                className="w-full border p-2 rounded"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />

              <textarea
                placeholder="Description"
                className="w-full border p-2 rounded"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              {/* Admin-only field */}
              <input
                type="email"
                placeholder="Maintained By (Lab Admin Email)"
                className="w-full border p-2 rounded"
                value={formData.maintainedByEmail}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maintainedByEmail: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              <button
                onClick={handleAddEquipment}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                disabled={submitLoading}
              >
                {submitLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && selectedEquipment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Delete Equipment
            </h2>

            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete
              <span className="font-semibold"> {selectedEquipment.name}</span>?
              <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                disabled={deleteLoading}
                onClick={async () => {
                  try {
                    setDeleteLoading(true);
                    await deleteEquipment(selectedEquipment._id);
                    await fetchEquipments();
                    setShowDeleteModal(false);
                    setSelectedEquipment(null);
                  } catch (err) {
                    alert(
                      err.response?.data?.message ||
                        "Failed to delete equipment",
                    );
                  } finally {
                    setDeleteLoading(false);
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <AdminLayout>
        <div className="space-y-8">
          {/* Header */}

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Laboratory Management
              </h1>

              <p className="text-muted-foreground mt-2">
                Manage laboratory equipments and monitor active bookings.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={() => setShowAddModal(true)}
                className="cursor-pointer rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Equipment
              </Button>
            </div>
          </div>

          <Separator />

          {/* Statistics */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Equipments
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    {equipments.length}
                  </h2>
                </div>

                <FlaskConical className="h-10 w-10 text-primary" />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Active Bookings
                  </p>

                  <h2 className="text-3xl font-bold mt-1">{bookings.length}</h2>
                </div>

                <Activity className="h-10 w-10 text-green-600" />
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Available</p>

                  <h2 className="text-3xl font-bold mt-1">
                    {equipments.filter((e) => e.status === "available").length}
                  </h2>
                </div>

                <Badge className="text-base px-3 py-1 bg-green-100 text-green-700 hover:bg-green-100">
                  Available
                </Badge>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Maintenance</p>

                  <h2 className="text-3xl font-bold mt-1">
                    {
                      equipments.filter((e) => e.status === "maintenance")
                        .length
                    }
                  </h2>
                </div>

                <Wrench className="h-10 w-10 text-yellow-500" />
              </CardContent>
            </Card>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">
              Active Equipment Bookings
            </h2>

            {loading && <p className="text-gray-500">Loading bookings...</p>}

            {error && <p className="text-red-600">{error}</p>}

            {!loading && bookings.length === 0 && (
              <p className="text-gray-500">No active bookings found.</p>
            )}

            {!loading && bookings.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-2 border">Equipment</th>
                      <th className="p-2 border">Lab</th>
                      <th className="p-2 border">Booked By</th>
                      <th className="p-2 border">Date</th>
                      <th className="p-2 border">Time Slot</th>
                      <th className="p-2 border">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="p-2 border">
                          {booking.equipment?.name}
                        </td>

                        <td className="p-2 border">
                          {booking.equipment?.labName}
                        </td>

                        <td className="p-2 border">
                          {booking.bookedBy?.name}
                          <br />
                          <span className="text-xs text-gray-500">
                            {booking.bookedBy?.email}
                          </span>
                        </td>

                        <td className="p-2 border">
                          {new Date(booking.startTime).toLocaleDateString()}
                        </td>

                        <td className="p-2 border">
                          {new Date(booking.startTime).toLocaleTimeString()} –{" "}
                          {new Date(booking.endTime).toLocaleTimeString()}
                        </td>

                        <td className="p-2 border">
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <Card className="mt-8 border-0 shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Cpu className="h-6 w-6 text-primary" />
                    Laboratory Equipments
                  </CardTitle>

                  <CardDescription>
                    Click on any equipment to delete it.
                  </CardDescription>
                </div>

                <Badge variant="secondary">
                  {equipments.length} Equipments
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {equipmentsLoading && (
                <div className="text-center py-10 text-muted-foreground">
                  Loading equipments...
                </div>
              )}

              {equipmentsError && (
                <div className="text-center py-10 text-red-600">
                  {equipmentsError}
                </div>
              )}

              {!equipmentsLoading && equipments.length === 0 && (
                <div className="text-center py-12">
                  <Cpu className="mx-auto h-12 w-12 text-gray-300" />

                  <p className="mt-4 text-muted-foreground">
                    No equipments found.
                  </p>
                </div>
              )}

              {!equipmentsLoading && equipments.length > 0 && (
                <div className="rounded-xl border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>

                        <TableHead>Equipment</TableHead>

                        <TableHead>Laboratory</TableHead>

                        <TableHead>Maintained By</TableHead>

                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {equipments.map((eq) => (
                        <TableRow
                          key={eq._id}
                          onClick={() => {
                            setSelectedEquipment(eq);

                            setShowDeleteModal(true);
                          }}
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <Badge variant="outline">
                              #{eq.equipmentNumber}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <FlaskConical className="h-5 w-5 text-primary" />
                              </div>

                              <div>
                                <p className="font-medium">{eq.name}</p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>{eq.labName}</TableCell>

                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {eq.maintainedBy?.name || "—"}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {eq.maintainedBy?.email}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge
                              className={
                                eq.status === "available"
                                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                                  : eq.status === "in-use"
                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                              }
                            >
                              {eq.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
}

export default Lab;
