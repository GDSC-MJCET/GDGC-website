import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpPage = ({ guest, setGuest }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1 form data
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Step 2 form data
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Step 1: Send email + name to backend
  const handleGuestSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(import.meta.env.VITE_SERVER+"/api/v1/auth/signup-guest", {
        email,
        name,
      });
      setSuccess(response.data.message || "Verification email sent! Check your inbox.");
      setStep(2); // Move to password step
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify & set password
  const handleSetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/auth/verify-password", {
        email,
        password,
      });
      setSuccess("Password set successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-white text-center mb-6">
          Guest Signup
        </h1>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
            {success}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleGuestSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="John Doe"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? "Sending..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSetPassword} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-blue-500 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition disabled:opacity-50"
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-zinc-400 hover:text-white transition"
            >
              ← Go back to email step
            </button>
          </form>
        )}

        <p className="text-center text-zinc-500 text-sm mt-6">
          Already have an account?{" "}
          <button
            onClick={() =>setGuest(false)}
            className="text-blue-400 hover:underline"
          >
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;