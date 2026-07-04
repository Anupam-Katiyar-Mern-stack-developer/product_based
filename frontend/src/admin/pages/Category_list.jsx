import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { useEffect, useState } from "react";
import API from "../../api/axios";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // toast: { type: "success" | "error", message: string }
  const [toast, setToast] = useState(null);

  // deleteTarget: category object jise delete karna hai (confirm modal ke liye)
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const showToast = (type, message) => {
    setToast({ type, message });
    // auto hide after 3s
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/category/");
      setCategories(res.data.categories || []);
    } catch (err) {
    
      const message =
        err.response?.data?.message ||
        "Couldn't load categories. Check your connection and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await API.delete(`/category/delete/${deleteTarget._id}`);
      setCategories((prev) => prev.filter((item) => item._id !== deleteTarget._id));
      showToast("success", res.data?.message || "Category deleted.");
    } catch (err) {
      
      const message =
        err.response?.data?.message ||
        "Couldn't delete this category. Please try again.";
      showToast("error", message);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Category List
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Manage all categories</p>
        </div>
        <Link
          to="/admin/categories/add"
          className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#b78f25] transition px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
        >
          <IoMdAdd size={20} />
          Add Category
        </Link>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-xl border shadow-sm p-8 flex flex-col items-center justify-center gap-2">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#D4AF37] rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading categories...</p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-center">
          <FaExclamationTriangle className="text-red-500" size={24} />
          <div>
            <p className="text-sm font-semibold text-red-700">
              Something went wrong
            </p>
            <p className="text-xs text-red-500 mt-1">{error}</p>
          </div>
          <button
            onClick={fetchCategory}
            className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && categories.length === 0 && (
        <div className="bg-white rounded-xl border shadow-sm p-8 text-center">
          <p className="text-sm text-gray-500">No categories yet.</p>
          <p className="text-xs text-gray-400 mt-1">
            Add your first category to get started.
          </p>
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <>
          {/* Mobile Cards */}
          <div className="md:hidden space-y-2.5">
            {categories.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border shadow-sm p-3"
              >
                <div className="flex gap-3 items-start">
                  <img
                    src={item.image ? item.image : "https://via.placeholder.com/80"}
                    alt={item.categoryName}
                    className="w-14 h-14 rounded-lg object-cover border flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-800">
                      {item.categoryName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md">
                    {item.specification}
                  </span>
                  <div className="flex gap-2">
                    <Link to={`edit/${item._id}`}>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition">
                        <FaEdit size={11} /> Edit
                      </button>
                    </Link>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                      onClick={() => setDeleteTarget(item)}
                    >
                      <FaTrash size={11} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-xl border shadow-sm overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  {[
                    "Image",
                    "Category",
                    "Description",
                    "Specification",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide ${h === "Action" ? "text-center" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b last:border-0 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2.5">
                      <img
                        src={item.image ? item.image : "https://via.placeholder.com/80"}
                        alt={item.categoryName}
                        className="w-14 h-14 rounded-lg object-cover border"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80";
                        }}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="font-semibold text-sm text-gray-800 whitespace-nowrap">
                        {item.categoryName}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 max-w-[200px]">
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {item.description}
                      </p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md">
                        {item.specification}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex justify-center gap-2">
                        <Link to={`edit/${item._id}`}>
                          <button className="w-8 h-8 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition">
                            <FaEdit size={13} />
                          </button>
                        </Link>
                        <button
                          className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition"
                          onClick={() => setDeleteTarget(item)}
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Delete confirmation modal (replaces window.confirm) */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-5">
            <h3 className="font-semibold text-gray-800 text-base">
              Delete category?
            </h3>
            <p className="text-sm text-gray-500 mt-1.5">
              This will permanently delete{" "}
              <span className="font-medium text-gray-700">
                {deleteTarget.categoryName}
              </span>
              . This action can't be undone.
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification (replaces alert) */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}