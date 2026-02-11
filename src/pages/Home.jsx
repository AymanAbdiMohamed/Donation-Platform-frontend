import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Globe,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Carousel from "@/components/Carousel";
import { useState, useEffect } from "react";
import girl1 from "../assets/girl1.jpg";
import girl2 from "../assets/girl2.jpg";
import girl3 from "../assets/girl3.jpg";
import girl4 from "../assets/girl4.jpg";

function Home() {
  const { isAuthenticated, user, logout, getRedirectPath } = useAuth();
  // Images for hero slideshow
  const heroImages = [girl1, girl2, girl3, girl4];

  // State to track current image
  const [currentImage, setCurrentImage] = useState(0);

  // Auto-change image every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDF2F8]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-[#FBB6CE]/20 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#EC4899] to-[#DB2777] shadow-pink group-hover:shadow-pink-lg transition-shadow duration-300">
              <Heart className="h-5 w-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-[#EC4899]">She</span>
              <span className="text-[#1F2937]">Needs</span>
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/charities"
              className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors"
            >
              Charities
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getRedirectPath(user?.role)}
                  className="px-3 py-2 text-sm font-medium text-[#EC4899] hover:bg-[#FDF2F8] rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="ml-2 rounded-lg border border-[#FBB6CE]/30 px-4 py-2 text-sm font-medium text-[#4B5563] hover:bg-[#FDF2F8] transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-[#4B5563] hover:text-[#EC4899] rounded-lg hover:bg-[#FDF2F8] transition-colors"
                >
                  Sign In
                </Link>
                <Button
                  asChild
                  size="sm"
                  className="ml-2 rounded-lg bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink"
                >
                  <Link to="/register">
                    Get Started
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden min-h-[600px]">
        {/* Background image slideshow */}
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentImage ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={img}
                alt={`Hero ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-white/40" />
            </div>
          ))}
        </div>

        {/* Background decorations */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-primary/5 via-transparent to-white" />
        <div className="absolute z-10 top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2" />
        <div className="absolute z-10 top-40 right-0 w-72 h-72 rounded-full bg-teal-100/40 blur-3xl" />
        <div className="absolute z-10 top-60 left-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#FBB6CE]/30 bg-[#FDF2F8] px-4 py-1.5 text-sm font-medium text-[#EC4899] animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              Empowering Girls Across Africa
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1F2937] leading-[1.1] text-balance animate-fade-in-up">
              Help Girls Stay in School{" "}
              <span className="text-[#EC4899]">with Dignity</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#4B5563] max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
              Your donations provide sanitary products, clean water, and proper
              sanitation facilities for school-going girls across sub-Saharan
              Africa.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
              <Button
                asChild
                size="lg"
                className="h-12 px-8 text-base rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                <Link
                  to={
                    isAuthenticated ? getRedirectPath(user?.role) : "/register"
                  }
                >
                  {isAuthenticated ? "Go to Dashboard" : "Start Donating"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                size="lg"
                className="h-12 px-8 text-base rounded-xl border-2 hover:bg-primary/5"
              >
                <Link to="/charities">View Charities</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-[#4B5563] animate-fade-in-up animation-delay-600">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-[#22C55E]" />
                <span>Verified Charities</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4 text-[#EC4899]" />
                <span>100% Goes to Cause</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-[#F59E0B]" />
                <span>Active in 12+ Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="relative border-y border-[#FBB6CE]/20 bg-gradient-to-r from-[#FDF2F8] via-white to-[#FDF2F8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              {
                value: "50K+",
                label: "Girls Supported",
                icon: Users,
                color: "text-[#EC4899]",
                bg: "bg-[#FDF2F8]",
              },
              {
                value: "KES 2M+",
                label: "Funds Raised",
                icon: TrendingUp,
                color: "text-[#22C55E]",
                bg: "bg-[#dcfce7]",
              },
              {
                value: "200+",
                label: "Partner Charities",
                icon: Heart,
                color: "text-[#F59E0B]",
                bg: "bg-[#fffbeb]",
              },
              {
                value: "12+",
                label: "Countries Reached",
                icon: Globe,
                color: "text-[#8B5CF6]",
                bg: "bg-[#f5f3ff]",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} mb-3 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground font-medium mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR PARTNERS CAROUSEL */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F2937] tracking-tight">
              Our Partners
            </h2>
            <p className="mt-2 text-[#4B5563]">
              Trusted organizations working with us
            </p>
          </div>
          <Carousel />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
              How It Works
            </h2>
            <p className="mt-3 text-lg text-[#4B5563] max-w-xl mx-auto">
              Three simple steps to making a life-changing impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                icon: BookOpen,
                title: "Choose a Charity",
                desc: "Browse verified organizations making a real impact in menstrual health education and access.",
                color: "bg-[#FDF2F8] text-[#EC4899]",
              },
              {
                step: "02",
                icon: Heart,
                title: "Make a Donation",
                desc: "Contribute any amount ??? every shilling helps provide essential products and support.",
                color: "bg-[#FDF2F8] text-[#DB2777]",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Track Your Impact",
                desc: "See exactly how your donations help girls stay in school and change lives.",
                color: "bg-[#fffbeb] text-[#F59E0B]",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative group rounded-2xl border border-[#FBB6CE]/10 bg-white p-8 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300"
              >
                <div className="absolute top-6 right-6 text-5xl font-extrabold text-[#FBB6CE]/20 select-none">
                  {item.step}
                </div>
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.color} mb-5`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-[#1F2937] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#4B5563] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY TRUST US */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-[#FDF2F8]/50 to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
              Why Organizations Trust Us
            </h2>
            <p className="mt-3 text-lg text-[#4B5563] max-w-xl mx-auto">
              Built for transparency, designed for impact
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Verified Partners",
                desc: "Every charity undergoes a thorough vetting process before joining our platform.",
                icon: Shield,
              },
              {
                title: "Complete Transparency",
                desc: "Real-time donation tracking with downloadable receipts for every transaction.",
                icon: BookOpen,
              },
              {
                title: "Secure Payments",
                desc: "Industry-standard encryption protects your financial information at every step.",
                icon: Heart,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-6 rounded-xl bg-white border border-[#FBB6CE]/10 hover:border-[#EC4899]/20 hover:shadow-pink transition-all duration-300"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#FDF2F8] flex items-center justify-center text-[#EC4899]">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#EC4899] via-[#DB2777] to-[#BE185D] p-10 sm:p-16 text-center text-white">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-white blur-3xl" />
            </div>

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-balance">
                Ready to Make a Difference?
              </h2>
              <p className="mt-4 text-lg text-white/80 max-w-xl mx-auto">
                Join thousands of donors and charity organizations working
                together to ensure every girl can stay in school with dignity.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-12 px-8 text-base rounded-xl font-bold shadow-lg"
                >
                  <Link
                    to={
                      isAuthenticated
                        ? getRedirectPath(user?.role)
                        : "/register"
                    }
                  >
                    {isAuthenticated
                      ? "Go to Dashboard"
                      : "Create Free Account"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="h-12 px-8 text-base rounded-xl font-bold text-white hover:bg-white/10 border border-white/20"
                >
                  <Link to="/charities">Explore Charities</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#FBB6CE]/20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#EC4899] fill-[#EC4899]" />
              <span className="font-bold">
                <span className="text-[#EC4899]">She</span>
                <span className="text-[#1F2937]">Needs</span>
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link
                to="/charities"
                className="hover:text-primary transition-colors"
              >
                Charities
              </Link>
              <Link
                to="/login"
                className="hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="hover:text-primary transition-colors"
              >
                Register
              </Link>
            </div>
            <p className="text-sm text-[#9CA3AF]">
              &copy; {new Date().getFullYear()} SheNeeds. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
