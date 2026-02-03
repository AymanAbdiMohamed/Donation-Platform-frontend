import { useEffect, useState } from "react";

function DonorDashboard({ donorId }) {
  const [donations, setDonations] = useState([]);
  const [stories, setStories] = useState([]);

  // Fetch donor donations
  useEffect(() => {
    fetch(`/api/donors/${donorId}/donations`)
      .then((res) => res.json())
      .then((data) => setDonations(data))
      .catch((err) => console.error(err));
  }, [donorId]);}