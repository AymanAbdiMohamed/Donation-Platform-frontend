import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <Heart className="h-6 w-6 text-primary fill-primary" />
            <span className="text-xl font-bold"><span className="text-primary">She</span>Needs</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-8xl font-black text-primary mb-4">404</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild size="lg">
          <Link to="/">Go Back Home</Link>
        </Button>
      </main>
    </div>
  );
}

export default NotFound;
