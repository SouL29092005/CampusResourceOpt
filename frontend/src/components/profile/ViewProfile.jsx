import { useState, useEffect } from "react";
import { getMyProfile } from "../../api/profile.api";
import EditProfileModal from "./EditProfileModal";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui";
import {
  CircleCheck,
  Info,
  Mail,
  Pencil,
  Shield,
  User,
  UserCircle2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";

export default function ViewProfile() {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMyProfile();
      setUserData(res.data.user);
      setProfileData(res.data.profile);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfileData(updatedProfile);
    setShowEditModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="space-y-8">
            {/* Header */}
            <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 shadow-xl">
              <CardContent className="p-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  {/* Left */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                      <AvatarFallback className="bg-white text-3xl font-bold text-blue-600">
                        {userData?.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h1 className="text-4xl font-bold tracking-tight text-white">
                        {userData?.name}
                      </h1>

                      <p className="mt-2 flex items-center gap-2 text-blue-100">
                        <Mail className="h-4 w-4" />
                        {userData?.email}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3">
                        <Badge className="bg-white/20 text-white hover:bg-white/30">
                          <Shield className="mr-1 h-3 w-3" />
                          {userData?.role?.replace(/_/g, " ")}
                        </Badge>

                        <Badge
                          className={
                            userData?.isActive
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-red-500 text-white hover:bg-red-600"
                          }
                        >
                          {userData?.isActive ? "● Active" : "● Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Right */}
                  {userData?.role === "faculty" && (
                    <Button
                      size="lg"
                      onClick={() => setShowEditModal(true)}
                      className="cursor-pointer rounded-xl bg-white text-slate-900 shadow-md transition-all hover:scale-105 hover:bg-slate-100"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* User Information */}
            <Card className="mb-8 rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Personal Information</CardTitle>

                <CardDescription>
                  Basic information associated with your account.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-5 md:grid-cols-2">
                  {/* Name */}
                  <div className="rounded-xl border p-5 transition hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-3">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>

                        <p className="text-lg font-semibold">
                          {userData?.name}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="rounded-xl border p-5 transition hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-violet-100 p-3">
                        <Mail className="h-5 w-5 text-violet-600" />
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>

                        <p className="text-lg font-semibold break-all">
                          {userData?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="rounded-xl border p-5 transition hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-amber-100 p-3">
                        <Shield className="h-5 w-5 text-amber-600" />
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">Role</p>

                        <p className="text-lg font-semibold capitalize">
                          {userData?.role?.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="rounded-xl border p-5 transition hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-green-100 p-3">
                        <CircleCheck className="h-5 w-5 text-green-600" />
                      </div>

                      <div>
                        <p className="text-sm text-muted-foreground">
                          Account Status
                        </p>

                        <Badge
                          className="mt-2"
                          variant={
                            userData?.isActive ? "default" : "destructive"
                          }
                        >
                          {userData?.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile-Specific Information */}
            {profileData && (
              <Card className="rounded-2xl border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Info className="h-6 w-6 text-indigo-600" />
                    Profile Details
                  </CardTitle>

                  <CardDescription>
                    Additional information associated with your account.
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="grid gap-5 md:grid-cols-2">
                    {Object.entries(profileData).map(([key, value]) => {
                      if (
                        key === "_id" ||
                        key === "userId" ||
                        key === "__v" ||
                        key === "createdAt" ||
                        key === "updatedAt" ||
                        key === "borrowedBooks" ||
                        key === "activeEquipment" ||
                        key === "availableSlots" ||
                        key === "preferredSlots"
                      ) {
                        return null;
                      }

                      // ---------- Courses ----------
                      if (Array.isArray(value) && key === "courses") {
                        return (
                          <div
                            key={key}
                            className="rounded-xl border p-5 transition-all hover:shadow-sm md:col-span-2"
                          >
                            <p className="text-sm font-medium text-muted-foreground">
                              Subjects
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {value.length === 0 ? (
                                <Badge variant="secondary">
                                  No subjects assigned
                                </Badge>
                              ) : (
                                value.map((c) => (
                                  <Badge
                                    key={c._id || c}
                                    variant="outline"
                                    className="px-3 py-1 text-sm"
                                  >
                                    {typeof c === "string"
                                      ? c
                                      : `${c.courseName} (${c.courseCode})`}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </div>
                        );
                      }

                      // ---------- Other Arrays ----------
                      if (Array.isArray(value)) {
                        if (value.length === 0) return null;

                        return (
                          <div
                            key={key}
                            className="rounded-xl border p-5 transition-all hover:shadow-sm"
                          >
                            <p className="text-sm font-medium text-muted-foreground">
                              {key.charAt(0).toUpperCase() +
                                key.slice(1).replace(/([A-Z])/g, " $1")}
                            </p>

                            <Badge className="mt-3" variant="secondary">
                              {value.length} items
                            </Badge>
                          </div>
                        );
                      }

                      // ---------- Normal Fields ----------
                      return (
                        <div
                          key={key}
                          className="rounded-xl border p-5 transition-all hover:shadow-sm"
                        >
                          <p className="text-sm font-medium text-muted-foreground">
                            {key.charAt(0).toUpperCase() +
                              key.slice(1).replace(/([A-Z])/g, " $1")}
                          </p>

                          <p className="mt-2 text-lg font-semibold text-slate-900 break-words">
                            {value || "Not set"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profileData={profileData}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
}
