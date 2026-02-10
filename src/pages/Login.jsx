import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../constants";
import { Heart, Eye, EyeOff, Loader2, Shield, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
      navigate(getRedirectPath(user.role));
    } catch (err) {
      // Error handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left branding panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#1E3A8A] via-[#1e40af] to-[#1d4ed8] p-12 flex-col justify-between text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 blur-3xl -translate-x-20 translate-y-20" />

        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5">
            <Heart className="w-8 h-8 fill-white" />
            <span className="text-2xl font-bold tracking-tight">SheNeeds</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Every donation gives a girl the dignity to stay in school.
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            Join our community of donors and partner organizations creating real change across Africa.
          </p>
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Shield className="h-4 w-4" />
              <span>Secure & Verified</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Users className="h-4 w-4" />
              <span>50K+ Girls Supported</span>
            </div>
          </div>
        </div>

        <div className="relative text-sm text-white/40">
          &copy; {new Date().getFullYear()} SheNeeds Platform
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-secondary/50 to-white p-4 sm:p-8">
        <div className="w-full max-w-md flex flex-col items-center">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-primary">She</span>Needs
            </span>
          </div>

          {/* Login Card */}
          <Card className="w-full shadow-xl shadow-black/5 border-border/50">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
              <CardDescription>Sign in to continue to your dashboard</CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-6 text-center text-sm border border-destructive/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button variant="link" type="button" className="px-0 h-auto text-xs text-muted-foreground">
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 text-base font-semibold rounded-xl shadow-md shadow-primary/20"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to={ROUTES.REGISTER} className="text-primary font-semibold hover:underline">
                  Create account
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Login;

