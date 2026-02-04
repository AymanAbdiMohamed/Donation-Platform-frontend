import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  // We grab the 'register' function from our AuthContext.
  // This function handles the communication with the backend to create a new user.
  const { register, loading, error, clearError } = useAuth();

  // Local state for each input field.
  // Unlike Login.jsx where we used one object, here we use separate state variables.
  // Both approaches are valid in React!
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // We default the role to "donor" so the dropdown starts with a valid selection.
  const [role, setRole] = useState("donor");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop page reload
    clearError(); // Reset error message

    try {
      // Call the register function with user details
      const user = await register(email, password, role);

      // Helper object to map roles to their respective dashboard URLs
      const dashboards = {
        donor: "/donor/dashboard",
        charity: "/charity/dashboard",
        admin: "/admin/dashboard",
      };

      // Navigate to the correct dashboard based on the new user's role
      navigate(dashboards[user.role] || "/donor/dashboard");
    } catch (err) {
      // Error handled in AuthContext (e.g., setting the 'error' state which we display below)
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "50px auto", padding: 20 }}>
      <h2>Register</h2>

      {/* Display error message if registration fails */}
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
            onChange={(e) => setEmail(e.target.value)} // Update email state
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            style={{ width: "100%", padding: 10 }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Update password state
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Role</label>
          {/* Dropdown menu for selecting user role */}
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
          disabled={loading} // Prevent multiple clicks
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
