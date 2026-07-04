import { useState } from "react";
import { FiLock, FiEye, FiEyeOff, FiCheck, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Strong password rule: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRules = [
    { label: "At least 8 characters", test: (val) => val.length >= 8 },
    { label: "One uppercase letter", test: (val) => /[A-Z]/.test(val) },
    { label: "One lowercase letter", test: (val) => /[a-z]/.test(val) },
    { label: "One number", test: (val) => /[0-9]/.test(val) },
    { label: "One special character", test: (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val) },
  ];

  const validatePassword = (val) => {
    const failed = passwordRules.filter((rule) => !rule.test(val));
    if (!val) {
      setPasswordError("");
    } else if (failed.length > 0) {
      setPasswordError(`Missing: ${failed.map((r) => r.label).join(", ")}`);
    } else {
      setPasswordError("");
    }
    return failed.length === 0;
  };

  const handleChange = (e) => {
    setError("");

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      toast.error("All fields are required.");
      return;
    }

    const isStrong = validatePassword(formData.password);

    if (!isStrong) {
      toast.error("Please choose a stronger password.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/reset-password", {
        password: formData.password,
      });

      toast.success(res.data.message || "Password updated successfully.");

      navigate("/admin/login");
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.message ||
        "Unable to reset password. Please try again.";

      setError(message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputWrap =
    "flex items-center border border-gray-200 rounded-xl px-3.5 gap-2.5 focus-within:border-[#D4AF37] focus-within:ring-1 focus-within:ring-[#D4AF37]";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-[#D4AF37] flex items-center justify-center mx-auto text-black font-bold text-xl mb-4">
            T
          </div>

          <h2 className="text-2xl font-bold">Reset Password</h2>

          <p className="text-sm text-gray-400 mt-2">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              New Password
            </label>

            <div className={inputWrap}>
              <FiLock />

              <input
                type={showPass ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full py-3 outline-none"
                placeholder="Enter new password"
              />

              <button type="button" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Error below input */}
            {passwordError && (
              <p className="text-xs text-red-500 mt-1.5">{passwordError}</p>
            )}

            {/* Live requirement checklist */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                {passwordRules.map((rule) => {
                  const passed = rule.test(formData.password);
                  return (
                    <div
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-xs ${
                        passed ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {passed ? <FiCheck size={12} /> : <FiX size={12} />}
                      {rule.label}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Confirm */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Confirm Password
            </label>

            <div className={inputWrap}>
              <FiLock />

              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full py-3 outline-none"
                placeholder="Confirm password"
              />

              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {formData.confirmPassword &&
              formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-500 mt-1.5">
                  Passwords do not match
                </p>
              )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#b78f25] disabled:opacity-60 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition"
          >
            {loading ? "Updating Password..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}