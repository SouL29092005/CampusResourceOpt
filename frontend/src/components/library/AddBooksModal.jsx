import { useState } from "react";
import { addBooks } from "../../api/library.api";
import { BookPlus, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function AddBooksModal({ onClose }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    publisher: "",
    publishedYear: "",
    copies: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      await addBooks({
        ...form,
        copies: Number(form.copies),
        publishedYear: Number(form.publishedYear),
      });

      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add books");
    } finally {
      setLoading(false);
    }
  };

  return (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl rounded-3xl border-0 bg-white p-0 shadow-2xl overflow-hidden">

      {/* Header */}
      <DialogHeader className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 px-8 py-6">
        <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-white">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
            <BookPlus className="h-6 w-6" />
          </div>

          Add New Books
        </DialogTitle>

        <DialogDescription className="pt-2 text-indigo-100">
          Fill in the book information below to add one or more copies to the
          library.
        </DialogDescription>
      </DialogHeader>

      {/* Body */}
      <div className="bg-slate-50 px-8 py-6">

        <div className="space-y-5">

          <div className="space-y-2">
            <Label>Book Title</Label>
            <Input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Clean Code"
              className="h-11 rounded-xl bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Author</Label>
            <Input
              name="author"
              value={form.author}
              onChange={handleChange}
              placeholder="Robert C. Martin"
              className="h-11 rounded-xl bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ISBN</Label>
              <Input
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                placeholder="9780132350884"
                className="h-11 rounded-xl bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Programming"
                className="h-11 rounded-xl bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Publisher</Label>
            <Input
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              placeholder="Pearson"
              className="h-11 rounded-xl bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Published Year</Label>
              <Input
                type="number"
                name="publishedYear"
                value={form.publishedYear}
                onChange={handleChange}
                placeholder="2025"
                className="h-11 rounded-xl bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label>Number of Copies</Label>
              <Input
                type="number"
                name="copies"
                value={form.copies}
                onChange={handleChange}
                placeholder="10"
                className="h-11 rounded-xl bg-white"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

        </div>
      </div>

      {/* Footer */}
      <DialogFooter className="border-t bg-white px-8 py-5">
        <Button
          variant="outline"
          onClick={onClose}
          className="rounded-xl"
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
        >
          {loading ? (
            "Adding..."
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Books
            </>
          )}
        </Button>
      </DialogFooter>

    </DialogContent>
  </Dialog>
);
}

export default AddBooksModal;
