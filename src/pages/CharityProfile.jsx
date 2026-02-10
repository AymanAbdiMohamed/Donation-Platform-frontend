import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import CharityCard from "../components/CharityCard";
import { ROUTES } from "../constants";
import { Heart, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

function CharityProfile() {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        const response = await api.get(`/charities/${id}`);
        setCharity(response.data.charity);
      } catch (err) {
        console.error("Failed to load charity:", err);
        setError("Charity not found or unavailable.");
      }
    };
    fetchCharity();
  }, [id]);

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
            <Button variant="ghost" size="sm" asChild>
              <Link to={ROUTES.CHARITIES}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                All Charities
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive text-lg mb-4">{error}</p>
            <Button variant="outline" asChild>
              <Link to={ROUTES.CHARITIES}>Back to Charities</Link>
            </Button>
          </div>
        ) : !charity ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-3" />
            <span className="text-muted-foreground">Loading charity details...</span>
          </div>
        ) : (
          <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8">{charity.name}</h1>
            <CharityCard charity={charity} />
          </div>
        )}
      </main>
    </div>
  );
}

export default CharityProfile;
