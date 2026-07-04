import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await API.post("/auth/verify-otp", {
        otp,
      });

      toast.success(res.data.message);

      navigate("/admin/reset-password");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold mb-2 text-center">
          Verify OTP
        </h2>

        <p className="text-gray-500 text-sm text-center mb-6">
          Enter the OTP sent to your registered email.
        </p>

        <form onSubmit={submit}>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 text-center text-2xl tracking-[10px] outline-none focus:border-yellow-500"
            placeholder="000000"
          />

          <button
            disabled={loading}
            className="w-full mt-5 bg-[#D4AF37] py-3 rounded-xl font-semibold"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

        </form>

      </div>

    </div>
  );
}