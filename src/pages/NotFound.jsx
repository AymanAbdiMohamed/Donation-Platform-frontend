import { Link } from "react-router-dom";
import { Heart, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDF2F8]/50 px-4">
      {/* decorative blurs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#EC4899]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-60 h-60 rounded-full bg-[#FBB6CE]/10 blur-3xl pointer-events-none" />

      <div className="relative text-center space-y-6 animate-fade-in-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#DB2777] shadow-pink-lg mb-2">
          <Heart className="h-7 w-7 text-white" />
        </div>

        <h1 className="text-7xl sm:text-8xl font-extrabold text-[#EC4899] tracking-tight">404</h1>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1F2937]">Page Not Found</h2>
        <p className="text-[#4B5563] max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved to a new location.
        </p>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Button asChild variant="outline" className="h-10 rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8] text-[#1F2937]">
            <Link to="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild className="h-10 rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink">
            <Link to="/">
              <Home className="mr-1.5 h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
