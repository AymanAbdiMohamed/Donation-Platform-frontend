import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCharities } from "../../api/charity";
import { initiateMpesaDonation } from "../../api/donor";
import CharityCard from "../../components/CharityCard";
import DonationModal from "../../components/DonationModal";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Heart,
  AlertCircle,
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";

const ITEMS_PER_PAGE = 9;

function BrowseCharities() {
  const navigate = useNavigate();

  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Donation modal
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const data = await getCharities();
        // Backend now standardized: always returns { charities: [], pagination: {} }
        setCharities(data.charities || []);
      } catch (err) {
        console.error("Failed to fetch charities:", err);
        setError("Could not load charities. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  // Derive regions from data
  const regions = useMemo(() => {
    const set = new Set(charities.map((c) => c.region).filter(Boolean));
    return Array.from(set).sort();
  }, [charities]);

  // Filter + search
  const filtered = useMemo(() => {
    let list = charities;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.missionStatement?.toLowerCase().includes(q) ||
          c.mission?.toLowerCase().includes(q)
      );
    }
    if (selectedRegion) {
      list = list.filter((c) => c.region === selectedRegion);
    }
    return list;
  }, [charities, searchQuery, selectedRegion]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginatedCharities = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedRegion]);

  const handleOpenModal = (charity) => {
    setSelectedCharity(charity);
    setIsModalOpen(true);
  };

  const handleConfirmDonation = async (amount, phoneNumber, message, isAnonymous) => {
    if (!selectedCharity) return;
    const response = await initiateMpesaDonation({
      charity_id: selectedCharity.id,
      amount,
      phone_number: phoneNumber,
      message: message || "",
      is_anonymous: Boolean(isAnonymous),
    });
    setIsModalOpen(false);
    navigate("/donation/success", {
      state: {
        donation: response?.donation,
        charity: selectedCharity,
        stkMessage: response?.message,
      },
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRegion("");
  };

  const hasActiveFilters = searchQuery || selectedRegion;

  if (loading) {
    return (
      <DashboardLayout title="Browse Charities">
        <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[#FDF2F8] flex items-center justify-center mb-4">
            <Loader2 className="h-7 w-7 animate-spin text-[#EC4899]" />
          </div>
          <p className="text-[#4B5563] font-medium">Loading amazing charities...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Browse Charities">
      {/* Hero Header */}
      <div className="mb-8 animate-fade-in-up">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#EC4899] via-[#DB2777] to-[#BE185D] p-8 sm:p-10 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 blur-3xl translate-x-20 -translate-y-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-3xl -translate-x-10 translate-y-10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#FBB6CE]" />
              <span className="text-sm font-medium text-[#FBB6CE]">Discover & Give</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Explore Charities
            </h1>
            <p className="text-white/80 max-w-lg">
              Find a cause that speaks to you and make a difference today. Every donation counts.
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="mb-6 space-y-3 animate-fade-in-up animation-delay-200">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
            <Input
              placeholder="Search charities by name, mission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 bg-white border-[#FBB6CE]/30 focus:border-[#EC4899] focus:ring-[#EC4899]/20 rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#1F2937] transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8] hover:border-[#EC4899]/30 transition-all ${
              showFilters ? "bg-[#FDF2F8] border-[#EC4899]/30 text-[#EC4899]" : ""
            }`}
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 w-5 h-5 rounded-full bg-[#EC4899] text-white text-xs flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl border border-[#FBB6CE]/20 p-4 animate-scale-in shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-[#1F2937]">Filter by Region</span>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-[#EC4899] hover:text-[#DB2777] font-medium transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedRegion("")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  !selectedRegion
                    ? "bg-[#EC4899] text-white shadow-sm"
                    : "bg-[#FDF2F8] text-[#4B5563] hover:bg-[#FCE7F3]"
                }`}
              >
                All Regions
              </button>
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedRegion === region
                      ? "bg-[#EC4899] text-white shadow-sm"
                      : "bg-[#FDF2F8] text-[#4B5563] hover:bg-[#FCE7F3]"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#4B5563]">
            Showing <span className="font-semibold text-[#1F2937]">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "charity" : "charities"}
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-[#EF4444]" />
          </div>
          <p className="text-[#EF4444] font-semibold mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="rounded-xl"
          >
            Try Again
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[#FDF2F8] flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-[#FBB6CE]" />
          </div>
          <p className="text-[#1F2937] text-lg font-semibold mb-1">No charities found</p>
          <p className="text-[#4B5563] text-sm mb-4">
            {hasActiveFilters
              ? "Try adjusting your search or filters."
              : "Check back later!"}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8]"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedCharities.map((charity, i) => (
              <div
                key={charity.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CharityCard charity={charity} onDonate={handleOpenModal} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 animate-fade-in">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8] disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`rounded-xl min-w-[36px] ${
                    page === currentPage
                      ? "bg-[#EC4899] hover:bg-[#DB2777] text-white shadow-pink"
                      : "border-[#FBB6CE]/30 hover:bg-[#FDF2F8]"
                  }`}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="rounded-xl border-[#FBB6CE]/30 hover:bg-[#FDF2F8] disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Donation Modal */}
      <DonationModal
        charity={selectedCharity}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDonation}
      />
    </DashboardLayout>
  );
}

export default BrowseCharities;
