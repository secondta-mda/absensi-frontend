import React, { useState, useEffect } from "react";
import API from "../../api";
import Logo from "../../img/logo-mda.png";
import BookingImage from '../../img/undraw_booking_1ztt.svg';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// Simple spinner component
function Spinner({ size = 40, color = "#ff0000" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className="animate-spin"
      style={{ display: "block", margin: "auto" }}
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeDasharray="90"
        strokeDashoffset="60"
      />
    </svg>
  );
}

export default function Login({ onLogin = () => {} }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Simulate initial loading animation
    const timer = setTimeout(() => setInitialLoading(false), 1200);
    if (localStorage.getItem("isLogin") === "true") {
      navigate("/dashboard");
    }
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/login", { username, password });
      if (res.data) {
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem("isLogin", "true");
        onLogin(res.data);
        navigate("/dashboard");
      }
      console.log("Login successful:", res.data);
    } catch (err) {
      const msg = err.response?.data?.message || err;
      alert(msg);
    }
    setLoading(false);
  };

  // Initial loading animation
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Spinner size={60} color="#ff0000" />
          <span className="text-[#ff0000] font-bold text-lg animate-pulse">
            Memuat...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col md:flex-row overflow-hidden">
        {/* BAGIAN GAMBAR */}
        <div className="hidden md:flex w-1/2 items-center justify-center p-10 bg-gray-50">
          <img
            src={BookingImage}
            alt="Absensi Ilustrasi"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* BAGIAN FORM LOGIN */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 p-8 space-y-7 flex flex-col items-center bg-white"
          style={{
            backdropFilter: "blur(2px)",
            boxShadow: "0 8px 32px 0 rgba(0,0,0,0.08)",
          }}
        >
          <img
            src={Logo}
            alt="Logo"
            width={200}
            className="mb-4"
          />
          <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-2 tracking-wide drop-shadow">
            Login
          </h2>

          {/* Username */}
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="username"
              className="text-sm font-semibold text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff0000] transition bg-gray-50 text-gray-800 font-medium shadow"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2 w-full relative">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#ff0000] transition bg-gray-50 text-gray-800 font-medium shadow pr-12"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-4 top-[53px] transform -translate-y-1/2 text-[#ff0000] hover:text-gray-700 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={
                showPassword ? "Sembunyikan Password" : "Lihat Password"
              }
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEye} size={25} />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} size={25} />
              )}
            </button>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#ff0000] to-gray-700 text-white px-4 py-3 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-150 tracking-wide flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size={24} color="#fff" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
