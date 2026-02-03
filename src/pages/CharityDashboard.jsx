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
  }, [charityId]);

  // Fetch stories
  useEffect(() => {
    fetch(`/api/charities/${charityId}/stories`)
      .then((res) => res.json())
      .then((data) => setStories(data))
      .catch((err) => console.error(err));
  }, [charityId]);

   // Add a story
  const handleAddStory = () => {
    fetch(`/api/charities/${charityId}/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStory),
    })
      .then((res) => res.json())
      .then((story) => {
        setStories((prev) => [...prev, story]);
        setNewStory({ title: "", content: "" });
      })
      .catch((err) => console.error(err));
  };

    return (
    <div>
      <h1>Charity Dashboard</h1>
      <h2>Total Donations: ${totalDonations}</h2>

      <h3>Donations</h3>
      <ul>
        {donations.map((d) => (
          <li key={d.id}>
            {d.is_anonymous ? "Anonymous" : d.donor_name} - ${d.amount} - {d.frequency} - {new Date(d.created_at).toLocaleDateString()}
          </li>
        ))}
      </ul>

      <h3>Stories</h3>
      <ul>
        {stories.map((s) => (
          <li key={s.id}>
            <strong>{s.title}</strong>: {s.content}
          </li>
        ))}
      </ul>

      <h3>Add Story Here</h3>
      <input
        type="text"
        placeholder="Title"
        value={newStory.title}
        onChange={(e) =>
          setNewStory((prev) => ({ ...prev, title: e.target.value }))
        }
      />
      <textarea
        placeholder="Content"
        value={newStory.content}
        onChange={(e) =>
          setNewStory((prev) => ({ ...prev, content: e.target.value }))
        }
      />
      <button onClick={handleAddStory}>Add Story</button>
    </div>
  );
}

export default CharityDashboard;