import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { EnvelopeIcon, KeyIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-[#1e1b18] via-[#0f0e0c] to-[#050504] px-4">
      {/* Background elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-700/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#161412]/80 backdrop-blur-xl border border-amber-900/30 p-8 rounded-3xl shadow-2xl transition-all duration-300 hover:border-amber-500/20">
        
        {/* Logo and header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 animate-bounce-slow">
            <span className="text-3xl text-neutral-900 font-bold">☕</span>
          </div>
          <h2 className="text-3xl font-extrabold text-amber-50 font-serif tracking-tight">Bean &amp; Brew</h2>
          <p className="text-amber-200/50 mt-1 text-sm">Cafe Management System</p>
        </div>

        <h3 className="text-xl font-semibold text-neutral-100 mb-6 text-center">Welcome Back</h3>

        {error && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-800/40 text-red-200 text-sm rounded-xl flex items-center gap-2">
            <span className="text-lg">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <EnvelopeIcon className="h-5 w-5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@cafe.com"
                className="w-full bg-[#201d1a]/50 text-neutral-100 placeholder-neutral-500 border border-amber-900/30 rounded-xl py-3 pl-11 pr-4 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-amber-200/60">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <KeyIcon className="h-5 w-5" />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#201d1a]/50 text-neutral-100 placeholder-neutral-500 border border-amber-900/30 rounded-xl py-3 pl-11 pr-11 outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-amber-400 transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-450 text-neutral-900 font-bold rounded-xl shadow-lg shadow-amber-900/20 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-amber-400 hover:text-amber-300 font-medium transition-colors">
            Register Staff
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
