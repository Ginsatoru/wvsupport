import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "./Images/logo.png";
import backgroundImage from "./Images/speaking.jpg"; // Change this to your preferred image
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { RiShieldKeyholeLine } from "react-icons/ri";

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      if (data.token) {
        if (rememberMe) {
          localStorage.setItem("adminToken", data.token);
        } else {
          sessionStorage.setItem("adminToken", data.token);
        }
        sessionStorage.setItem("LoginTime", Date.now());
        onLogin();
        navigate("/admin-panel", { state: { fromLogin: true } });
      } else {
        throw new Error("No token received");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    setShowForgotPasswordModal(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      {/* Image Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      {/* Login Card */}
      <div className="relative z-20 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="p-8 text-center">
            <img
              src={logoImage}
              alt="Logo"
              className="h-20 w-auto mx-auto mb-4 drop-shadow-lg"
            />
            <h2 className="text-white text-2xl font-semibold mb-2 drop-shadow-lg">
              Hi, Welcome Back
            </h2>
            <p className="text-white/90 text-sm drop-shadow">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-white px-4 py-3 rounded-xl text-sm text-center">
                  {error}
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-white/90 text-sm font-medium drop-shadow">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-[#0f8abe] focus:ring-2 focus:ring-[#0f8abe]/30 transition-all duration-200"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-white/90 text-sm font-medium drop-shadow">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-12 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-[#0f8abe] focus:ring-2 focus:ring-[#0f8abe]/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white/90 transition-colors duration-200"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#0f8abe] bg-white/20 border-white/30 rounded focus:ring-[#0f8abe] backdrop-blur-sm"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-white/90 cursor-pointer drop-shadow">
                    Keep me logged in
                  </label>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="text-sm text-white/90 hover:text-white transition-colors duration-200 drop-shadow"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0f8abe]/80 backdrop-blur-sm hover:bg-[#0f8abe] text-white py-3 px-6 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-[#0f8abe]/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center border border-[#0f8abe]/30"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeForgotPasswordModal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-full max-w-md p-6">
            {/* Close Button */}
            <button
              onClick={closeForgotPasswordModal}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200"
            >
              <FaTimes size={20} />
            </button>

            {/* Modal Header */}
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 w-16 h-16 bg-[#0f8abe]/20 rounded-full flex items-center justify-center">
                <RiShieldKeyholeLine size={32} className="text-[#0f8abe]" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2 drop-shadow-lg">
                Password Recovery
              </h3>
              <p className="text-white/80 text-sm drop-shadow">
                Need help accessing your admin panel?
              </p>
            </div>

            {/* Modal Body */}
            <div className="text-center mb-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-4">
                <p className="text-white/90 text-sm leading-relaxed">
                  For security reasons, password recovery requires manual verification. 
                  Please contact the developer to obtain new credentials or reset your password.
                </p>
              </div>
              
              <div className="text-left space-y-2">
                <p className="text-white/70 text-xs">
                  <span className="font-medium">Contact Information:</span>
                </p>
                <p className="text-white/90 text-sm">
                  📧 Email: naibo2002@gmail.com
                </p>
                <p className="text-white/90 text-sm">
                  💬 Phone: +855 879 688 50
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex space-x-3">
              <button
                onClick={closeForgotPasswordModal}
                className="flex-1 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-200 border border-white/20"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.location.href = 'mailto:naibo200@gmail.com?subject=Password Reset Request';
                }}
                className="flex-1 bg-[#0f8abe]/80 backdrop-blur-sm hover:bg-[#0f8abe] text-white py-2.5 px-4 rounded-xl font-medium transition-all duration-200 border border-[#0f8abe]/30"
              >
                Contact Developer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;