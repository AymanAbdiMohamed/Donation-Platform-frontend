import { useAuth } from "../context/AuthContext";

function DonorDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Donor Dashboard</h1>
      <p>Role: {user?.role}</p>
    </div>
  );
}

export default DonorDashboard;