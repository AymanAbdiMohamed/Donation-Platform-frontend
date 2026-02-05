import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants";

function Login() {
  const navigate = useNavigate();
  const { login, error, loading, clearError, getRedirectPath } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      const user = await login(formData.email, formData.password);
      // Use centralized redirect path logic from AuthContext
      navigate(getRedirectPath(user.role));
    } catch (err) {
      // Error handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-500 via-gray-700 to-gray-900 p-4">
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* Logo Section */}
        <div className="mb-6 flex items-center gap-2">
            <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
           <span className="text-4xl italic font-bold text-white tracking-tight">
             <span className="text-red-500">She</span>Needs
           </span>
        </div>

        {/* Login Card */}
        <div className="w-full bg-[#3d3d3d] rounded-3xl p-12 shadow-2xl border border-gray-600 flex flex-col items-center">
          <h1 className="text-5xl font-bold text-red-600 mb-12">Login</h1>

          {error && (
            <div className="w-full bg-red-900/30 text-red-300 p-3 rounded-lg mb-6 text-center text-sm border border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-8">
            {/* Username/Email */}
            <div className="flex items-center">
              <label className="text-white text-2xl w-40 font-medium">Username</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 bg-white h-14 rounded-2xl px-4 text-gray-900 text-xl focus:outline-none focus:ring-4 focus:ring-red-500/20"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center">
              <label className="text-white text-2xl w-40 font-medium">Password</label>
              <div className="flex-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white h-14 rounded-2xl pl-4 pr-12 text-gray-900 text-xl focus:outline-none focus:ring-4 focus:ring-red-500/20"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-800"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* TODO: 2FA/TOTP support - implement when backend supports it */}

            {/* Forgot Password Link */}
            <div className="text-center">
              <button type="button" className="text-white underline text-sm hover:text-red-400 transition">
                Forgot Password ?
              </button>
            </div>

            {/* Admin Login Button */}
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-16 rounded-full text-lg shadow-lg transform active:scale-95 transition"
              >
                {loading ? "Please wait..." : "Admin login"}
              </button>
            </div>
          </form>

          {/* Social Icons */}
          <div className="mt-12 flex gap-6">
            <SocialButton icon="instagram" />
            <SocialButton icon="facebook" />
            <SocialButton icon="twitter" />
            <SocialButton icon="whatsapp" />
          </div>
        </div>

        <p className="mt-8 text-white/70">
          Don&apos;t have an account? <Link to="/register" className="text-white underline font-bold">Register</Link>
        </p>
      </div>
    </div>
  );
}

function SocialButton({ icon }) {
  const icons = {
    instagram: "https://cdn-icons-png.flaticon.com/512/174/174855.png",
    facebook: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
    twitter: "https://upload.wikimedia.org/wikipedia/commons/5/5a/X_icon_2.svg",
    whatsapp: "https://cdn-icons-png.flaticon.com/512/733/733585.png"
  };

  return (
    <button className="w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-110 active:scale-90">
      <img src={icons[icon]} alt={icon} className={`w-10 h-10 ${icon === 'twitter' ? 'bg-black p-1 rounded-md' : ''}`} />
    </button>
  );
}

export default Login;

