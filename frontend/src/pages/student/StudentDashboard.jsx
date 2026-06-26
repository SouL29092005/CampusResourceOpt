import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyIssues } from "../../api/library.api";
import {
  getMyBookings,
  getAllEquipments,
  getFreeSlots,
  bookEquipment,
  cancelBooking,
} from "../../api/lab.api";
import ViewProfile from "../../components/profile/ViewProfile";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  GraduationCap,
  LayoutDashboard,
  User,
  BookOpen,
  FlaskConical,
  CalendarDays,
  Plus,
  Trash2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import Footer from "@/components/Footer";

export default function StudentDashboard() {
  const [issues, setIssues] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [equipments, setEquipments] = useState([]);

  const [loadingIssues, setLoadingIssues] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [, setLoadingEquipments] = useState(true);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [freeSlots, setFreeSlots] = useState([]);
  const [slotLoading, setSlotLoading] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const fetchIssues = async () => {
    try {
      setLoadingIssues(true);
      const res = await getMyIssues();
      setIssues(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setIssues([]);
    } finally {
      setLoadingIssues(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await getMyBookings();
      const all = Array.isArray(res?.data?.bookings) ? res.data.bookings : [];
      // only show active bookings
      setBookings(all.filter((b) => b.status === "active"));
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

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

  useEffect(() => {
    fetchIssues();
    fetchBookings();
    fetchEquipments();
    // read user name stored at login
    const n = localStorage.getItem("userName");
    if (n) setUserName(n);
  }, []);

  const openBookingModal = async (equipment) => {
    setSelectedEquipment(equipment);
    setShowBookingModal(true);
    setCustomStart("");
    setCustomEnd("");
    setSlotLoading(true);
    try {
      const res = await getFreeSlots(equipment.equipmentNumber);
      setFreeSlots(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch free slots");
      setFreeSlots([]);
    } finally {
      setSlotLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedEquipment) {
      alert("Please select equipment first");
      return;
    }

    if (!customStart || !customEnd) {
      alert("Please provide start and end times");
      return;
    }

    const start = new Date(customStart);
    const end = new Date(customEnd);

    if (isNaN(start) || isNaN(end)) {
      alert("Invalid start or end time");
      return;
    }

    if (start >= end) {
      alert("Start time must be before end time");
      return;
    }

    const now = new Date();
    const maxAllowedDate = new Date();
    maxAllowedDate.setDate(now.getDate() + 3);

    if (start < now || end > maxAllowedDate) {
      alert("Booking must be within the next 3 days and not in the past");
      return;
    }

    const payload = {
      equipmentNumber: selectedEquipment.equipmentNumber,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
    };

    try {
      setBookingLoading(true);
      await bookEquipment(payload);
      alert("Booked successfully");
      setShowBookingModal(false);
      setSelectedEquipment(null);
      setCustomStart("");
      setCustomEnd("");
      fetchBookings();
      fetchEquipments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to book equipment");
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await cancelBooking(id);
      fetchBookings();
      fetchEquipments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <Card className="mb-8 overflow-hidden border-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl">
          <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>

              <div>
                <p className="text-sm font-medium text-blue-100">
                  Welcome back,
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
                  {userName || "Student"}
                </h1>

                <p className="mt-2 text-sm text-blue-100">
                  Manage your library books, laboratory bookings, and campus
                  resources from one place.
                </p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="secondary"
              className="gap-2 rounded-xl bg-white text-slate-900 shadow-md hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="rounded-2xl bg-slate-100 p-2 py-6">
            <TabsTrigger
              value="dashboard"
              className="cursor-pointer rounded-xl px-8 py-4 text-base font-medium"
            >
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Dashboard
            </TabsTrigger>

            <TabsTrigger
              value="profile"
              className="cursor-pointer rounded-xl px-8 py-4 text-base font-medium"
            >
              <User className="mr-2 h-5 w-5" />
              My Profile
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Profile Tab */}
        {activeTab === "profile" && <ViewProfile />}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            <div className="space-y-6">
              <Card className="rounded-2xl shadow-sm border hover:shadow-md transition-all">
                {/* Header */}
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      My Borrowed Books
                    </CardTitle>

                    <CardDescription className={"py-2"}>
                      Currently issued books
                    </CardDescription>
                  </div>

                  <Badge variant="secondary">{issues.length} Books</Badge>
                </CardHeader>

                {/* Borrowed Books Table */}
                {loadingIssues ? (
                  <p className="text-gray-500">Loading...</p>
                ) : issues.length === 0 ? (
                  <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-slate-900">
                      No Borrowed Books
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-slate-500">
                      You don't have any borrowed books at the moment. Any books
                      you borrow from the library will appear here.
                    </p>
                  </CardContent>
                ) : (
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Book</TableHead>
                            <TableHead>Issued</TableHead>
                            <TableHead>Due</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {issues.map((iss) => (
                            <TableRow key={iss._id}>
                              <TableCell className="font-medium">
                                {iss.book?.title}
                              </TableCell>

                              <TableCell className="text-muted-foreground">
                                {new Date(iss.issuedAt).toLocaleDateString()}
                              </TableCell>

                              <TableCell className="text-muted-foreground">
                                {new Date(iss.dueAt).toLocaleDateString()}
                              </TableCell>

                              <TableCell>
                                <Badge
                                  variant={
                                    iss.status === "OVERDUE"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                >
                                  {iss.status}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                )}
              </Card>

              <Card className="rounded-2xl border shadow-sm transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <FlaskConical className="h-5 w-5 text-indigo-600" />
                      My Lab Bookings
                    </CardTitle>

                    <CardDescription>
                      View and manage your active laboratory equipment bookings.
                    </CardDescription>
                  </div>

                  <Button
                    onClick={() => {
                      setShowBookingModal(true);
                      setSelectedEquipment(null);
                      setFreeSlots([]);
                      setCustomStart("");
                      setCustomEnd("");
                    }}
                    className="cursor-pointer rounded-xl"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Book Equipment
                  </Button>
                </CardHeader>

                <CardContent>
                  {loadingBookings ? (
                    <p className="text-muted-foreground">Loading bookings...</p>
                  ) : bookings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                        <CalendarDays className="h-8 w-8 text-indigo-600" />
                      </div>

                      <h3 className="mt-5 text-lg font-semibold">
                        No Active Bookings
                      </h3>

                      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                        You haven't booked any laboratory equipment yet.
                      </p>

                      <Button
                        className="mt-6"
                        onClick={() => {
                          setShowBookingModal(true);
                          setSelectedEquipment(null);
                          setFreeSlots([]);
                          setCustomStart("");
                          setCustomEnd("");
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Book Equipment
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Equipment</TableHead>
                            <TableHead>Lab</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {bookings.map((b) => (
                            <TableRow key={b._id}>
                              <TableCell className="font-medium">
                                {b.equipment?.name}
                              </TableCell>

                              <TableCell>
                                <Badge variant="secondary">
                                  {b.equipment?.labName}
                                </Badge>
                              </TableCell>

                              <TableCell className="text-muted-foreground">
                                {new Date(b.startTime).toLocaleDateString()}
                              </TableCell>

                              <TableCell className="text-muted-foreground">
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

                              <TableCell className="text-right">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="cursor-pointer"
                                  onClick={() => handleCancel(b._id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
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
            </div>

            {/* Booking modal */}
            {showBookingModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative">
                  <h2 className="text-lg font-semibold mb-4">Book Equipment</h2>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Select Equipment
                      </label>
                      <select
                        className="w-full border p-2 rounded"
                        onChange={(e) => {
                          const eq = equipments.find(
                            (x) => x._id === e.target.value,
                          );
                          if (eq) openBookingModal(eq);
                        }}
                      >
                        <option value="">-- Select --</option>
                        {equipments.map((eq) => (
                          <option
                            key={eq._id}
                            value={eq._id}
                          >{`#${eq.equipmentNumber} - ${eq.name} (${eq.labName})`}</option>
                        ))}
                      </select>
                    </div>

                    {selectedEquipment && (
                      <div className="bg-gray-50 p-3 rounded">
                        <h3 className="font-semibold">
                          {selectedEquipment.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {selectedEquipment.description}
                        </p>

                        <div className="mt-3">
                          <h4 className="font-medium">
                            Available Slots (next 3 days)
                          </h4>

                          {slotLoading ? (
                            <p className="text-gray-500">Loading slots...</p>
                          ) : freeSlots.length === 0 ? (
                            <p className="text-gray-500">
                              No free slots available.
                            </p>
                          ) : (
                            <div className="space-y-2 mt-2">
                              {freeSlots.map((s, idx) => (
                                <div key={idx} className="p-2 border rounded">
                                  <div className="text-sm">
                                    {new Date(s.freeFrom).toLocaleString()} –{" "}
                                    {new Date(s.freeTo).toLocaleString()}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm text-gray-700 mb-1">
                                Start Time
                              </label>
                              <input
                                type="datetime-local"
                                value={customStart}
                                onChange={(e) => setCustomStart(e.target.value)}
                                className="w-full border p-2 rounded"
                              />
                            </div>

                            <div>
                              <label className="block text-sm text-gray-700 mb-1">
                                End Time
                              </label>
                              <input
                                type="datetime-local"
                                value={customEnd}
                                onChange={(e) => setCustomEnd(e.target.value)}
                                className="w-full border p-2 rounded"
                              />
                            </div>
                          </div>

                          <p className="text-xs text-gray-500 mt-2">
                            Note: Free slots are shown for reference only.
                            Please choose your desired start and end times
                            within the 3 day window.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => {
                        setShowBookingModal(false);
                        setSelectedEquipment(null);
                      }}
                      className="px-4 py-2 border rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBook}
                      disabled={bookingLoading}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                      {bookingLoading ? "Booking..." : "Book"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer/>
    </div>
  );
}
