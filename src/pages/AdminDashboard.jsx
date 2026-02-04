import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Role: {user?.role}</p>
    </div>
  );
}

export default AdminDashboard;

