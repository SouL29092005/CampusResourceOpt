import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchActiveIssues, searchBookByName } from "../../api/library.api";
import AddBooksModal from "../../components/library/AddBooksModal";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, BookOpenCheck, Plus, Search, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function Library() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

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

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    try {
      const res = await fetchActiveIssues();
      setIssues(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminLayout>
        <h1 className="text-xl font-bold mb-6">Library</h1>

        {/* Action buttons */}
        {/* Header */}
        <Card className="mb-8 border-0 shadow-md bg-gradient-to-r from-white to-slate-50">
          <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <BookOpen className="h-7 w-7" />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Library Management
                </h1>

                <p className="mt-2 text-muted-foreground max-w-xl">
                  Manage your library inventory, issue books, search the
                  catalogue, and monitor active book issues from one place.
                </p>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => setShowAddModal(true)}
              className="rounded-xl px-6 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Books
            </Button>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative w-full max-w-xl mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

              <Input
                placeholder="Search books by title, author or accession number..."
                value={searchTerm}
                onChange={handleSearch}
                className="h-12 rounded-2xl pl-12 pr-12 shadow-sm border-muted bg-white focus-visible:ring-2"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setSearchResults([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {searchResults.length > 0 && (
            <Card
              className="
    absolute
    top-full
    left-0
    mt-2
    w-full
    rounded-2xl
    border
    bg-white
    shadow-2xl
    z-[999]
  "
            >
              <div className="border-b bg-white px-5 py-3">
                <p className="text-sm font-semibold">Search Results</p>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((book) => (
                  <div
                    key={book.accessionNumber}
                    className="flex items-center justify-between px-5 py-4 hover:bg-muted/60 transition-all duration-200 cursor-pointer border-b last:border-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <BookOpen className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-semibold">{book.title}</p>

                        <p className="text-sm text-muted-foreground">
                          {book.author}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          {book.accessionNumber}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        book.status === "AVAILABLE"
                          ? "default"
                          : book.status === "ISSUED"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {book.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {searchTerm.length >= 2 && searchResults.length === 0 && (
            <Card className="absolute left-0 right-0 mt-3 rounded-2xl shadow-lg z-50">
              <div className="py-8 text-center text-muted-foreground">
                <BookOpen className="mx-auto mb-3 h-8 w-8 opacity-40" />
                <p>No books found.</p>
              </div>
            </Card>
          )}
        </div>

        {/* Active Issues */}
        <Card className="border-0 shadow-md rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <BookOpenCheck className="h-5 w-5 text-indigo-600" />
                Active Book Issues
              </CardTitle>

              <CardDescription>
                Books currently issued to students
              </CardDescription>
            </div>

            <Badge variant="secondary" className="px-3 py-1 rounded-full">
              {issues.length} Active
            </Badge>
          </CardHeader>

          <CardContent>
            {loading ? (
              <div className="py-10 text-center text-muted-foreground">
                Loading active issues...
              </div>
            ) : issues.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                No active book issues found.
              </div>
            ) : (
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-100">
                      <TableHead>Issue No.</TableHead>
                      <TableHead>Book</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Issued On</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {issues.map((issue) => (
                      <TableRow
                        key={issue._id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <TableCell className="font-semibold">
                          #{issue.issueNumber}
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="font-medium">{issue.book.title}</p>

                            <p className="text-xs text-muted-foreground">
                              {issue.book.accessionNumber}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>
                                {issue.user.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <p className="font-medium">{issue.user.name}</p>

                              <p className="text-xs text-muted-foreground">
                                {issue.user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          {new Date(issue.issuedAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">
                            {new Date(issue.dueAt).toLocaleDateString()}
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
      </AdminLayout>

      {showAddModal && <AddBooksModal onClose={() => setShowAddModal(false)} />}
    </>
  );
}

export default Library;
