import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Mail, Lock, User, ArrowRight, Sparkles, HandHeart, Building2 } from "lucide-react";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
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
      const response = await registerUser(
        formData.username,
        formData.email,
        formData.password,
        formData.role
      );
      if (response?.user?.role) {
        navigate(getRedirectPath(response.user.role));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      value: "donor",
      label: "Donor",
      desc: "Support charities with donations",
      icon: HandHeart,
    },
    {
      value: "charity",
      label: "Charity",
      desc: "Register your organization",
      icon: Building2,
    },
  ];

  return (
    <div className="flex min-h-screen">
      {/* LEFT PANEL ??? BRANDING */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-[#EC4899] via-[#DB2777] to-[#BE185D]">
        <div className="absolute top-0 left-0 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-40 h-40 rounded-full bg-[#FBB6CE]/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SheNeeds</span>
          </Link>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#FBB6CE]" />
              Join our growing community
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Start Your<br />Journey Today
            </h1>
            <p className="text-lg text-white/70 max-w-sm leading-relaxed">
              Whether you want to give or receive support, SheNeeds connects you with a community that cares.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 border border-white/10">
              <p className="text-3xl font-extrabold text-white">50K+</p>
              <p className="text-white/60 text-sm mt-1">Girls Supported</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-5 border border-white/10">
              <p className="text-3xl font-extrabold text-white">200+</p>
              <p className="text-white/60 text-sm mt-1">Partner Charities</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL ??? FORM */}
      <div className="flex flex-1 items-center justify-center bg-[#FDF2F8]/30 px-4 sm:px-8">
        <div className="w-full max-w-md space-y-7 animate-fade-in-up">
          {/* mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#EC4899] to-[#DB2777] shadow-pink">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-[#EC4899]">She</span><span className="text-[#1F2937]">Needs</span>
            </span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
              Create your account
            </h2>
            <p className="mt-2 text-[#4B5563]">
              Get started in just a few steps
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ROLE SELECTION */}
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-[#1F2937]">I want to...</Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => {
                  const isSelected = formData.role === role.value;
                  return (
                    <button
                      type="button"
                      key={role.value}
                      onClick={() => setFormData({ ...formData, role: role.value })}
                      className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                        isSelected
                          ? "border-[#EC4899] bg-[#FDF2F8] shadow-pink"
                          : "border-[#FBB6CE]/20 bg-white hover:border-[#FBB6CE]/40"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        isSelected ? "bg-[#EC4899] text-white" : "bg-[#FDF2F8] text-[#EC4899]"
                      }`}>
                        <role.icon className="h-5 w-5" />
                      </div>
                      <span className={`text-sm font-semibold ${isSelected ? "text-[#EC4899]" : "text-[#1F2937]"}`}>
                        {role.label}
                      </span>
                      <span className="text-xs text-[#9CA3AF] text-center leading-tight">{role.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium text-[#1F2937]">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  className="h-11 pl-10 rounded-xl border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-sm font-medium text-[#1F2937]">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="reg-email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-11 pl-10 rounded-xl border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-password" className="text-sm font-medium text-[#1F2937]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="reg-password"
                  name="password"
                  type="password"
                  required
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="h-11 pl-10 rounded-xl border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 bg-white"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white font-semibold shadow-pink hover:shadow-pink-lg transition-all disabled:opacity-60"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-[#4B5563]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#EC4899] hover:text-[#DB2777] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
