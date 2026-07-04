import { useState, useRef, useEffect } from "react";
import { FiUploadCloud, FiX, FiPackage } from "react-icons/fi";
import API from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    description: "",
    specification: "",
    image: null,
    multipleImages: [],
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [mainPreview, setMainPreview] = useState(null);
  const [multiPreviews, setMultiPreviews] = useState([]);

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const mainImgRef = useRef();
  const multiImgRef = useRef();

  // Load categories from DB when the page opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get("/category/");

        

        setCategories(res.data.categories);
      } catch (error) {
        

        toast.error("Failed to load categories");
      } finally {
        setLoadingCategories(false); // 🔥 FIXED HERE
      }
    };

    fetchCategories();
  }, []);

  // load produtc data and edit

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await API.get(`/product/${id}`);
        const data = res.data.product;

        setFormData({
          productName: data.productName || "",
          category: data.category?._id || data.category || "",
          description: data.description || "",
          specification: data.specification || "",
          image: null,
          multipleImages: [],
        });

        setMainPreview(
          data.image ? `http://localhost:5000${data.image}` : null,
        );

        setMultiPreviews(
          (data.images || []).map((img) => `http://localhost:5000${img}`),
        );
      } catch (error) {
        

        toast.error(error.response?.data?.message || "Failed to load product");

        navigate("/admin/products");
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setMainPreview(URL.createObjectURL(file));
  };

  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      multipleImages: files,
    }));

    setMultiPreviews(files.map((file) => URL.createObjectURL(file)));
  };
  const removeMainImage = () => {
    setFormData({ ...formData, image: null });
    setMainPreview(null);
    if (mainImgRef.current) mainImgRef.current.value = "";
  };

  const removeMultiImage = (index) => {
    const newFiles = formData.multipleImages.filter((_, i) => i !== index);
    const newPreviews = multiPreviews.filter((_, i) => i !== index);
    setFormData({ ...formData, multipleImages: newFiles });
    setMultiPreviews(newPreviews);
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      category: "",
      description: "",
      specification: "",
      image: null,
      multipleImages: [],
    });
    setMainPreview(null);
    setMultiPreviews([]);
    if (mainImgRef.current) mainImgRef.current.value = "";
    if (multiImgRef.current) multiImgRef.current.value = "";
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required";
    }

    if (!formData.category) {
      newErrors.category = "Please select category";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.specification.trim()) {
      newErrors.specification = "Specification is required";
    }

    if (!isEdit && !formData.image) {
      newErrors.image = "Main image is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();

      data.append("productName", formData.productName);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("specification", formData.specification);

      if (formData.image) {
        data.append("image", formData.image);
      }

      formData.multipleImages.forEach((file) => {
        data.append("images", file);
      });

      let res;

      if (isEdit) {
        res = await API.put(`/product/update/${id}`, data, {
          headers: { "Content-Type ": "multipart/form-data" },
        });
      } else {
        res = await API.post("/product/add", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(
        res.data.message ||
          (isEdit
            ? "Product updated successfully"
            : "Product added successfully"),
      );

      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);

      navigate("/admin/products");
    } catch (error) {
      let msg = "Something went wrong";

      if (error.response) {
        if (error.response.data.errors) {
          const backendErrors = {};

          error.response.data.errors.forEach((err) => {
            backendErrors[err.path] = err.msg;
          });

          setErrors(backendErrors);
          return;
        }

        msg = error.response.data.message || msg;
      }

      setErrors({
        general: msg,
      });
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition placeholder:text-gray-300";

  const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

  return (
    <div className="space-y-3">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
          Add Product
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          Fill in the details to add a new product
        </p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="mb-4 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3">
              {errors.general}
            </div>
          )}

          {/* Row 1: Name + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                placeholder="e.g. PVC Resin"
                className={inputClass}
              />
              {errors.productName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.productName}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
                disabled={loadingCategories}
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select category"}
                </option>
                {categories.map((cat) => (
                  <option key={cat._id || cat.id} value={cat._id || cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Row 2: Description + Specification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short product description..."
                className={`${inputClass} resize-none`}
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div>
              <label className={labelClass}>Specifications</label>
              <textarea
                rows={4}
                name="specification"
                value={formData.specification}
                onChange={handleChange}
                placeholder="Technical specs, grade, etc..."
                className={`${inputClass} resize-none`}
              />
              {errors.specification && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.specification}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Main Image */}
            <div>
              <label className={labelClass}>Main Image</label>
              <div
                onClick={() => mainImgRef.current.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#D4AF37] transition min-h-[110px]"
              >
                {mainPreview ? (
                  <div className="relative">
                    <img
                      src={mainPreview}
                      alt="Main"
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMainImage();
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <FiX size={11} />
                    </button>
                  </div>
                ) : (
                  <>
                    <FiUploadCloud size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400">
                      Click to upload main image
                    </p>
                  </>
                )}
              </div>

              <input
                ref={mainImgRef}
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImage}
                className="hidden"
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-2">{errors.image}</p>
              )}
            </div>

            {/* Multiple Images */}
            <div>
              <label className={labelClass}>Additional Images</label>
              <div
                onClick={() => multiImgRef.current.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#D4AF37] transition min-h-[110px]"
              >
                {multiPreviews.length > 0 ? (
                  <div
                    className="flex flex-wrap gap-2 justify-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {multiPreviews.map((src, i) => (
                      <div key={i} className="relative">
                        <img
                          src={src}
                          alt={`img-${i}`}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeMultiImage(i)}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          <FiX size={9} />
                        </button>
                      </div>
                    ))}
                    <div
                      className="h-14 w-14 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-[#D4AF37]"
                      onClick={() => multiImgRef.current.click()}
                    >
                      <FiUploadCloud size={16} className="text-gray-300" />
                    </div>
                  </div>
                ) : (
                  <>
                    <FiUploadCloud size={22} className="text-gray-300" />
                    <p className="text-xs text-gray-400">
                      Click to upload multiple images
                    </p>
                  </>
                )}
              </div>

              <input
                ref={multiImgRef}
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleMultipleImages}
                className="hidden"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#D4AF37] hover:bg-[#b78f25] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 transition"
            >
              <FiPackage size={15} />
              {submitting
                ? isEdit
                  ? "Updating..."
                  : "Adding..."
                : isEdit
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
