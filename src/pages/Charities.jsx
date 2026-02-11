import { useEffect, useState, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import CharityCard from "@/components/CharityCard";
import { getCharities } from "@/api/charity";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Heart,
  Loader2,
  AlertCircle,
  Building2,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

const ITEMS_PER_PAGE = 12;

function Charities() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    per_page: ITEMS_PER_PAGE,
  });
  const [searchTerm, setSearchTerm] = useState("");

  // Get current page from URL or default to 1
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const fetchCharities = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCharities({ page, per_page: ITEMS_PER_PAGE });
      setCharities(data?.charities || data || []);
      if (data?.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch charities:", err);
      setError("Failed to load charities. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCharities(currentPage);
  }, [currentPage, fetchCharities]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setSearchParams({ page: newPage.toString() });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Filter charities by search term (client-side for simplicity)
  const filteredCharities = charities.filter((charity) =>
    charity.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    charity.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF2F8]/50 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <Loader2 className="h-8 w-8 animate-spin text-[#EC4899] mx-auto mb-4" />
          <p className="text-[#4B5563]">Loading charities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDF2F8]/50 flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8]"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
                <span className="text-[#EC4899]">She</span>
                <span className="text-[#1F2937]">Needs</span>
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-[#4B5563] hover:text-[#EC4899] hover:bg-[#FDF2F8] rounded-lg"
              >
                <Link to={ROUTES.HOME}>
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Home
                </Link>
              </Button>

              <Button size="sm" asChild className="rounded-xl bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink">
                <Link to={ROUTES.LOGIN}>
                  Sign In
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FDF2F8] to-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#EC4899]/5 blur-3xl -translate-y-1/2"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FDF2F8] to-[#FBB6CE]/30 mb-5">
            <Building2 className="h-6 w-6 text-[#EC4899]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F2937] mb-3">
            Approved Charities
          </h2>
          <p className="text-[#4B5563] max-w-2xl mx-auto text-lg">
            Support verified organizations that are making a difference in menstrual health education and access.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <Input
              type="text"
              placeholder="Search charities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20"
            />
          </div>
          {searchTerm && (
            <p className="text-sm text-[#6B7280] mt-2 text-center">
              Showing {filteredCharities.length} of {charities.length} charities
            </p>
          )}
        </div>

        {filteredCharities.length === 0 ? (
          <div className="text-center py-20 animate-fade-in-up">
            <div className="w-16 h-16 rounded-2xl bg-[#FDF2F8] flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-7 w-7 text-[#EC4899]/50" />
            </div>
            <h3 className="text-lg font-bold text-[#1F2937] mb-2">
              {searchTerm ? "No Matching Charities" : "No Charities Yet"}
            </h3>
            <p className="text-[#4B5563]">
              {searchTerm
                ? "Try adjusting your search term."
                : "No charities available at the moment. Check back soon!"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCharities.map((charity, i) => (
                <div
                  key={charity.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <CharityCard charity={charity} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.pages > 1 && !searchTerm && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="rounded-lg border-[#FBB6CE]/30 hover:bg-[#FDF2F8] disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-1 px-4">
                  {/* Show page numbers */}
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, idx) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === currentPage ? "default" : "ghost"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 p-0 rounded-lg ${
                          pageNum === currentPage
                            ? "bg-[#EC4899] hover:bg-[#DB2777] text-white"
                            : "hover:bg-[#FDF2F8] text-[#4B5563]"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= pagination.pages}
                  className="rounded-lg border-[#FBB6CE]/30 hover:bg-[#FDF2F8] disabled:opacity-50"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Pagination Info */}
            {pagination.total > 0 && !searchTerm && (
              <p className="text-center text-sm text-[#6B7280] mt-4">
                Page {pagination.page} of {pagination.pages} ({pagination.total} charities)
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Charities;