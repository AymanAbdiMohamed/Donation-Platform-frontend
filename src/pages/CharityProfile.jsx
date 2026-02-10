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
    <div className="min-h-screen bg-[#FDF2F8]/50">
      {/* Header */}
      <header className="border-b border-[#FBB6CE]/20 bg-white/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#EC4899] to-[#DB2777] shadow-pink group-hover:shadow-pink-lg transition-shadow">
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                <span className="text-[#EC4899]">She</span><span className="text-[#1F2937]">Needs</span>
              </span>
            </Link>
            <Button variant="ghost" size="sm" asChild className="text-[#4B5563] hover:text-[#EC4899] hover:bg-[#FDF2F8] rounded-lg">
              <Link to={ROUTES.CHARITIES}>
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                All Charities
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
            <Button asChild variant="outline" className="rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8]">
              <Link to={ROUTES.CHARITIES}>Back to Charities</Link>
            </Button>
          </div>
        ) : !charity ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-[#EC4899] mr-3" />
            <span className="text-[#4B5563]">Loading charity details...</span>
          </div>
        ) : (
          <div className="max-w-xl mx-auto animate-fade-in-up">
            <h1 className="text-3xl font-extrabold text-[#1F2937] text-center mb-8 tracking-tight">
              {charity.name}
            </h1>
            <CharityCard charity={charity} />
          </div>
        )}
      </main>
    </div>
  );
}

export default CharityProfile;
