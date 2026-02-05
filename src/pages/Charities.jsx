import { useEffect, useState } from "react";
import CharityCard from "../components/CharityCard";
import { getCharities } from "../api";
import { APPLICATION_STATUS } from "../constants";

function Charities() {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCharities({ status: APPLICATION_STATUS.APPROVED });
        setCharities(data);
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
      <div className="min-h-screen bg-red-50 px-4 sm:px-6 py-8">
        <p className="text-center text-gray-600">Loading charities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 px-4 sm:px-6 py-8">
        <p className="text-center text-red-600">{error}</p>
      </div>
    );
  }

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
