import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "donor", // default
  });

  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setGeneralError("");
    setFieldErrors({});
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError("");
    setFieldErrors({});

    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // Validation errors
      if (res.status === 422) {
        setFieldErrors(data.errors || {});
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setGeneralError(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      // success
      alert("Account created successfully. Please login.");
      navigate("/login");
    } catch (err) {
      setGeneralError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Create Account</h2>

      {generalError && <p style={{ color: "red" }}>{generalError}</p>}

      <form onSubmit={handleRegister}>
        <div>
          <label>Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {fieldErrors.username && (
            <small style={{ color: "red" }}>{fieldErrors.username}</small>
          )}
        </div>

        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {fieldErrors.email && (
            <small style={{ color: "red" }}>{fieldErrors.email}</small>
          )}
        </div>

        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {fieldErrors.password && (
            <small style={{ color: "red" }}>{fieldErrors.password}</small>
          )}
        </div>

        <div>
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="donor">Donor</option>
            <option value="charity">Charity</option>
            <option value="admin">Admin</option>
          </select>
          {fieldErrors.role && (
            <small style={{ color: "red" }}>{fieldErrors.role}</small>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      <p style={{ marginTop: 10 }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
