import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllRooms,
  createRoomBooking,
  cancelRoomBooking,
  getMyRoomBookings,
} from "../../api/roomBooking.api";
import ViewProfile from "../../components/profile/ViewProfile";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
} from "@/components/ui";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Building2,
  CalendarClock,
  CalendarDays,
  CalendarPlus,
  GraduationCap,
  Info,
  LayoutDashboard,
  LogOut,
  MapPin,
  Plus,
  Search,
  UserCircle2,
  Users,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function FacultyDashboard() {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingStart, setBookingStart] = useState("");
  const [bookingEnd, setBookingEnd] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [roomSearch, setRoomSearch] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const res = await getAllRooms();
      const allRooms = Array.isArray(res?.data?.data) ? res.data.data : [];
      setRooms(allRooms.filter((r) => r.isActive && r.isBookable));
    } catch (err) {
      console.error(err);
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await getMyRoomBookings();
      const all = Array.isArray(res?.data) ? res.data : [];
      setBookings(all.filter((b) => b.status === "active"));
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchBookings();
    const n = localStorage.getItem("userName");
    if (n) setUserName(n);
  }, []);

  const openBookingModal = (room = null) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
    setBookingStart("");
    setBookingEnd("");
  };

  const handleBook = async () => {
    if (!selectedRoom) {
      alert("Please select a room first");
      return;
    }

    if (!bookingStart || !bookingEnd) {
      alert("Please provide start and end times");
      return;
    }

    const start = new Date(bookingStart);
    const end = new Date(bookingEnd);

    if (isNaN(start) || isNaN(end)) {
      alert("Invalid start or end time");
      return;
    }

    if (start >= end) {
      alert("Start time must be before end time");
      return;
    }

    const now = new Date();
    if (start < now) {
      alert("Start time cannot be in the past");
      return;
    }

    const payload = {
      roomId: selectedRoom.roomId,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };

    try {
      setBookingLoading(true);
      await createRoomBooking(payload);
      alert("Room booked successfully");
      setShowBookingModal(false);
      setSelectedRoom(null);
      setBookingStart("");
      setBookingEnd("");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to book room");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelRoomBooking(bookingId);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const getRoomTypeLabel = (type) => {
    const labels = {
      classroom: "Classroom",
      laboratory: "Laboratory",
      seminar_hall: "Seminar Hall",
      auditorium: "Auditorium",
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <Card className="mb-6 overflow-hidden border-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shadow-xl">
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}
              <div className="flex items-center gap-5">
                <Avatar className="h-16 w-16 border-2 border-white/20">
                  <AvatarFallback className="bg-white text-xl font-bold text-blue-600">
                    {userName?.charAt(0).toUpperCase() || "F"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-7 w-7 text-blue-100" />

                    <h1 className="text-3xl font-bold tracking-tight text-white">
                      Faculty Dashboard
                    </h1>
                  </div>

                  <p className="mt-2 text-blue-100">
                    Welcome back,
                    <span className="ml-1 font-semibold text-white">
                      {userName || "Faculty"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right */}
              <Button
                size="lg"
                variant="secondary"
                onClick={handleLogout}
                className="cursor-pointer gap-2 rounded-xl bg-white text-slate-900 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex items-center justify-between">
            <TabsList className="h-12 rounded-xl border bg-muted/60 p-1 shadow-sm">
              <TabsTrigger
                value="dashboard"
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </TabsTrigger>

              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
              >
                <UserCircle2 className="h-4 w-4" />
                My Profile
              </TabsTrigger>
            </TabsList>

            <div className="hidden md:flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm text-muted-foreground">
                Faculty Portal
              </span>
            </div>
          </div>
        </Tabs>

        {/* Profile Tab */}
        {activeTab === "profile" && <ViewProfile />}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            <section className="space-y-6">
              {/* Section Header */}

              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 ring-1 ring-blue-200">
                    <CalendarDays className="h-6 w-6 text-blue-600" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Room Booking Management
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      Reserve campus rooms and manage your active bookings.
                    </p>
                  </div>
                </div>

                <Badge
                  variant="secondary"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1"
                >
                  <Building2 className="h-3.5 w-3.5" />
                  Room Services
                </Badge>
              </div>

              {/* Content */}

              <div className="grid gap-6 lg:grid-cols-2">
                {/* My Room Bookings */}
                <Card className="h-full shadow-sm border-0">
                  <CardHeader className="border-b">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <CalendarClock className="h-5 w-5 text-blue-600" />
                          My Room Bookings
                        </CardTitle>

                        <CardDescription>
                          View, manage, and cancel your active room
                          reservations.
                        </CardDescription>
                      </div>

                      <Button
                        onClick={() => openBookingModal(null)}
                        className="gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Book Room
                      </Button>
                    </div>
                  </CardHeader>

                  {/* Loading Booked Rooms */}
                  <CardContent className="pt-6">
                    {loadingBookings ? (
                      <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                          <Skeleton
                            key={i}
                            className="h-14 w-full rounded-lg"
                          />
                        ))}
                      </div>
                    ) : bookings.length === 0 ? (
                      <div className="flex h-60 flex-col items-center justify-center text-center">
                        <CalendarClock className="mb-3 h-12 w-12 text-muted-foreground" />

                        <h3 className="text-lg font-semibold">
                          No Active Bookings
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          You don't have any active room bookings.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Booking #</TableHead>
                              <TableHead>Room</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead className="text-right">
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>

                          <TableBody>
                            {bookings.map((b) => (
                              <TableRow key={b._id}>
                                <TableCell className="font-medium">
                                  #{b.bookingNumber}
                                </TableCell>

                                <TableCell>{b.roomId}</TableCell>

                                <TableCell>
                                  <Badge variant="secondary">
                                    {getRoomTypeLabel(b.roomType)}
                                  </Badge>
                                </TableCell>

                                <TableCell>
                                  {new Date(b.startTime).toLocaleDateString()}
                                </TableCell>

                                <TableCell>
                                  {new Date(b.startTime).toLocaleTimeString(
                                    [],
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    },
                                  )}
                                  {" - "}
                                  {new Date(b.endTime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </TableCell>

                                <TableCell className="text-right">
                                  <Button
                                    className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleCancel(b._id)}
                                  >
                                    Cancel
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Available Rooms */}
                <Card className="h-full shadow-sm border-0">
                  <CardHeader className="border-b">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <Building2 className="h-5 w-5 text-blue-600" />
                          Available Rooms
                        </CardTitle>

                        <CardDescription>
                          Browse campus rooms and reserve a space for your
                          activities.
                        </CardDescription>
                      </div>

                      <div className="relative w-full lg:w-72">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          placeholder="Search by room, type, location..."
                          value={roomSearch}
                          onChange={(e) => setRoomSearch(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    {loadingRooms ? (
                      <div className="space-y-4">
                        {[...Array(4)].map((_, index) => (
                          <Card key={index}>
                            <CardContent className="p-4 space-y-3">
                              <Skeleton className="h-5 w-40" />
                              <Skeleton className="h-4 w-56" />
                              <Skeleton className="h-4 w-44" />
                              <Skeleton className="h-10 w-full" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : rooms.length === 0 ? (
                      <div className="flex h-64 flex-col items-center justify-center text-center">
                        <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />

                        <h3 className="text-lg font-semibold">
                          No Rooms Available
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          There are currently no rooms available for booking.
                        </p>
                      </div>
                    ) : (
                      <ScrollArea className="h-[600px] pr-2">
                        <div className="space-y-4">
                          {rooms
                            .filter((room) => {
                              const search = roomSearch.toLowerCase();

                              return (
                                room.roomId.toLowerCase().includes(search) ||
                                room.roomType.toLowerCase().includes(search) ||
                                room.location.toLowerCase().includes(search) ||
                                (room.department &&
                                  room.department
                                    .toLowerCase()
                                    .includes(search)) ||
                                (room.facilities &&
                                  room.facilities.some((facility) =>
                                    facility.toLowerCase().includes(search),
                                  ))
                              );
                            })
                            .map((room) => (
                              <Card
                                key={room._id}
                                className="transition-all duration-200 hover:shadow-md hover:border-primary/30"
                              >
                                <CardContent className="p-5">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-3 flex-1">
                                      {/* Header */}
                                      <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                                          <Building2 className="h-5 w-5 text-blue-600" />
                                        </div>

                                        <div>
                                          <h3 className="font-semibold text-lg">
                                            {room.roomId}
                                          </h3>

                                          <Badge variant="secondary">
                                            {getRoomTypeLabel(room.roomType)}
                                          </Badge>
                                        </div>
                                      </div>

                                      {/* Information */}
                                      <div className="grid gap-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                          <MapPin className="h-4 w-4" />
                                          {room.location}
                                        </div>

                                        <div className="flex items-center gap-2">
                                          <Users className="h-4 w-4" />
                                          Capacity: {room.capacity}
                                        </div>

                                        {room.department && (
                                          <div className="flex items-center gap-2">
                                            <GraduationCap className="h-4 w-4" />
                                            {room.department}
                                          </div>
                                        )}
                                      </div>

                                      {/* Facilities */}
                                      {room.facilities?.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                          {room.facilities.map((facility) => (
                                            <Badge
                                              key={facility}
                                              variant="outline"
                                            >
                                              {facility}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* Book Button */}
                                    <Button
                                      onClick={() => openBookingModal(room)}
                                      className="ml-6"
                                    >
                                      <CalendarPlus className="mr-2 h-4 w-4" />
                                      Book
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Booking Modal */}
            {showBookingModal && (
              <Dialog
                open={showBookingModal}
                onOpenChange={(open) => {
                  if (!open) {
                    setShowBookingModal(false);
                    setSelectedRoom(null);
                  }
                }}
              >
                <DialogContent className="bg-white border border-gray-200 shadow-2xl rounded-2xl sm:max-w-2xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
                  {/* Header */}
                  <DialogHeader className="border-b px-6 py-5">
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                      <CalendarPlus className="h-6 w-6 text-blue-600" />
                      Book a Room
                    </DialogTitle>

                    <DialogDescription>
                      Reserve a campus room for classes, meetings, seminars, or
                      other academic activities.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto px-6 py-5">
                    <div className="space-y-6">
                      {/* Room Selection */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-5 w-5 text-blue-600" />

                          <div>
                            <h3 className="font-semibold">Select a Room</h3>
                            <p className="text-sm text-muted-foreground">
                              Choose the room you want to reserve.
                            </p>
                          </div>
                        </div>

                        <Select
                          value={selectedRoom?.roomId || ""}
                          onValueChange={(value) => {
                            const room = rooms.find((r) => r.roomId === value);
                            setSelectedRoom(room || null);
                          }}
                        >
                          <SelectTrigger className="w-full cursor-pointer bg-white">
                            <SelectValue placeholder="Select a room" />
                          </SelectTrigger>

                          <SelectContent className="bg-white border shadow-lg">
                            {rooms.map((room) => (
                              <SelectItem
                                key={room._id}
                                value={room.roomId}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4 text-muted-foreground" />

                                  <span className="font-medium">
                                    {room.roomId}
                                  </span>

                                  <span className="text-muted-foreground">
                                    • {getRoomTypeLabel(room.roomType)}
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </section>

                      {/* Selected Room Preview */}
                      <section>
                        {selectedRoom ? (
                          <Card className="border-blue-200 bg-blue-50/40 shadow-sm">
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between">
                                <div className="space-y-4 flex-1">
                                  {/* Room Header */}
                                  <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100">
                                      <Building2 className="h-5 w-5 text-blue-600" />
                                    </div>

                                    <div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-lg font-semibold">
                                          {selectedRoom.roomId}
                                        </h3>

                                        <Badge variant="secondary">
                                          {getRoomTypeLabel(
                                            selectedRoom.roomType,
                                          )}
                                        </Badge>
                                      </div>

                                      <p className="text-sm text-muted-foreground">
                                        Ready to be booked
                                      </p>
                                    </div>
                                  </div>

                                  {/* Details */}
                                  <div className="grid gap-2 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4" />
                                      {selectedRoom.location}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Users className="h-4 w-4" />
                                      Capacity: {selectedRoom.capacity}
                                    </div>

                                    {selectedRoom.department && (
                                      <div className="flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4" />
                                        {selectedRoom.department}
                                      </div>
                                    )}
                                  </div>

                                  {/* Facilities */}
                                  {selectedRoom.facilities?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {selectedRoom.facilities.map(
                                        (facility) => (
                                          <Badge
                                            key={facility}
                                            variant="outline"
                                          >
                                            {facility}
                                          </Badge>
                                        ),
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <Card className="border-dashed">
                            <CardContent className="flex h-32 flex-col items-center justify-center text-center">
                              <Building2 className="mb-3 h-10 w-10 text-muted-foreground" />

                              <h3 className="font-medium">No Room Selected</h3>

                              <p className="text-sm text-muted-foreground">
                                Select a room above to preview its details.
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </section>

                      {/* Booking Time */}
                      <section className="space-y-4">
                        <div className="flex items-center gap-2">
                          <CalendarClock className="h-5 w-5 text-blue-600" />

                          <div>
                            <h3 className="font-semibold">Booking Schedule</h3>
                            <p className="text-sm text-muted-foreground">
                              Select the date and time for your room
                              reservation.
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          {/* Start Time */}
                          <div className="space-y-2">
                            <Label htmlFor="booking-start">Start Time</Label>

                            <Input
                              id="booking-start"
                              type="datetime-local"
                              value={bookingStart}
                              onChange={(e) => setBookingStart(e.target.value)}
                              className="cursor-pointer"
                            />
                          </div>

                          {/* End Time */}
                          <div className="space-y-2">
                            <Label htmlFor="booking-end">End Time</Label>

                            <Input
                              id="booking-end"
                              type="datetime-local"
                              value={bookingEnd}
                              onChange={(e) => setBookingEnd(e.target.value)}
                              className="cursor-pointer"
                            />
                          </div>
                        </div>
                      </section>

                      {/* Information */}
                      <section>
                        <Alert className="border-blue-200 bg-blue-50">
                          <Info className="h-4 w-4 text-blue-600" />

                          <AlertTitle>Booking Information</AlertTitle>

                          <AlertDescription className="mt-2 space-y-2">
                            <p>
                              Room availability is automatically checked against
                              existing bookings and scheduled classes.
                            </p>

                            <ul className="list-disc space-y-1 pl-5 text-sm">
                              <li>
                                Select a room before choosing the booking time.
                              </li>
                              <li>
                                Ensure the end time is later than the start
                                time.
                              </li>
                              <li>
                                Bookings cannot overlap with scheduled classes.
                              </li>
                              <li>
                                You can cancel your booking anytime before it
                                expires.
                              </li>
                            </ul>
                          </AlertDescription>
                        </Alert>
                      </section>
                    </div>
                  </div>

                  {/* Footer */}
                  <DialogFooter className="border-t px-6 py-4 cursor-pointer">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowBookingModal(false);
                        setSelectedRoom(null);
                      }}
                    >
                      Cancel
                    </Button>

                    <Button className="cursor-pointer" onClick={handleBook} disabled={bookingLoading}>
                      {bookingLoading ? "Booking..." : "Book Room"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
      </div>
    </div>
  );
}
