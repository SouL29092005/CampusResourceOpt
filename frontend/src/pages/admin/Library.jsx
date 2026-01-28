import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { fetchActiveIssues, searchBookByName } from "../../api/library.api";
import AddBooksModal from "../../components/library/AddBooksModal";


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
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Books
          </button>


          <input
            type="text"
            placeholder="Search book by name"
            className="border px-3 py-2 rounded w-64"
            value={searchTerm}
            onChange={handleSearch}
          />

          {searchResults.length > 0 && (
            <div className="bg-white border rounded mt-2 w-96 max-h-64 overflow-y-auto shadow">
              {searchResults.map((book) => (
                <div
                  key={book.accessionNumber}
                  className="p-2 border-b hover:bg-gray-100"
                >
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-600">
                    {book.author} • {book.accessionNumber} • {book.status}
                  </p>
                </div>
              ))}
            </div>
          )}


        </div>

        {/* Active Issues */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="font-semibold mb-4">Active Book Issues</h2>

          {loading ? (
            <p>Loading...</p>
          ) : issues.length === 0 ? (
            <p>No active issues</p>
          ) : (
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Issue No</th>
                  <th className="border p-2">Book</th>
                  <th className="border p-2">Student</th>
                  <th className="border p-2">Issued At</th>
                  <th className="border p-2">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id}>
                    <td className="border p-2">{issue.issueNumber}</td>
                    <td className="border p-2">
                      {issue.book.title} <br />
                      <span className="text-sm text-gray-500">
                        ({issue.book.accessionNumber})
                      </span>
                    </td>
                    <td className="border p-2">
                      {issue.user.name} <br />
                      <span className="text-sm text-gray-500">
                        {issue.user.email}
                      </span>
                    </td>
                    <td className="border p-2">
                      {new Date(issue.issuedAt).toLocaleDateString()}
                    </td>
                    <td className="border p-2">
                      {new Date(issue.dueAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminLayout>

      {showAddModal && (
        <AddBooksModal
          onClose={() => setShowAddModal(false)}
        />
      )}
    </>
  );
}

export default Library;
