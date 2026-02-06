import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES, ROUTES } from "../constants";
import { Heart, Loader2, User, Building2 } from "lucide-react";
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo Section */}
        <div className="mb-8 flex items-center gap-2">
          <Heart className="w-10 h-10 text-primary fill-primary" />
          <span className="text-3xl font-bold text-white tracking-tight">
            <span className="text-primary">She</span>Needs
          </span>
        </div>

        {/* Register Card */}
        <Card className="w-full bg-card/95 backdrop-blur border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold text-primary">Create Account</CardTitle>
            <CardDescription>Join our community and make a difference</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-lg mb-6 text-center text-sm border border-destructive/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full h-11 text-base font-semibold"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
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
  );
}

function RoleButton({ selected, onClick, icon: Icon, label, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center p-4 rounded-lg border-2 transition-all",
        selected
          ? "border-primary bg-primary/10 text-primary"
          : "border-border hover:border-primary/50 text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="w-6 h-6 mb-1" />
      <span className="font-medium">{label}</span>
      <span className="text-xs opacity-70">{description}</span>
    </button>
  );
}
