import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES, ROUTES } from "../constants";
import { Heart, Loader2, User, Building2, ArrowRight, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error, clearError, getRedirectPath } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: ROLES.DONOR,
  });

  const handleChange = (e) => {
    clearError();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
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
      navigate(getRedirectPath(user.role));
    } catch (err) {
      // Error handled in AuthContext
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary via-rose-600 to-rose-700 p-12 flex-col justify-between text-white overflow-hidden">
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
            Join a movement that keeps girls in school.
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            Whether you&apos;re a donor or a charity organization, create your account and start making an impact today.
          </p>
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Shield className="h-4 w-4" />
              <span>Verified Partners</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Users className="h-4 w-4" />
              <span>Free to Join</span>
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

          {/* Register Card */}
          <Card className="w-full shadow-xl shadow-black/5 border-border/50">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription>Join our community and make a difference</CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-6 text-center text-sm border border-destructive/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role Selection */}
                <div className="space-y-2">
                  <Label>I want to register as</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <RoleButton
                      selected={formData.role === ROLES.DONOR}
                      onClick={() => handleRoleSelect(ROLES.DONOR)}
                      icon={User}
                      label="Donor"
                      description="Make donations"
                    />
                    <RoleButton
                      selected={formData.role === ROLES.CHARITY}
                      onClick={() => handleRoleSelect(ROLES.CHARITY)}
                      icon={Building2}
                      label="Charity"
                      description="Receive donations"
                    />
                  </div>
                </div>

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
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="h-11"
                  />
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
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex justify-center border-t pt-6">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to={ROUTES.LOGIN} className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

function RoleButton({ selected, onClick, icon: Icon, label, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200",
        selected
          ? "border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10"
          : "border-border hover:border-primary/30 text-muted-foreground hover:text-foreground"
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors",
        selected ? "bg-primary/10" : "bg-secondary"
      )}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-semibold text-sm">{label}</span>
      <span className="text-xs opacity-60 mt-0.5">{description}</span>
    </button>
  );
}
