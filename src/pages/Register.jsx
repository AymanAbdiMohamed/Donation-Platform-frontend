import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    postalAddress: "",
    password: "",
    confirmPassword: "",
    role: "donor",
  });

  const [rememberMe, setRememberMe] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const user = await register(formData.email, formData.password, formData.role);
      const dashboards = {
        donor: "/donor/dashboard",
        charity: "/charity/dashboard",
        admin: "/admin/dashboard",
      };
      navigate(dashboards[user.role] || "/donor/dashboard");
    } catch (err) {
      // Error handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-500 via-gray-700 to-gray-900 p-4">
      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Logo Section */}
        <div className="mb-6 flex items-center gap-2">
            <svg className="w-12 h-12 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-4xl italic font-bold text-white tracking-tight">
                <span className="text-red-500">She</span>Needs
            </span>
        </div>

        {/* Register Card */}
        <div className="w-full bg-[#3d3d3d] rounded-3xl p-16 shadow-2xl border border-gray-600 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-red-600 mb-16">Register With us Today</h1>

          {error && (
            <div className="w-full bg-red-900/30 text-red-300 p-3 rounded-lg mb-8 text-center text-sm border border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              <Input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                name="postalAddress"
                placeholder="Postal Address"
                value={formData.postalAddress}
                onChange={handleChange}
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              <Input
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            {/* Role Selection (Add logic for selecting Charity if needed) */}
            <div className="mt-8 flex justify-center">
                 <select 
                    name="role" 
                    value={formData.role} 
                    onChange={handleChange}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-bold outline-none"
                 >
                    <option value="donor">Register as Donor</option>
                    <option value="charity">Register as Charity</option>
                 </select>
            </div>

            {/* Remember me */}
            <div className="mt-8 flex items-center gap-4">
              <div 
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-6 h-6 rounded bg-gray-400 cursor-pointer flex items-center justify-center transition ${rememberMe ? 'bg-red-500' : ''}`}
              >
                {rememberMe && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-gray-300 text-sm">Remember me</span>
            </div>

            <div className="mt-20 text-center space-y-4">
              <p className="text-white text-sm">Ready to make an impactful Donation</p>
              <button 
                type="submit" 
                disabled={loading}
                className="text-red-500 font-bold text-lg hover:underline transition uppercase"
              >
                {loading ? "Processing..." : "Donate Now"}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-8 text-white/70">
          Already have an account? <Link to="/login" className="text-white underline font-bold">Login</Link>
        </p>
      </div>
    </div>
  );
}

function Input({ name, type = "text", placeholder, value, onChange }) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-[#bdbdbd] h-16 rounded-3xl px-6 text-gray-800 text-xl italic placeholder:text-gray-600 focus:outline-none focus:ring-4 focus:ring-red-500/20"
      required
    />
  );
}
