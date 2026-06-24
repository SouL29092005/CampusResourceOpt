import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRooms, createRoomBooking, cancelRoomBooking, getMyRoomBookings } from "../../api/roomBooking.api";
import ViewProfile from "../../components/profile/ViewProfile";

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
      setRooms(allRooms.filter(r => r.isActive && r.isBookable));
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
      setBookings(all.filter(b => b.status === "active"));
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
      auditorium: "Auditorium"
    };
    return labels[type] || type;
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Faculty Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome, {userName || 'Faculty'}!</p>
        </div>

        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded font-semibold hover:bg-red-700">Logout</button>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 flex gap-4 border-b-2">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "dashboard"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          My Profile
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && <ViewProfile />}

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Room Bookings */}
            <div className="bg-white p-6 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">My Room Bookings</h2>
                <button
                  onClick={() => openBookingModal(null)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  + Book Room
                </button>
              </div>

              {loadingBookings ? (
                <p className="text-gray-500">Loading...</p>
              ) : bookings.length === 0 ? (
                <p className="text-gray-500">No active room bookings found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">Booking #</th>
                        <th className="p-2 border">Room</th>
                        <th className="p-2 border">Type</th>
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Time</th>
                        <th className="p-2 border">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b._id}>
                          <td className="p-2 border">#{b.bookingNumber}</td>
                          <td className="p-2 border">{b.roomId}</td>
                          <td className="p-2 border">{getRoomTypeLabel(b.roomType)}</td>
                          <td className="p-2 border">{new Date(b.startTime).toLocaleDateString()}</td>
                          <td className="p-2 border">
                            {new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – {new Date(b.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="p-2 border">
                            <button onClick={() => handleCancel(b._id)} className="text-red-600 hover:underline">Cancel</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Available Rooms */}
            <div className="bg-white p-6 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Available Rooms</h2>
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={roomSearch}
                  onChange={(e) => setRoomSearch(e.target.value)}
                  className="border px-3 py-1 rounded w-48 text-sm"
                />
              </div>

              {loadingRooms ? (
                <p className="text-gray-500">Loading...</p>
              ) : rooms.length === 0 ? (
                <p className="text-gray-500">No rooms available for booking.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {rooms
                    .filter((room) => {
                      const search = roomSearch.toLowerCase();
                      return (
                        room.roomId.toLowerCase().includes(search) ||
                        room.roomType.toLowerCase().includes(search) ||
                        room.location.toLowerCase().includes(search) ||
                        (room.department && room.department.toLowerCase().includes(search)) ||
                        (room.facilities && room.facilities.some(f => f.toLowerCase().includes(search)))
                      );
                    })
                    .map((room) => (
                    <div key={room._id} className="border rounded p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{room.roomId}</h3>
                          <p className="text-sm text-gray-600">{getRoomTypeLabel(room.roomType)} • Capacity: {room.capacity}</p>
                          <p className="text-sm text-gray-500">{room.location}</p>
                          {room.facilities?.length > 0 && (
                            <p className="text-xs text-gray-400 mt-1">
                              Facilities: {room.facilities.join(", ")}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => openBookingModal(room)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Booking Modal */}
          {showBookingModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-lg rounded-lg p-6 relative">
                <h2 className="text-lg font-semibold mb-4">Book Room</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Select Room</label>
                    <select
                      className="w-full border p-2 rounded"
                      value={selectedRoom?.roomId || ""}
                      onChange={(e) => {
                        const room = rooms.find(r => r.roomId === e.target.value);
                        setSelectedRoom(room || null);
                      }}
                    >
                      <option value="">-- Select a Room --</option>
                      {rooms.map(room => (
                        <option key={room._id} value={room.roomId}>
                          {room.roomId} - {getRoomTypeLabel(room.roomType)} ({room.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedRoom && (
                    <div className="bg-gray-50 p-3 rounded">
                      <h3 className="font-semibold">{selectedRoom.roomId}</h3>
                      <p className="text-sm text-gray-600">
                        {getRoomTypeLabel(selectedRoom.roomType)} • Capacity: {selectedRoom.capacity}
                      </p>
                      <p className="text-sm text-gray-500">{selectedRoom.location}</p>
                      {selectedRoom.facilities?.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          Facilities: {selectedRoom.facilities.join(", ")}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Start Time</label>
                      <input
                        type="datetime-local"
                        value={bookingStart}
                        onChange={(e) => setBookingStart(e.target.value)}
                        className="w-full border p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">End Time</label>
                      <input
                        type="datetime-local"
                        value={bookingEnd}
                        onChange={(e) => setBookingEnd(e.target.value)}
                        className="w-full border p-2 rounded"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Note: Room bookings are checked against existing bookings and scheduled classes.
                  </p>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => { setShowBookingModal(false); setSelectedRoom(null); }}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBook}
                    disabled={bookingLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {bookingLoading ? 'Booking...' : 'Book Room'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
