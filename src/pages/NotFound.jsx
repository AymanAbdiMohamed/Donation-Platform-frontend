import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5 w-fit">
            <div className="bg-primary/10 rounded-xl p-1.5">
              <Heart className="h-5 w-5 text-primary fill-primary" />
            </div>
            <span className="text-xl font-bold"><span className="text-primary">She</span>Needs</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-6 py-32">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <span className="text-4xl font-black text-primary">404</span>
        </div>
        <h1 className="text-3xl font-extrabold text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild size="lg" className="rounded-xl shadow-lg shadow-primary/20">
          <Link to="/">Go Back Home</Link>
        </Button>
      </main>
    </div>
  );
}

export default NotFound;
