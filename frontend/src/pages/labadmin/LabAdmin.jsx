import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewProfile from "../../components/profile/ViewProfile";
import {
  addEquipment,
  cancelBooking,
  deleteEquipment,
  getActiveBookings,
  getAllEquipments,
} from "../../api/lab.api";
import { getMyProfile } from "../../api/profile.api";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  CalendarClock,
  Cpu,
  FlaskConical,
  LayoutDashboard,
  Loader2,
  LogOut,
  Plus,
  Trash2,
  UserCircle2,
  Wrench,
  XCircle,
} from "lucide-react";

export default function LabAdmin() {
  const [equipments, setEquipments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingEquipments, setLoadingEquipments] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [userName, setUserName] = useState("");
  const [labName, setLabName] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    labName: "",
    location: "",
  });

  const navigate = useNavigate();

  const fetchEquipments = async () => {
    try {
      setLoadingEquipments(true);
      const res = await getAllEquipments();
      setEquipments(
        Array.isArray(res?.data?.equipments) ? res.data.equipments : [],
      );
    } catch (err) {
      console.error(err);
      setEquipments([]);
    } finally {
      setLoadingEquipments(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await getActiveBookings();
      setBookings(Array.isArray(res?.data?.bookings) ? res.data.bookings : []);
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await getMyProfile();
      const profileLabName = res.data.profile?.labName || "";
      setLabName(profileLabName);
      setFormData((prev) => ({
        ...prev,
        labName: profileLabName || prev.labName,
      }));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem("userName");
    if (name) setUserName(name);
    fetchEquipments();
    fetchBookings();
    loadProfile();
  }, []);

  const handleAddEquipment = async () => {
    if (!formData.name.trim() || !formData.labName.trim()) {
      alert("Equipment name and lab name are required");
      return;
    }

    try {
      setSubmitLoading(true);
      await addEquipment(formData);
      setShowAddModal(false);
      setFormData({
        name: "",
        description: "",
        labName: labName,
        location: "",
      });
      await fetchEquipments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add equipment");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteEquipment = async () => {
    if (!selectedEquipment) return;

    try {
      setDeleteLoading(true);
      await deleteEquipment(selectedEquipment._id);
      setShowDeleteModal(false);
      setSelectedEquipment(null);
      await fetchEquipments();
      await fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete equipment");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      setCancelLoadingId(bookingId);
      await cancelBooking(bookingId);
      await fetchBookings();
      await fetchEquipments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <Card className="border-0 bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-900 text-white shadow-md">
          <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Avatar className="h-14 w-14 border-2 border-white/20">
                <AvatarFallback className="bg-violet-600 text-lg font-bold text-white">
                  {userName?.charAt(0).toUpperCase() || "L"}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-7 w-7 text-violet-300" />
                  <h1 className="text-3xl font-bold tracking-tight">
                    Lab Admin Dashboard
                  </h1>
                </div>
                <p className="mt-1 text-sm text-violet-200">
                  Welcome back,
                  <span className="ml-1 font-semibold text-white">
                    {userName || "Lab Admin"}
                  </span>
                  {labName && (
                    <span className="ml-2 text-violet-300">· {labName}</span>
                  )}
                </p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="gap-2 rounded-xl px-5 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-12 rounded-xl bg-slate-100 p-1">
            <TabsTrigger
              value="dashboard"
              className="gap-2 rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="gap-2 rounded-lg px-5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <UserCircle2 className="h-4 w-4" />
              My Profile
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "profile" && <ViewProfile />}

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              <Card className="shadow-sm">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      My Equipments
                    </p>
                    <h2 className="mt-1 text-3xl font-bold">
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
                    <h2 className="mt-1 text-3xl font-bold">
                      {bookings.length}
                    </h2>
                  </div>
                  <Activity className="h-10 w-10 text-green-600" />
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <h2 className="mt-1 text-3xl font-bold">
                      {
                        equipments.filter((e) => e.status === "available")
                          .length
                      }
                    </h2>
                  </div>
                  <Badge className="bg-green-100 px-3 py-1 text-base text-green-700 hover:bg-green-100">
                    Available
                  </Badge>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance</p>
                    <h2 className="mt-1 text-3xl font-bold">
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

            {/* All Lab Equipments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    My Laboratory Equipments
                  </CardTitle>
                  <CardDescription>
                    Equipment you maintain. Click delete to remove an item.
                  </CardDescription>
                </div>
                <Button onClick={() => setShowAddModal(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Equipment
                </Button>
              </CardHeader>

              <CardContent>
                {loadingEquipments ? (
                  <div className="flex h-48 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : equipments.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center text-center">
                    <Cpu className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="font-medium">No equipments yet</p>
                    <p className="text-sm text-muted-foreground">
                      Add your first piece of lab equipment to get started.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Equipment</TableHead>
                          <TableHead>Laboratory</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {equipments.map((eq) => (
                          <TableRow key={eq._id} className="hover:bg-muted/50">
                            <TableCell>
                              <Badge variant="outline">
                                #{eq.equipmentNumber}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{eq.name}</p>
                                {eq.description && (
                                  <p className="text-xs text-muted-foreground">
                                    {eq.description}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{eq.labName}</TableCell>
                            <TableCell>{eq.location || "—"}</TableCell>
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
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="destructive"
                                className="
    gap-2
    cursor-pointer
    rounded-lg
    bg-red-600
    text-white
    hover:bg-red-900
    hover:text-white
    transition-all
    duration-200
    shadow-sm
    hover:shadow-md
  "
                                onClick={() => {
                                  setSelectedEquipment(eq);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Bookings */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-primary" />
                    Equipment Bookings
                  </CardTitle>
                  <CardDescription>
                    Active bookings for equipment you maintain.
                  </CardDescription>
                </div>
                <Badge variant="secondary">{bookings.length} Active</Badge>
              </CardHeader>

              <CardContent>
                {loadingBookings ? (
                  <div className="flex h-48 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center text-center">
                    <CalendarClock className="mb-3 h-10 w-10 text-muted-foreground" />
                    <p className="font-medium">No active bookings</p>
                    <p className="text-sm text-muted-foreground">
                      Bookings on your equipment will appear here.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Equipment</TableHead>
                          <TableHead>Lab</TableHead>
                          <TableHead>Booked By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Time Slot</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.map((booking) => (
                          <TableRow
                            key={booking._id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {booking.equipment?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  #{booking.equipment?.equipmentNumber}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>{booking.equipment?.labName}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {booking.bookedBy?.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {booking.bookedBy?.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(booking.startTime).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(booking.startTime).toLocaleTimeString()}{" "}
                              – {new Date(booking.endTime).toLocaleTimeString()}
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                                {booking.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-2"
                                disabled={cancelLoadingId === booking._id}
                                onClick={() => handleCancelBooking(booking._id)}
                              >
                                <XCircle className="h-4 w-4" />
                                {cancelLoadingId === booking._id
                                  ? "Cancelling..."
                                  : "Cancel"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md rounded-lg bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Add Equipment</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Equipment Name</Label>
                  <Input
                    placeholder="Microscope, Oscilloscope, etc."
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Lab Name</Label>
                  <Input
                    placeholder="Physics Lab"
                    value={formData.labName}
                    onChange={(e) =>
                      setFormData({ ...formData, labName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    placeholder="Building A, Room 101"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <textarea
                    placeholder="Optional description"
                    className="min-h-20 w-full rounded-md border p-2"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </Button>
                <Button onClick={handleAddEquipment} disabled={submitLoading}>
                  {submitLoading ? "Saving..." : "Save Equipment"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && selectedEquipment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-sm rounded-lg bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-red-600">
                Delete Equipment
              </h2>
              <p className="mb-6 text-sm text-gray-700">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{selectedEquipment.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={deleteLoading}
                  onClick={handleDeleteEquipment}
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
