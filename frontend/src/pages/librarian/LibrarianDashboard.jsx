import { useEffect, useState } from "react";
import AddBooksModal from "../../components/library/AddBooksModal";
import {
  fetchActiveIssues,
  fetchOverdueIssues,
  searchBookByName,
  issueBook,
  returnBook,
  getBookByAccession,
  updateBookStatus,
} from "../../api/library.api";
import { useNavigate } from "react-router-dom";
import ViewProfile from "../../components/profile/ViewProfile";
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
  BookCheck,
  BookOpenCheck,
  CalendarDays,
  Info,
  LayoutDashboard,
  LibraryBig,
  Loader2,
  LogOut,
  PlusCircle,
  RotateCcw,
  Search,
  ShieldAlert,
  TriangleAlert,
  UserCircle2,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LibrarianDashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  const [issueForm, setIssueForm] = useState({
    accessionNumber: "",
    email: "",
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [userName, setUserName] = useState("");

  // book status update related
  const [statusForm, setStatusForm] = useState({
    accessionNumber: "",
    status: "",
  });
  const [lookingUp, setLookingUp] = useState(false);
  const [foundBook, setFoundBook] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  // overdue issues
  const [overdueIssues, setOverdueIssues] = useState([]);
  const [loadingOverdue, setLoadingOverdue] = useState(true);

  // return modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnResult, setReturnResult] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const navigate = useNavigate();

  const loadIssues = async () => {
    try {
      setLoading(true);
      const res = await fetchActiveIssues();
      setIssues(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
    loadOverdue();
    const n = localStorage.getItem("userName");
    if (n) setUserName(n);
  }, []);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await searchBookByName(value);
      setSearchResults(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssue = async () => {
    if (!issueForm.accessionNumber || !issueForm.email) {
      alert("Please fill accession number and student email");
      return;
    }

    try {
      setActionLoading(true);
      await issueBook(issueForm);
      alert("Book issued successfully");
      setIssueForm({ accessionNumber: "", email: "" });
      loadIssues();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to issue book");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async (accessionNumber) => {
    try {
      setActionLoading(true);
      const res = await returnBook({ accessionNumber });
      setReturnResult(res.data.data);
      setShowReturnModal(true);
      loadIssues();
      loadOverdue();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to return book");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const loadOverdue = async () => {
    try {
      setLoadingOverdue(true);
      const res = await fetchOverdueIssues();
      setOverdueIssues(res.data.data);
    } catch (err) {
      console.error(err);
      setOverdueIssues([]);
    } finally {
      setLoadingOverdue(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <Card className="border-0 shadow-md bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
          <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <Avatar className="h-14 w-14 border-2 border-white/20">
                <AvatarFallback className="bg-blue-600 text-lg font-bold text-white">
                  {userName?.charAt(0).toUpperCase() || "L"}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="flex items-center gap-2">
                  <LibraryBig className="h-7 w-7 text-blue-400" />
                  <h1 className="text-3xl font-bold tracking-tight">
                    Librarian Dashboard
                  </h1>
                </div>

                <p className="mt-1 text-sm text-slate-300">
                  Welcome back,
                  <span className="ml-1 font-semibold text-white">
                    {userName || "Librarian"}
                  </span>
                </p>
              </div>
            </div>

            <Button
              onClick={handleLogout}
              variant="destructive"
              className="gap-2 rounded-xl px-5"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
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

        {/* Profile Tab */}
        {activeTab === "profile" && <ViewProfile />}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Top Row */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>

                  <CardDescription>
                    Manage your library with a single click.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <Button
                    onClick={() => setShowAddModal(true)}
                    className="w-full h-11 gap-2"
                  >
                    <PlusCircle className="h-5 w-5" />
                    Add New Books
                  </Button>

                  <Separator />

                  <div className="rounded-lg bg-muted/40 p-4">
                    <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                      <Info className="h-4 w-4 text-primary" />
                      Quick Tip
                    </h4>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Use the search panel to quickly locate a book and click on
                      it to automatically fill the accession number in the issue
                      form.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Search Books */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-primary" />
                    Search Books
                  </CardTitle>

                  <CardDescription>
                    Search books by title and select one to issue.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      placeholder="Search books by title..."
                      value={searchTerm}
                      onChange={handleSearch}
                      className="pl-10"
                    />
                  </div>

                  {searchResults.length > 0 ? (
                    <ScrollArea className="h-72 rounded-lg border">
                      <div className="divide-y">
                        {searchResults.map((book) => (
                          <button
                            key={book.accessionNumber}
                            type="button"
                            onClick={() =>
                              setIssueForm({
                                ...issueForm,
                                accessionNumber: book.accessionNumber,
                              })
                            }
                            className="flex w-full items-start justify-between p-4 transition-colors hover:bg-muted"
                          >
                            <div className="text-left">
                              <h4 className="font-semibold">{book.title}</h4>

                              <p className="text-sm text-muted-foreground">
                                {book.author}
                              </p>

                              <p className="mt-1 text-xs text-muted-foreground">
                                {book.accessionNumber}
                              </p>
                            </div>

                            <Badge
                              variant={
                                book.status === "AVAILABLE"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {book.status}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                  ) : (
                    <div className="flex h-72 items-center justify-center rounded-lg border border-dashed">
                      <div className="text-center">
                        <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                        <p className="font-medium">Search for a book</p>

                        <p className="text-sm text-muted-foreground">
                          Matching books will appear here.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Issue Book */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookCheck className="h-5 w-5 text-primary" />
                    Issue Book
                  </CardTitle>

                  <CardDescription>
                    Assign a library book to a student.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label>Accession Number</Label>

                    <Input
                      placeholder="Enter accession number"
                      value={issueForm.accessionNumber}
                      onChange={(e) =>
                        setIssueForm({
                          ...issueForm,
                          accessionNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Student Email</Label>

                    <Input
                      type="email"
                      placeholder="student@example.com"
                      value={issueForm.email}
                      onChange={(e) =>
                        setIssueForm({
                          ...issueForm,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleIssue}
                      disabled={actionLoading}
                      className="flex-1 gap-2 cursor-pointer shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <BookCheck className="h-4 w-4" />

                      {actionLoading ? "Issuing..." : "Issue Book"}
                    </Button>

                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      onClick={() =>
                        setIssueForm({
                          accessionNumber: "",
                          email: "",
                        })
                      }
                    >
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Update Book Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    Update Book Status
                  </CardTitle>

                  <CardDescription>
                    Mark books as lost or damaged.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label>Accession Number</Label>

                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter accession number"
                        value={statusForm.accessionNumber}
                        onChange={(e) =>
                          setStatusForm({
                            ...statusForm,
                            accessionNumber: e.target.value,
                          })
                        }
                      />

                      <Button
                        variant="secondary"
                        onClick={async () => {
                          if (!statusForm.accessionNumber) {
                            alert("Enter accession number");
                            return;
                          }

                          setLookingUp(true);

                          try {
                            const res = await getBookByAccession(
                              statusForm.accessionNumber,
                            );

                            setFoundBook(res.data.data);
                          } catch (err) {
                            alert(
                              err.response?.data?.message || "Book not found",
                            );

                            setFoundBook(null);
                          } finally {
                            setLookingUp(false);
                          }
                        }}
                        disabled={lookingUp}
                      >
                        {lookingUp ? "Finding..." : "Find"}
                      </Button>
                    </div>
                  </div>

                  {foundBook && (
                    <Card className="bg-muted/40 border-dashed shadow-none">
                      <CardContent className="pt-6">
                        <h4 className="font-semibold">{foundBook.title}</h4>

                        <p className="text-sm text-muted-foreground">
                          {foundBook.author}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {foundBook.accessionNumber}
                          </span>

                          <Badge>{foundBook.status}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="space-y-2">
                    <Label>Status</Label>

                    <Select
                      value={statusForm.status}
                      onValueChange={(value) =>
                        setStatusForm({
                          ...statusForm,
                          status: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>

                      <SelectContent className="bg-white border shadow-lg">
                        <SelectItem
                          value="LOST"
                          className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
                        >
                          LOST
                        </SelectItem>
                        <SelectItem
                          value="DAMAGED"
                          className="cursor-pointer hover:bg-slate-100 focus:bg-slate-100"
                        >
                          DAMAGED
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full cursor-pointer"
                    onClick={async () => {
                      if (!statusForm.accessionNumber || !statusForm.status) {
                        alert("Provide accession number and status");
                        return;
                      }

                      setUpdateLoading(true);

                      try {
                        await updateBookStatus(statusForm);

                        alert("Book status updated");

                        setFoundBook(null);

                        setStatusForm({
                          accessionNumber: "",
                          status: "",
                        });

                        loadIssues();
                      } catch (err) {
                        alert(
                          err.response?.data?.message ||
                            "Failed to update status",
                        );
                      } finally {
                        setUpdateLoading(false);
                      }
                    }}
                    disabled={updateLoading}
                  >
                    {updateLoading ? "Updating..." : "Update Status"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Book Issues */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpenCheck className="h-5 w-5 text-primary" />
                    Active Book Issues
                  </CardTitle>

                  <CardDescription>
                    Books currently issued to students.
                  </CardDescription>
                </div>

                <Badge variant="secondary">{issues.length} Active</Badge>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <div className="flex h-48 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : issues.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center text-center">
                    <BookOpenCheck className="mb-3 h-10 w-10 text-muted-foreground" />

                    <p className="font-medium">No Active Issues</p>

                    <p className="text-sm text-muted-foreground">
                      All books have been returned.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Issue #</TableHead>
                          <TableHead>Book</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Issued</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {issues.map((issue) => (
                          <TableRow
                            key={issue._id}
                            className="hover:bg-muted/50"
                          >
                            <TableCell className="font-medium">
                              #{issue.issueNumber}
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">
                                  {issue.book.title}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {issue.book.accessionNumber}
                                </p>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{issue.user.name}</p>

                                <p className="text-xs text-muted-foreground">
                                  {issue.user.email}
                                </p>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                {new Date(issue.issuedAt).toLocaleDateString()}
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge variant="outline">
                                {new Date(issue.dueAt).toLocaleDateString()}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                className="gap-2 cursor-pointer"
                                onClick={() =>
                                  handleReturn(issue.book.accessionNumber)
                                }
                              >
                                <RotateCcw className="h-4 w-4" />
                                Return
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

            {/* Overdue Issues */}
            <Card className="mt-6 border-red-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <TriangleAlert className="h-5 w-5" />
                    Overdue Book Issues
                  </CardTitle>

                  <CardDescription>
                    Books that have exceeded their due date.
                  </CardDescription>
                </div>

                <Badge variant="destructive">
                  {overdueIssues.length} Overdue
                </Badge>
              </CardHeader>

              <CardContent>
                {loadingOverdue ? (
                  <div className="flex h-48 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                  </div>
                ) : overdueIssues.length === 0 ? (
                  <div className="flex h-48 flex-col items-center justify-center text-center">
                    <TriangleAlert className="mb-3 h-10 w-10 text-red-400" />

                    <p className="font-medium">No Overdue Issues</p>

                    <p className="text-sm text-muted-foreground">
                      Great! Every issued book is within its due date.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Issue #</TableHead>
                          <TableHead>Book</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Issued</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {overdueIssues.map((issue) => (
                          <TableRow
                            key={issue._id}
                            className="bg-red-50/50 hover:bg-red-100/60"
                          >
                            <TableCell className="font-medium">
                              #{issue.issueNumber}
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">
                                  {issue.book.title}
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {issue.book.accessionNumber}
                                </p>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{issue.user.name}</p>

                                <p className="text-xs text-muted-foreground">
                                  {issue.user.email}
                                </p>
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2 text-sm">
                                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                {new Date(issue.issuedAt).toLocaleDateString()}
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge variant="destructive">
                                {new Date(issue.dueAt).toLocaleDateString()}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-right">
                              <Button
                                size="sm"
                                className="gap-2"
                                onClick={() =>
                                  handleReturn(issue.book.accessionNumber)
                                }
                              >
                                <RotateCcw className="h-4 w-4" />
                                Return
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
          <AddBooksModal
            onClose={() => {
              setShowAddModal(false);
              loadIssues();
              loadOverdue();
            }}
          />
        )}

        {/* Return result modal */}
        {showReturnModal && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded w-[420px] shadow">
              <h3 className="font-semibold mb-2">Return Summary</h3>
              {returnResult ? (
                <div>
                  <p>
                    Issue #: <strong>{returnResult.issueNumber}</strong>
                  </p>
                  <p>
                    Accession #: <strong>{returnResult.accessionNumber}</strong>
                  </p>
                  <p>
                    Returned At:{" "}
                    <strong>
                      {new Date(returnResult.returnedAt).toLocaleString()}
                    </strong>
                  </p>
                  <p>
                    Fine Amount: <strong>{returnResult.fineAmount}</strong>
                  </p>
                </div>
              ) : (
                <p>No details available</p>
              )}

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowReturnModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
