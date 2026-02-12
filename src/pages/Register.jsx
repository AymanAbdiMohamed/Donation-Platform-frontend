import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Mail, Lock, ArrowRight, HandHeart, Building2, Loader2 } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "donor",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register: registerUser, getRedirectPath } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const returnedUser = await registerUser(
        formData.email,
        formData.password,
        formData.role
      );
      if (returnedUser?.role) {
        const redirectPath = getRedirectPath(returnedUser.role);
        navigate(redirectPath);
      } else {
        setError("Registration succeeded but user data is invalid.");
      }
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: "donor",
      label: "Donor",
      desc: "I want to donate",
      icon: HandHeart,
    },
    {
      value: "charity",
      label: "Charity",
      desc: "I need funding",
      icon: Building2,
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700">
      {/* Animated Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse delay-700" />

      {/* Glassmorphism Card */}
      <div className="relative w-full max-w-lg bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl p-8 sm:p-10 animate-fade-in-up">

        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 group-hover:bg-white/30 transition-colors backdrop-blur-md shadow-lg">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SheNeeds</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-pink-100/80 text-lg">
            Join our community of changemakers
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-100 text-sm font-medium backdrop-blur-md animate-fade-in shadow-inner">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4">
            {roles.map((role) => {
              const isSelected = formData.role === role.value;
              return (
                <button
                  type="button"
                  key={role.value}
                  onClick={() => setFormData({ ...formData, role: role.value })}
                  className={`relative group flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 ${isSelected
                      ? "bg-white border-white shadow-xl scale-[1.02]"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/30"
                    }`}
                >
                  <div className={`p-3 rounded-xl mb-3 transition-colors ${isSelected ? "bg-pink-100 text-pink-600" : "bg-white/10 text-white group-hover:scale-110 transition-transform"
                    }`}>
                    <role.icon className="w-6 h-6" />
                  </div>
                  <span className={`font-bold ${isSelected ? "text-gray-900" : "text-white"}`}>
                    {role.label}
                  </span>
                  <span className={`text-xs mt-1 ${isSelected ? "text-gray-500" : "text-white/60"}`}>
                    {role.desc}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-white/90 font-medium ml-1">Email Address</Label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-white transition-colors" />
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-12 h-12 rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/50 focus:ring-0 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white/90 font-medium ml-1">Password</Label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60 group-focus-within:text-white transition-colors" />
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-12 h-12 rounded-xl bg-white/10 border-white/10 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/50 focus:ring-0 transition-all"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 rounded-xl bg-white text-pink-600 hover:bg-pink-50 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Account...
              </div>
            ) : (
              <span className="flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </span>
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-pink-100/80 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-bold hover:underline decoration-2 underline-offset-4">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
