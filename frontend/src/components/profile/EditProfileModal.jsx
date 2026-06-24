import { useState, useEffect } from "react";
import { updateMyProfile } from "../../api/profile.api";
import { getAllCourses } from "../../api/course.api";

export default function EditProfileModal({ profileData, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    qualification: "",
    maxWeeklyHours: "",
    enrolledSubjects: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [courseQuery, setCourseQuery] = useState("");

  useEffect(() => {
    if (profileData) {
      const name = profileData.name || profileData.userId?.name || "";
      const qualification = profileData.qualification || "";
      const maxWeeklyHours = profileData.maxWeeklyHours ?? profileData.max_weekly_hours ?? "";
      const enrolledSubjects = Array.isArray(profileData.enrolledSubjects)
        ? profileData.enrolledSubjects
        : [];

      setFormData({ name, qualification, maxWeeklyHours, enrolledSubjects });
    }

    fetchCourses();
  }, [profileData]);

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await getAllCourses();
      setCourses(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseToggle = (courseId) => {
    setFormData((prev) => {
      const enrolled = new Set(prev.enrolledSubjects || []);
      if (enrolled.has(courseId)) enrolled.delete(courseId);
      else enrolled.add(courseId);
      return { ...prev, enrolledSubjects: Array.from(enrolled) };
    });
  };

  const filteredCourses = courses.filter((c) => {
    const q = courseQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      (c.courseName || "").toLowerCase().includes(q) ||
      (c.courseCode || "").toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const payload = {
        name: formData.name,
        qualification: formData.qualification,
        maxWeeklyHours: formData.maxWeeklyHours,
        courses: formData.enrolledSubjects // send as course IDs
      };

      const res = await updateMyProfile(payload);

      setSuccess(true);
      if (onUpdate) onUpdate(res.data.profile);

      setTimeout(() => onClose(), 1200);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-blue-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Profile</h2>
          <button onClick={onClose} className="text-2xl font-bold hover:text-gray-200 transition">×</button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          )}

          {success && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">Profile updated successfully!</div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
              <input type="text" name="name" value={formData.name || ""} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Full name" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Qualification</label>
              <input type="text" name="qualification" value={formData.qualification || ""} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="Qualification" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Weekly Hours</label>
              <input type="number" name="maxWeeklyHours" value={formData.maxWeeklyHours ?? ""} onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="e.g. 20" min={0} />
            </div>
          </div>

          {/* Subjects picker with search */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subjects</label>
            <div className="mb-2 flex gap-2">
              <input type="text" placeholder="Search subjects by name or code" value={courseQuery} onChange={(e) => setCourseQuery(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="button" onClick={() => setCourseQuery("")} className="px-3 py-2 border rounded bg-gray-100">Clear</button>
            </div>

            {loadingCourses ? (
              <p className="text-gray-500">Loading courses...</p>
            ) : (
              <div className="max-h-48 overflow-y-auto border rounded p-2">
                {filteredCourses.length === 0 && <p className="text-sm text-gray-500">No subjects found.</p>}
                {filteredCourses.map((course) => (
                  <label key={course._id} className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded">
                    <input type="checkbox" checked={(formData.enrolledSubjects || []).includes(course._id)} onChange={() => handleCourseToggle(course._id)} />
                    <span className="text-sm">{course.courseName} <span className="text-xs text-gray-400">({course.courseCode})</span></span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <button type="button" onClick={onClose} disabled={loading} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50">Cancel</button>
            <button type="submit" disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition duration-200 disabled:opacity-50 flex items-center gap-2">{loading ? (<><span className="inline-block animate-spin">⟳</span>Saving...</>) : ("Save Changes")}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
