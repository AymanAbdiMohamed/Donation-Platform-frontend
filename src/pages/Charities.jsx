import { useEffect, useState } from "react";
import CharityCard from "../components/CharityCard";

function Charities() {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    fetch("/api/charities?status=approved")
      .then((res) => res.json())
      .then((data) => setCharities(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="min-h-screen bg-red-50 px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold text-red-600 mb-8 text-center">
        Approved Charities
      </h1>

      {charities.length === 0 ? (
        <p className="text-center text-gray-600">
          No charities available at the moment.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {charities.map((charity) => (
            <CharityCard key={charity.id} charity={charity} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Charities;
