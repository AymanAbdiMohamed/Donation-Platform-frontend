import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getPendingApplications,
  approveApplication,
  rejectApplication,
} from "../api"; // adjust path if needed

function AdminDashboard() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPending = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPendingApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load pending applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveApplication(id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to approve application.");
    }
  };

  const handleReject = async (id) => {
    try {
      const reason = prompt("Enter rejection reason (optional):") || "";
      await rejectApplication(id, reason);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to reject application.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Role: {user?.role}</p>

      <h2>Pending Charity Applications</h2>

      {loading && <p>Loading applications...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && applications.length === 0 && (
        <p>No pending applications.</p>
      )}

      {applications.map((app) => (
        <div
          key={app.id}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "12px",
          }}
        >
          <h3>{app.name || app.charity_name || "Charity Application"}</h3>

          <p>
            <strong>Email:</strong> {app.email || "N/A"}
          </p>

          <p>
            <strong>Description:</strong>{" "}
            {app.description || app.mission || "No description provided"}
          </p>

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => handleApprove(app.id)}>Approve</button>
            <button onClick={() => handleReject(app.id)}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
