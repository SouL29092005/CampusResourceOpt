import AdminLayout from "../../components/admin/AdminLayout";
import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
  CheckCircle2,
  Filter,
  Search,
  Plus,
  Trash2,
  Users as UsersIcon,
  UserPlus,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

const ROLES = ["student", "faculty", "librarian", "lab_admin", "admin"];

function Users() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("student");
  const [search, setSearch] = useState("");

  const [selectedUserId, setSelectedUserId] = useState(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    semester: "",
    labName: "",
  });

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

  const handleCreateUser = async () => {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };

    if (formData.role === "student") {
      payload.extra = {
        semester: formData.semester,
      };
    }

    if (formData.role === "lab_admin") {
      payload.extra = {
        labName: formData.labName,
      };
    }

    try {
      await api.post("users/admin/create", payload);

      setShowAddUserModal(false);

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "student",
        semester: "",
        labName: "",
      });

      const res = await api.get(`users/admin/getUsers?role=${role}`);

      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  // const getRoleBadge = (role) => {
  //   switch (role) {
  //     case "admin":
  //       return "destructive";
  //     case "faculty":
  //       return "secondary";
  //     default:
  //       return "outline";
  //   }
  // };

  const roleStyles = {
    student: "bg-emerald-100 text-emerald-700",

    faculty: "bg-blue-100 text-blue-700",

    librarian: "bg-orange-100 text-orange-700",

    lab_admin: "bg-purple-100 text-purple-700",

    admin: "bg-red-100 text-red-700",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Hero Card */}
        <Card className="overflow-hidden rounded-3xl border-0 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 shadow-xl">
          <CardContent className="p-8 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              {/* Left */}
              <div className="space-y-5">
                <Badge className="w-fit bg-white/20 text-white hover:bg-white/20 border-0 px-3 py-1">
                  Campus Resource Management System
                </Badge>

                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                    User Management
                  </h1>

                  <p className="mt-3 max-w-2xl text-blue-100 text-lg leading-relaxed">
                    Create, manage and organize students, faculty, librarians
                    and administrators across the campus with a centralized
                    dashboard.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    Students
                  </Badge>

                  <Badge variant="secondary" className="rounded-full">
                    Faculty
                  </Badge>

                  <Badge variant="secondary" className="rounded-full">
                    Librarians
                  </Badge>

                  <Badge variant="secondary" className="rounded-full">
                    Admins
                  </Badge>
                </div>
              </div>

              {/* Right */}

              <div className="flex flex-col items-start lg:items-end gap-5">
                <Button
                  size="lg"
                  onClick={() => setShowAddUserModal(true)}
                  className="
            bg-white
            text-blue-700
            hover:bg-blue-50
            rounded-xl
            px-7
            shadow-lg
          "
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Add User
                </Button>

                <div className="grid grid-cols-2 gap-3 w-full lg:w-auto">
                  <Card className="bg-white/15 border-white/20 shadow-none">
                    <CardContent className="p-4">
                      <p className="text-xs text-blue-100 uppercase tracking-wide">
                        Total Users
                      </p>

                      <h2 className="text-3xl font-bold text-white">
                        {filteredUsers.length}
                      </h2>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/15 border-white/20 shadow-none">
                    <CardContent className="p-4">
                      <p className="text-xs text-blue-100 uppercase tracking-wide">
                        Selected Role
                      </p>

                      <h2 className="text-xl font-semibold text-white capitalize">
                        {role}
                      </h2>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Users
                </p>

                <h2 className="text-4xl font-bold mt-2">
                  {filteredUsers.length}
                </h2>

                <p className="text-sm text-emerald-600 mt-2">
                  Active in the selected role
                </p>
              </div>

              <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                <UsersIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search + Filter */}
        <Card className="rounded-2xl border shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left */}
              <div className="flex flex-col sm:flex-row flex-1 gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />

                  <Input
                    placeholder="Search users by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="
                    h-11
                    rounded-xl
                    pl-11
                    border-slate-200
                    shadow-none
                    focus-visible:ring-2
                    focus-visible:ring-blue-500
                  "
                  />
                </div>

                {/* Role */}

                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Filter className="h-5 w-5 text-blue-600" />
                  </div>

                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger
                      className="
    h-11
    w-full
    sm:w-[220px]
    rounded-xl
    border
    border-slate-200
    !bg-white
    hover:!bg-white
    shadow-sm
  "
                    >
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent
                      className="
    bg-white
    border
    border-slate-200
    rounded-xl
    shadow-xl
  "
                    >
                      {ROLES.map((r) => (
                        <SelectItem
                          className="
    cursor-pointer
    rounded-md
    focus:bg-slate-100
  "
                          key={r}
                          value={r}
                        >
                          {r
                            .replace("_", " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Right */}

              <Badge
                variant="secondary"
                className="
                h-11
                px-5
                rounded-xl
                text-sm
                font-semibold
                self-start
                lg:self-auto
              "
              >
                <UsersIcon className="mr-2 h-4 w-4" />
                {filteredUsers.length} Users
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="rounded-2xl shadow-sm border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl">Users</CardTitle>

              <CardDescription>Manage all registered users</CardDescription>
            </div>

            <Badge variant="secondary">{filteredUsers.length} Users</Badge>
          </CardHeader>

          <Separator />

          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="pl-6">User</TableHead>

                  <TableHead>Email</TableHead>

                  <TableHead>Role</TableHead>

                  <TableHead className="text-right pr-6">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <TableRow
                      key={u._id}
                      onClick={() => setSelectedUserId(u._id)}
                      className={`cursor-pointer transition-all ${
                        selectedUserId === u._id
                          ? "bg-blue-50"
                          : "hover:bg-muted/40"
                      }`}
                    >
                      <TableCell className="pl-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-11 w-11">
                            <AvatarFallback className="bg-blue-600 text-white font-semibold">
                              {u.name
                                .split(" ")
                                .map((word) => word[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>

                          <div>
                            <p className="font-semibold">{u.name}</p>

                            <p className="text-xs text-muted-foreground">
                              Campus User
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div>
                          <p className="font-medium">{u.email}</p>

                          <p className="text-xs text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </p>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge className={roleStyles[u.role]}>{u.role}</Badge>
                      </TableCell>

                      <TableCell className="text-right pr-6">
                        <Badge
                          className="
                          bg-green-100
                          text-green-700
                          hover:bg-green-100
                          rounded-full
                        "
                        >
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {selectedUserId && (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-5 py-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />

              <span className="font-medium text-blue-800">1 user selected</span>
            </div>

            <Button
              onClick={() => setShowConfirmModal(true)}
              className="
    bg-red-600
    hover:bg-red-700
    text-white
    border-0
    shadow-sm
  "
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </Button>
          </div>
        )}

        {/* Delete Dialog */}
        <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
          <DialogContent
            className="
    sm:max-w-md
    rounded-2xl
    bg-white
    border
    border-slate-200
    shadow-2xl
  "
          >
            <DialogHeader className="items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>

              <DialogTitle className="text-2xl">Delete User</DialogTitle>

              <DialogDescription className="mt-2">
                This action cannot be undone. The selected user will be
                permanently removed from the Campus Resource Management System.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
              <p className="text-sm text-red-700">
                ⚠️ All associated data for this user may also become
                inaccessible after deletion.
              </p>
            </div>

            <DialogFooter className="mt-6 gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>

              <Button
                onClick={confirmDeleteUser}
                className="
          flex-1
          rounded-xl
          bg-red-600
          hover:bg-red-700
          text-white
        "
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add User Dialog */}
        <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
          <DialogContent
            className="
      sm:max-w-xl
      rounded-2xl
      bg-white
      border
      border-slate-200
      shadow-2xl
    "
          >
            <DialogHeader className="space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <UserPlus className="h-8 w-8 text-blue-600" />
              </div>

              <div className="text-center">
                <DialogTitle className="text-2xl font-bold">
                  Create New User
                </DialogTitle>

                <DialogDescription className="mt-2">
                  Add a new user to the Campus Resource Management System.
                </DialogDescription>
              </div>
            </DialogHeader>

            <div className="space-y-5 mt-6">
              {/* Name */}

              <div className="space-y-2">
                <Label>Full Name</Label>

                <Input
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="h-11 rounded-xl"
                />
              </div>

              {/* Email */}

              <div className="space-y-2">
                <Label>Email Address</Label>

                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="h-11 rounded-xl"
                />
              </div>

              {/* Password */}

              <div className="space-y-2">
                <Label>Password</Label>

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className="h-11 rounded-xl pr-10"
                  />

                  <Eye
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 cursor-pointer text-muted-foreground hover:text-foreground"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    onTouchStart={() => setShowPassword(true)}
                    onTouchEnd={() => setShowPassword(false)}
                  />
                </div>
              </div>

              {/* Role */}

              <div className="space-y-2">
                <Label>User Role</Label>

                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      role: value,
                    })
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl bg-white border-slate-200">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>

                  <SelectContent className="bg-white rounded-xl">
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r
                          .replace("_", " ")
                          .replace(/\b\w/g, (c) => c.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional */}

              {formData.role === "student" && (
                <div className="space-y-2">
                  <Label>Semester</Label>

                  <Input
                    type="number"
                    placeholder="Semester"
                    value={formData.semester}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        semester: e.target.value,
                      })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>
              )}

              {formData.role === "lab_admin" && (
                <div className="space-y-2">
                  <Label>Lab Name</Label>

                  <Input
                    placeholder="AI Lab"
                    value={formData.labName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        labName: e.target.value,
                      })
                    }
                    className="h-11 rounded-xl"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="mt-8 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>

              <Button
                onClick={handleCreateUser}
                className="
          flex-1
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          text-white
        "
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

export default Users;
