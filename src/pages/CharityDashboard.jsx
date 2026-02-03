import { useEffect, useState } from "react";

function CharityDashboard({ charityId }) {
  const [donations, setDonations] = useState([]);
  const [stories, setStories] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [newStory, setNewStory] = useState({ title: "", content: "" });

    // Fetch donations
  useEffect(() => {
    fetch(`/api/charities/${charityId}/donations`)
      .then((res) => res.json())
      .then((data) => {
        setDonations(data);
        const total = data.reduce((sum, d) => sum + d.amount, 0);
        setTotalDonations(total);
      })
      .catch((err) => console.error(err));
  }, [charityId]);}