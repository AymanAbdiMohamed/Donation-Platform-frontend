import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, getRedirectPath } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const returnedUser = await login(email, password);
      if (returnedUser?.role) {
        const redirectPath = getRedirectPath(returnedUser.role);
        navigate(redirectPath);
      } else {
        setError("Login succeeded but user data is invalid.");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT PANEL ??? BRANDING */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-gradient-to-br from-[#EC4899] via-[#DB2777] to-[#BE185D]">
        {/* decorative blurs */}
        <div className="absolute top-0 left-0 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/3 right-10 w-40 h-40 rounded-full bg-[#FBB6CE]/10 blur-2xl" />

        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SheNeeds</span>
          </Link>

          {/* headline */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm text-white/90">
              <Sparkles className="h-3.5 w-3.5 text-[#FBB6CE]" />
              Trusted by 200+ charities
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight">
              Every Donation<br />Changes a Life
            </h1>
            <p className="text-lg text-white/70 max-w-sm leading-relaxed">
              Help girls across sub-Saharan Africa stay in school with dignity through your generous contributions.
            </p>
          </div>

          {/* testimonial */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-6 border border-white/10">
            <p className="text-white/80 text-sm leading-relaxed italic">
              "SheNeeds made it incredibly easy to connect with donors who care. Our funding has grown 300% since joining."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center text-white text-sm font-bold">
                AK
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Amina Kimani</p>
                <p className="text-white/60 text-xs">Director, Bright Futures Kenya</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL ??? FORM */}
      <div className="flex flex-1 items-center justify-center bg-[#FDF2F8]/30 px-4 sm:px-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          {/* mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#EC4899] to-[#DB2777] shadow-pink">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-[#EC4899]">She</span><span className="text-[#1F2937]">Needs</span>
            </span>
          </div>

          {/* heading */}
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-extrabold text-[#1F2937] tracking-tight">
              Welcome back
            </h2>
            <p className="mt-2 text-[#4B5563]">
              Sign in to your account to continue
            </p>
          </div>

          {/* error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in">
              {error}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-[#1F2937]">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10 rounded-xl border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 bg-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-[#1F2937]">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  Signing in...
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-[#4B5563]">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[#EC4899] hover:text-[#DB2777] transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
