import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CharityCard from "../components/CharityCard";

function CharityProfile() {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);

  useEffect(() => {
    fetch(`/api/charities/${id}`)
      .then((res) => res.json())
      .then((data) => setCharity(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!charity) {
    return <p className="text-center mt-10">Loading charity...</p>;
  }

  return (
    <div className="min-h-screen bg-red-50 px-6 py-8">
      <h1 className="text-3xl font-bold text-red-600 mb-6 text-center">
        Charity Details
      </h1>

      <div className="max-w-xl mx-auto">
        {/* Reusing CharityCard */}
        <CharityCard charity={charity} />
      </div>
    </div>
  );
}

export default CharityProfile;
