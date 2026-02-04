function CharityCard({ charity }) {
  return  (
    <div className="bg-white border border-red-200 rounded-xl shadow-sm p-6 hover:shadow-md transition">
      <h3 className="text-xl font-semibold text-red-600 mb-2">
        {charity.name}
      </h3>
      <p className="text-gray-700 text-sm">
        {charity.description}
      </p>
    </div>
  );
}

export default CharityCard;