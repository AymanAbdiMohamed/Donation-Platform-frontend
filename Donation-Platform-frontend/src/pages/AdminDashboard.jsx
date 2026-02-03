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
  };}