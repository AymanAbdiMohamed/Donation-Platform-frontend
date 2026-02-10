import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CharityCard from "@/components/CharityCard";
import { getCharities } from "@/api/charity";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, AlertCircle, Building2, ArrowLeft } from "lucide-react";


function Charities() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCharities();
        setCharities(data.charities || []);
      } catch (err) {
        console.error("Failed to fetch charities:", err);
        setError("Failed to load charities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCharities();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading charities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
              <div className="bg-primary/10 rounded-xl p-1.5">
                <Heart className="h-5 w-5 text-primary fill-primary" />
              </div>
              <span className="text-xl font-bold"><span className="text-primary">She</span>Needs</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to={ROUTES.HOME}>
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Home
                </Link>
              </Button>
              <Button size="sm" className="rounded-xl shadow-sm" asChild>
                <Link to={ROUTES.LOGIN}>
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 mb-4">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">Approved Charities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Support verified organizations that are making a difference in menstrual health education and access.
          </p>
        </div>

        {charities.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Charities Yet</h3>
            <p className="text-muted-foreground">
              No charities available at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {charities.map((charity) => (
              <CharityCard key={charity.id} charity={charity} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Charities;
