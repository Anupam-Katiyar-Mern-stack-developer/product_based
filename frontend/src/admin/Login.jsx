import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { FiUser, FiLock, FiEye, FiEyeOff, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      toast.success(res.data.message || "Login Successful");

      navigate("/admin");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message || "Unable to login. Please try again.";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = async () => {
    try {
      const res = await API.post("/auth/forgot-password");

      toast.success(res.data.message);

      navigate("/admin/verify-otp");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  const inputWrap =
    "flex items-center border border-gray-200 rounded-xl px-3.5 gap-2.5 focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37] transition";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-4xl grid lg:grid-cols-2">
        {/* Left Panel */}
        <div className="bg-[#111827] text-white p-10 hidden lg:flex flex-col justify-center">
          {/* Logo placeholder */}
          <div className="w-12 h-12 rounded-xl bg-[#D4AF37] flex items-center justify-center font-bold text-black text-xl mb-8">
            T
          </div>

          <h1 className="text-3xl font-bold leading-tight">Admin Panel</h1>
          <p className="mt-3 text-sm text-gray-400 leading-relaxed">
            Manage your products, categories and enquiries from one secure
            dashboard.
          </p>

          <div className="mt-8 space-y-2.5">
            {[
              "Product Management",
              "Category Management",
              "Enquiry Management",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 text-sm text-gray-300"
              >
                <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-xs">
                  ✓
                </span>
                {item}
              </div>
            ))}
          </div>

          <p className="mt-12 text-xs text-gray-600">
            © 2026 Techmark Universal
          </p>
        </div>

        {/* Right Panel */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back 👋
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Login to your admin account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3">
                {error}
              </div>
            )}
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Name
              </label>
              <div className={inputWrap}>
                <FiUser size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="enter name"
                  className="w-full py-2.5 text-sm outline-none placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className={inputWrap}>
                <FiLock size={15} className="text-gray-400 flex-shrink-0" />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  required
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full py-2.5 text-sm outline-none placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition"
                >
                  {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            {/* Forgot */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-[#D4AF37] hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold text-sm py-2.5 rounded-xl transition mt-1 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#D4AF37] hover:bg-[#b78f25] text-black"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
