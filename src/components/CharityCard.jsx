/**
 * CHARITY CARD
 * 
 * This is a 'reusable' component. We use it multiple times on the BrowseCharities page.
 * Each card gets its own 'charity' data to display.
 * 
 * Props:
 * - charity: All the info about the charity (name, image, mission)
 * - onDonate: A function to call when the user clicks 'Donate Now'
 */
function CharityCard({ charity, onDonate }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      {/* Charity Image Placeholder / Logo */}
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {charity.image ? (
          <img 
            src={charity.image} 
            alt={charity.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        )}
        {/* Category Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
          {charity.category || "General"}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
          {charity.name}
        </h3>
        <p className="text-gray-500 text-sm mt-2 line-clamp-3">
          {charity.missionStatement || charity.description || "No description provided."}
        </p>

        {/* Stats Summary (Optional) */}
        <div className="mt-4 flex items-center gap-4 text-xs font-semibold text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-gray-900">{charity.girlsReachedLastYear || 0}</span> Girls Reached
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-900">{charity.regionServed || "Global"}</span>
          </div>
        </div>

        {/* Donate Button */}
        <button 
          onClick={() => onDonate(charity)}
          className="mt-6 w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-black transition-colors shadow-lg shadow-red-100 flex items-center justify-center gap-2"
        >
          Donate Now
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default CharityCard;
