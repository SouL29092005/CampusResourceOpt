import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Archive,
  Ban,
  Building2,
  CalendarDays,
  CalendarOff,
  CalendarPlus,
  CheckCircle2,
  DoorOpen,
  Edit,
  Filter,
  Plus,
  RotateCcw,
  Search,
  XCircle,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from "@/components/ui";

const ROOM_TYPES = ["classroom", "laboratory", "seminar_hall", "auditorium"];

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roomTypeFilter, setRoomTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [bookingUserFilter, setBookingUserFilter] = useState("all");
  const [formData, setFormData] = useState({
    roomId: "",
    location: "",
    roomType: "",
    capacity: "",
    facilities: "",
    department: "",
  });
  const [bookingData, setBookingData] = useState({
    roomId: "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const fetchBookings = useCallback(async () => {
    try {
      const params = {};

      if (bookingStatusFilter !== "all") {
        params.status = bookingStatusFilter;
      }

      if (bookingUserFilter !== "all") {
        params.bookedBy = bookingUserFilter;
      }

      const res = await api.get("/roomBooking/room-bookings", {
        params,
      });

      setBookings(res.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  }, [bookingStatusFilter, bookingUserFilter]);

  const [editMode, setEditMode] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const openEditModal = (room) => {
    setEditMode(true);
    setEditingRoomId(room.roomId);
    setFormData({
      roomId: room.roomId,
      location: room.location,
      roomType: room.roomType,
      capacity: room.capacity,
      facilities: room.facilities?.join(", ") || "",
      department: room.department || "",
    });
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelBooking = async () => {
    try {
      setCancelLoading(true);

      await api.patch(
        `/roomBooking/room-booking/${selectedBooking._id}/cancel`,
      );

      setShowCancelModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancelLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        location: formData.location,
        roomType: formData.roomType,
        capacity: Number(formData.capacity),
        facilities: formData.facilities
          ? formData.facilities.split(",").map((f) => f.trim())
          : [],
        department: formData.department || undefined,
      };

      if (editMode) {
        await api.patch(`/room/${editingRoomId}/update`, payload);
      } else {
        await api.post("/room/addRoom", {
          roomId: formData.roomId,
          ...payload,
        });
      }

      setShowAddModal(false);
      setEditMode(false);
      setEditingRoomId(null);

      setFormData({
        roomId: "",
        location: "",
        roomType: "",
        capacity: "",
        facilities: "",
        department: "",
      });

      fetchRooms();
    } catch (err) {
      console.error(err);
      alert("Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const deactivateBooking = async (roomId) => {
    try {
      await api.patch(`/room/${roomId}/bookable`);
      fetchRooms();
    } catch (err) {
      console.error("Failed to deactivate booking", err);
    }
  };

  const reactivateRoom = async (roomId) => {
    try {
      await api.patch(`/room/${roomId}/reactivate`);
      fetchRooms();
    } catch (err) {
      console.error("Failed to reactivate room", err);
    }
  };

  const reactivateBooking = async (roomId) => {
    try {
      await api.patch(`/room/${roomId}/bookable/reactivate`);
      fetchRooms();
    } catch (err) {
      console.error("Failed to reactivate booking", err);
    }
  };

  const handleCreateBooking = async () => {
    try {
      setBookingLoading(true);
      setBookingError("");

      const { roomId, date, startTime, endTime } = bookingData;

      if (!roomId || !date || !startTime || !endTime) {
        setBookingError("All fields are required");
        return;
      }

      const start = new Date(`${date}T${startTime}`);
      const end = new Date(`${date}T${endTime}`);

      if (start >= end) {
        setBookingError("End time must be after start time");
        return;
      }

      await api.post("roomBooking/room-booking", {
        roomId,
        startTime: start,
        endTime: end,
      });

      setShowBookingModal(false);
      fetchBookings();
    } catch (err) {
      const msg =
        err.response?.data?.message || "Room already booked or timetable clash";
      setBookingError(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);

      const res = await api.get("/room/getRooms");

      setRooms(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch rooms", err);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const deactivateRoom = async (roomId) => {
    try {
      await api.patch(`/room/${roomId}/deactivate`);
      fetchRooms();
    } catch (err) {
      console.error("Failed to deactivate room", err);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.roomId.toLowerCase().includes(search.toLowerCase()) ||
      room.location.toLowerCase().includes(search.toLowerCase()) ||
      (room.department || "").toLowerCase().includes(search.toLowerCase());

    const matchesRoomType =
      roomTypeFilter === "all" || room.roomType === roomTypeFilter;

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
          ? room.isActive
          : !room.isActive;

    return matchesSearch && matchesRoomType && matchesStatus;
  });

  return (
    <>
      <AdminLayout>
        <div className="mx-auto max-w-7xl p-6">
          {/* Top */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Title */}
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-slate-900">
                <DoorOpen className="h-7 w-7 text-primary" />
                Rooms
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage campus rooms and room bookings.
              </p>
            </div>

            {/* Actions Buttons*/}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowBookingModal(true)}
                className="cursor-pointer rounded-xl border-slate-300 px-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:shadow-md"
              >
                <CalendarPlus className="mr-2 h-5 w-5" />
                Book Room
              </Button>

              <Button
                size="lg"
                onClick={() => setShowAddModal(true)}
                className="cursor-pointer rounded-xl px-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <Plus className="mr-2 h-5 w-5" />
                Add Room
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6 rounded-2xl border-0 shadow-md">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold">Filters</h2>
              </div>

              <div className="flex flex-col gap-4 md:flex-row">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    placeholder="Search room, location or department..."
                    className="pl-10"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Room Type */}
                <Select
                  value={roomTypeFilter}
                  onValueChange={setRoomTypeFilter}
                >
                  <SelectTrigger className="w-[190px]">
                    <SelectValue placeholder="All Room Types" />
                  </SelectTrigger>

                  <SelectContent className="bg-white border shadow-lg">
                    <SelectItem value="all">All Room Types</SelectItem>

                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[170px]">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>

                  <SelectContent className="bg-white border shadow-lg">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Rooms Table */}
          <Card className="overflow-hidden rounded-xl border-0 bg-white shadow-md">
            <CardContent className="p-0">
              {loading ? (
                <div className="flex h-40 items-center justify-center text-muted-foreground">
                  Loading rooms...
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 py-5 shadow-sm">
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight">
                        Rooms Directory
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Manage and monitor all campus rooms
                      </p>
                    </div>

                    <Badge variant="secondary" className="px-3 py-1">
                      {filteredRooms.length} Rooms
                    </Badge>
                  </div>

                  {/* Table Element */}
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead>Room ID</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Facilities</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Booking</TableHead>
                          <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {filteredRooms.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              className="h-32 text-center text-muted-foreground"
                            >
                              No rooms found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredRooms.map((room) => (
                            <TableRow
                              key={room._id}
                              className="border-b border-slate-100 transition-colors hover:bg-slate-50"
                            >
                              <TableCell className="font-medium">
                                {room.roomId}
                              </TableCell>

                              <TableCell>{room.location}</TableCell>

                              <TableCell>
                                <Badge variant="secondary">
                                  {room.roomType
                                    .replace("_", " ")
                                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                                </Badge>
                              </TableCell>

                              <TableCell>
                                <Badge variant="outline">{room.capacity}</Badge>
                              </TableCell>

                              <TableCell>{room.department || "-"}</TableCell>

                              <TableCell>
                                {room.facilities?.length ? (
                                  <div className="flex flex-wrap gap-1">
                                    {room.facilities
                                      .slice(0, 2)
                                      .map((facility) => (
                                        <Badge key={facility} variant="outline">
                                          {facility}
                                        </Badge>
                                      ))}

                                    {room.facilities.length > 2 && (
                                      <Badge variant="secondary">
                                        +{room.facilities.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </TableCell>

                              <TableCell>
                                <Badge
                                  className={
                                    room.isActive
                                      ? "bg-green-100 text-green-700 hover:bg-green-100"
                                      : "bg-slate-100 text-slate-700 hover:bg-slate-100"
                                  }
                                >
                                  {room.isActive ? "Active" : "Archived"}
                                </Badge>
                              </TableCell>

                              <TableCell>
                                {room.isActive ? (
                                  <Badge
                                    className={
                                      room.isBookable
                                        ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                    }
                                  >
                                    {room.isBookable ? "Bookable" : "Disabled"}
                                  </Badge>
                                ) : (
                                  "-"
                                )}
                              </TableCell>

                              <TableCell>
                                <div className="flex justify-center gap-2">
                                  {room.isActive ? (
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() =>
                                        deactivateRoom(room.roomId)
                                      }
                                      title="Archive Room"
                                    >
                                      <Archive className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() =>
                                        reactivateRoom(room.roomId)
                                      }
                                      title="Restore Room"
                                    >
                                      <RotateCcw className="h-4 w-4" />
                                    </Button>
                                  )}

                                  {room.isActive &&
                                    (room.isBookable ? (
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={() =>
                                          deactivateBooking(room.roomId)
                                        }
                                        title="Disable Booking"
                                      >
                                        <CalendarOff className="h-4 w-4" />
                                      </Button>
                                    ) : (
                                      <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() =>
                                          reactivateBooking(room.roomId)
                                        }
                                        title="Enable Booking"
                                      >
                                        <CheckCircle2 className="h-4 w-4" />
                                      </Button>
                                    ))}

                                  {room.isActive && (
                                    <Button
                                      size="icon"
                                      variant="outline"
                                      onClick={() => openEditModal(room)}
                                      title="Edit Room"
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Bookings Table */}
          <div className="mt-10">
            {/* Filters */}
            <Card className="mb-6 rounded-xl border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold">Booking Filters</h2>
                </div>

                <div className="flex flex-col gap-4 md:flex-row">
                  <Select
                    value={bookingStatusFilter}
                    onValueChange={setBookingStatusFilter}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Booking Status" />
                    </SelectTrigger>

                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Status</SelectItem>

                      <SelectItem value="active">Active</SelectItem>

                      <SelectItem value="expired">Expired</SelectItem>

                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={bookingUserFilter}
                    onValueChange={setBookingUserFilter}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Booked By" />
                    </SelectTrigger>

                    <SelectContent className="bg-white">
                      <SelectItem value="all">All Users</SelectItem>

                      <SelectItem value="me">My Bookings</SelectItem>

                      <SelectItem value="others">Others</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={fetchBookings} className="w-fit">
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="overflow-hidden rounded-xl border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="flex items-center justify-between px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <CalendarDays className="h-5 w-5 text-primary" />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">Room Bookings</h3>

                      <p className="text-sm text-muted-foreground">
                        View and manage room reservations
                      </p>
                    </div>
                  </div>

                  <Badge variant="secondary">{bookings.length} Bookings</Badge>
                </div>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Booking #</TableHead>

                        <TableHead>Room</TableHead>

                        <TableHead>Date</TableHead>

                        <TableHead>Time</TableHead>

                        <TableHead>Booked By</TableHead>

                        <TableHead>Status</TableHead>

                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {bookings.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="h-32 text-center text-muted-foreground"
                          >
                            No bookings found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        bookings.map((b) => (
                          <TableRow key={b._id} className="hover:bg-slate-50">
                            <TableCell className="font-medium">
                              #{b.bookingNumber}
                            </TableCell>

                            <TableCell>
                              <Badge variant="outline">{b.roomId}</Badge>
                            </TableCell>

                            <TableCell>
                              {new Date(b.startTime).toLocaleDateString()}
                            </TableCell>

                            <TableCell>
                              {new Date(b.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}

                              {" - "}

                              {new Date(b.endTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </TableCell>

                            <TableCell>{b.bookedBy?.name || "-"}</TableCell>

                            <TableCell>
                              <Badge
                                className={
                                  b.status === "active"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : b.status === "expired"
                                      ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                      : "bg-red-100 text-red-700 hover:bg-red-100"
                                }
                              >
                                {b.status}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <div className="flex justify-center">
                                {b.status === "active" ? (
                                  <Button
                                    size="icon"
                                    variant="destructive"
                                    title="Cancel Booking"
                                    onClick={() => {
                                      setSelectedBooking(b);
                                      setShowCancelModal(true);
                                    }}
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>

      <Dialog
        open={showAddModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddModal(false);
            setEditMode(false);
            setEditingRoomId(null);

            setFormData({
              roomId: "",
              location: "",
              roomType: "",
              capacity: "",
              facilities: "",
              department: "",
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl rounded-2xl bg-white border shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Building2 className="h-6 w-6 text-primary" />

              {editMode ? "Edit Room" : "Add Room"}
            </DialogTitle>

            <DialogDescription>
              {editMode
                ? "Update room information."
                : "Create a new room for the campus."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRoom} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Room ID</Label>

                <Input
                  name="roomId"
                  value={formData.roomId}
                  onChange={handleInputChange}
                  disabled={editMode}
                  placeholder="CR-101"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Location</Label>

                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Academic Block A"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Room Type</Label>

                <Select
                  value={formData.roomType}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      roomType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>

                  <SelectContent className="bg-white">
                    {ROOM_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace("_", " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Capacity</Label>

                <Input
                  name="capacity"
                  type="number"
                  min={1}
                  value={formData.capacity}
                  onChange={handleInputChange}
                  placeholder="60"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Facilities</Label>

              <Textarea
                name="facilities"
                value={formData.facilities}
                onChange={handleInputChange}
                placeholder="Projector, AC, Smart Board"
              />

              <p className="text-xs text-muted-foreground">
                Separate multiple facilities with commas.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>

              <Input
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Computer Science"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                className={"cursor-pointer"}
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setEditMode(false);
                  setEditingRoomId(null);

                  setFormData({
                    roomId: "",
                    location: "",
                    roomType: "",
                    capacity: "",
                    facilities: "",
                    department: "",
                  });
                }}
              >
                Cancel
              </Button>

              <Button
                className="cursor-pointer"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : editMode ? "Update Room" : "Add Room"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showBookingModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowBookingModal(false);
            setBookingError("");

            setBookingData({
              roomId: "",
              date: "",
              startTime: "",
              endTime: "",
            });
          }
        }}
      >
        <DialogContent className="sm:max-w-lg rounded-2xl bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <CalendarPlus className="h-6 w-6 text-primary" />
              Book Room
            </DialogTitle>

            <DialogDescription>
              Select a room and booking schedule.
            </DialogDescription>
          </DialogHeader>

          {bookingError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {bookingError}
            </div>
          )}

          <div className="space-y-5">
            {/* Room */}

            <div className="space-y-2">
              <Label>Room</Label>

              <Select
                value={bookingData.roomId}
                onValueChange={(value) =>
                  setBookingData({
                    ...bookingData,
                    roomId: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Room" />
                </SelectTrigger>

                <SelectContent className="bg-white">
                  {rooms
                    .filter((r) => r.isActive && r.isBookable)
                    .map((room) => (
                      <SelectItem key={room.roomId} value={room.roomId}>
                        {room.roomId} • {room.location}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}

            <div className="space-y-2">
              <Label>Date</Label>

              <Input
                type="date"
                value={bookingData.date}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    date: e.target.value,
                  })
                }
              />
            </div>

            {/* Time */}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>

                <Input
                  type="time"
                  value={bookingData.startTime}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      startTime: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>

                <Input
                  type="time"
                  value={bookingData.endTime}
                  onChange={(e) =>
                    setBookingData({
                      ...bookingData,
                      endTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowBookingModal(false);
                  setBookingError("");

                  setBookingData({
                    roomId: "",
                    date: "",
                    startTime: "",
                    endTime: "",
                  });
                }}
                className={"cursor-pointer"}
              >
                Cancel
              </Button>

              <Button
                onClick={handleCreateBooking}
                disabled={bookingLoading}
                className={"cursor-pointer"}
              >
                {bookingLoading ? "Booking..." : "Book Room"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-3">Cancel Booking</h2>

            <p className="mb-4">
              Are you sure you want to cancel booking #
              <strong>{selectedBooking.bookingNumber}</strong>?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                }}
                className="px-4 py-2 border rounded"
              >
                No
              </button>

              <button
                onClick={handleCancelBooking}
                disabled={cancelLoading}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                {cancelLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminRooms;
