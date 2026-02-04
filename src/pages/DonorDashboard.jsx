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
  }, [donorId]);
 
   // Fetch stories from all charities
  useEffect(() => {
    fetch("/api/stories")
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch((err) => console.error(err));
  }, []);

  const handleCancelRecurring = (donationId) => {
    fetch(`/api/donations/${donationId}/cancel`, {
      method: "PATCH",
    }).then(() => {
      setDonations((prev) =>
        prev.map((d) =>
          d.id === donationId ? { ...d, is_recurring: false } : d
        )
      );
    });
  };

  return (
    <div>
      <h1>Donor Dashboard</h1>

      <h2>Donation History</h2>
      <ul>
        {donations.map((d) => (
          <li key={d.id}>
            {d.is_anonymous ? "Anonymous" : d.charity_name} - ${d.amount} - {d.frequency} - {new Date(d.created_at).toLocaleDateString()}
            {d.is_recurring && (
              <button onClick={() => handleCancelRecurring(d.id)}>
                Cancel Recurring
              </button>
            )}
          </li>
        ))}
      </ul>

      <h2>Stories from Charities</h2>
      <ul>
        {stories.map((s) => (
          <li key={s.id}>
            <strong>{s.title}</strong> ({s.charity_name}): {s.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DonorDashboard;