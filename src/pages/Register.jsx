import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("donor");

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    try {
      const user = await register(email, password, role);

      const dashboards = {
        donor: "/donor/dashboard",
        charity: "/charity/dashboard",
        admin: "/admin/dashboard",
      };

      navigate(dashboards[user.role] || "/donor/dashboard");
    } catch (err) {
      // Error handled in AuthContext
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "50px auto", padding: 20 }}>
      <h2>Register</h2>

      {error && (
        <div style={{ background: "#ffe0e0", padding: 10, marginBottom: 10 }}>
          <p style={{ margin: 0, color: "red" }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input
            style={{ width: "100%", padding: 10 }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            style={{ width: "100%", padding: 10 }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Role</label>
          <select
            style={{ width: "100%", padding: 10 }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="donor">Donor</option>
            <option value="charity">Charity</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: 10 }}
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: 12 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
