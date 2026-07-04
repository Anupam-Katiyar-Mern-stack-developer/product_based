import { useState, useRef, useEffect } from "react";
import { FiUploadCloud, FiX, FiLayers } from "react-icons/fi";
import API from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

export default function AddCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    specification: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const imgRef = useRef();

  useEffect(() => {
    if (!id) return;

    const fetchCategory = async () => {
      try {
        const res = await API.get(`/category/${id}`);

         // <-- check karo

        const data = res.data.category;

        setFormData({
          categoryName: data.categoryName,
          description: data.description,
          specification: data.specification,
          image: null,
        });

        setPreview(`http://localhost:5000${data.image}`);
      } catch (err) {
        console.error(err);

        toast.error(err.response?.data?.message || "Failed to load category.");
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (e) => {
    setError("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.categoryName.trim()) {
      setError("Category name is required.");
      toast.error("Category name is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      toast.error("Description is required.");
      return;
    }

    if (!isEdit && !formData.image) {
      setError("Please upload a category image.");
      toast.error("Please upload a category image.");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("categoryName", formData.categoryName);
      data.append("description", formData.description);
      data.append("specification", formData.specification);

      if (formData.image) {
        data.append("image", formData.image);
      }

      let res;

      if (isEdit) {
        res = await API.put(`/category/update/${id}`, data);
      } else {
        res = await API.post("/category/add", data);

        setFormData({
          categoryName: "",
          description: "",
          specification: "",
          image: null,
        });

        setPreview(null);

        if (imgRef.current) {
          imgRef.current.value = "";
        }
      }

      toast.success(res.data.message);

      navigate("/admin/categories");
    } catch (error) {
      console.error(error);

      const message = error.response?.data?.message || "Something went wrong.";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const handleImage = (e) => {
    setError("");

    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2 MB.");
      return;
    }

    setFormData({
      ...formData,
      image: file,
    });

    setPreview(URL.createObjectURL(file));
  };
  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setPreview(null);
    imgRef.current.value = "";
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition placeholder:text-gray-300";

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          {isEdit ? "Update Category" : "Add Category"}
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Fill in the details to create a new category
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}
          {/* Category Name */}
          <div>
            <label className={labelClass}>Category Name</label>
            <input
              type="text"
              name="categoryName"
              required
              value={formData.categoryName}
              onChange={handleChange}
              placeholder="e.g. PVC Resin"
              className={inputClass}
            />
          </div>

          {/* Description + Specification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short category description..."
                className={`${inputClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>Specification</label>
              <textarea
                rows={4}
                name="specification"
                value={formData.specification}
                onChange={handleChange}
                placeholder="Grade, type, technical details..."
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass}>Category Image</label>
            <div
              onClick={() => !preview && imgRef.current.click()}
              className={`border-2 border-dashed border-gray-200 rounded-xl p-5 flex flex-col items-center justify-center gap-2 min-h-[120px] transition
                ${!preview ? "cursor-pointer hover:border-[#D4AF37]" : ""}`}
            >
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-24 w-24 rounded-xl object-cover border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow"
                  >
                    <FiX size={11} />
                  </button>
                </div>
              ) : (
                <>
                  <FiUploadCloud size={26} className="text-gray-300" />
                  <p className="text-xs text-gray-400">
                    Click to upload category image
                  </p>
                  <p className="text-[11px] text-gray-300">
                    PNG, JPG, WEBP supported
                  </p>
                </>
              )}
            </div>
            <input
              ref={imgRef}
              type="file"
              accept="image/*"
             
              onChange={handleImage}
              className="hidden"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#D4AF37] hover:bg-[#b78f25] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 transition"
            >
              <FiLayers size={15} />

              {loading
                ? isEdit
                  ? "Updating..."
                  : "Adding..."
                : isEdit
                  ? "Update Category"
                  : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
