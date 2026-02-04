function CharityCard({ charity }) {
  return (
    <div className="bg-white border border-red-200 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden flex flex-col">
      
      {/* Image placeholder */}
      <div className="h-32 bg-red-100 flex items-center justify-center">
        <span className="text-red-400 font-semibold">
          Charity Image placeholder
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-red-600 mb-2">
          {charity.name}
        </h3>

        <p className="text-gray-700 text-sm mb-4 flex-grow">
          {charity.description}
        </p>

        {/* Donate button (UI ONLY) */}
        <button
          className="mt-auto bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Donate
        </button>
      </div>
    </div>
  );
}

export default CharityCard;
