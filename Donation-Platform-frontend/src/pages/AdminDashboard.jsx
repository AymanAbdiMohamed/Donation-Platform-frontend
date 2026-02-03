import { useEffect, useState } from "react";

function AdminDashboard() {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    fetch("/api/charities")
      .then((res) => res.json())
      .then((data) => setCharities(data))
      .catch((err) => console.error(err));
  }, []);
  
    const handleApprove = (id) => {
    fetch(`/api/charities/${id}/approve`, {
      method: "PATCH",
    }).then(() => {
      setCharities((prev) =>
        prev.map((charity) =>
          charity.id === id
            ? { ...charity, status: "approved" }
            : charity
        )
      );
    });
  };

  const handleReject = (id) => {
    fetch(`/api/charities/${id}/reject`, {
      method: "PATCH",
    }).then(() => {
      setCharities((prev) =>
        prev.map((charity) =>
          charity.id === id
            ? { ...charity, status: "rejected" }
            : charity
        )
      );
    });
  };

  const handleDelete = (id) => {
    fetch(`/api/charities/${id}`, {
      method: "DELETE",
    }).then(() => {
      setCharities((prev) =>
        prev.filter((charity) => charity.id !== id)
      );
    });
  };
  
    const pendingCharities = charities.filter(
    (charity) => charity.status === "pending"
  );

  const approvedCharities = charities.filter(
    (charity) => charity.status === "approved"
  );

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Pending Charity Applications</h2>
      {pendingCharities.map((charity) => (
        <div key={charity.id}>
          <h3>{charity.name}</h3>
          <p>{charity.description}</p>

          <button onClick={() => handleApprove(charity.id)}>
            Approve
          </button>
          <button onClick={() => handleReject(charity.id)}>
            Reject
          </button>
        </div>
      ))}

      <h2>Approved Charities</h2>
      {approvedCharities.map((charity) => (
        <div key={charity.id}>
          <h3>{charity.name}</h3>
          <p>{charity.description}</p>

          <button onClick={() => handleDelete(charity.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;