import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  // useNavigate is a React Router hook that allows us to programmatically
  // redirect the user to different pages (e.g., dashboard after login).
  const navigate = useNavigate();
  
  // useAuth is our custom hook that gives us access to global authentication state
  // and functions, like 'login' (function to log in), 'error' (if any login error occurred),
  // and 'loading' (boolean to disable buttons while request is processing).
  const { login, error, loading, clearError } = useAuth();

  // useState is a React hook that lets us add state to our functional component.
  // Here we store the email and password entered by the user.
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // This function handles changes in the input fields.
  // When a user types, this updates our 'formData' state instantly.
  const handleChange = (e) => {
    // Clear any previous errors when the user starts typing again
    clearError();
    setFormData({
      ...formData,
      // [e.target.name] dynamically updates the property matching the input's 'name' attribute
      [e.target.name]: e.target.value,
    });
  };

  // This function is called when the form is submitted (user clicks 'Login').
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default browser form reload behavior
    clearError(); // Clear old errors

    try {
      // Attempt to log in the user with the provided email and password.
      // We use 'await' because login is an asynchronous operation (network request).
      const user = await login(formData.email, formData.password);

      // Define where to redirect the user based on their role
      const dashboards = {
        donor: "/donor/dashboard",
        charity: "/charity/dashboard",
        admin: "/admin/dashboard",
      };

      // Redirect to the appropriate dashboard, or default to donor dashboard
      navigate(dashboards[user.role] || "/donor/dashboard");
    } catch (err) {
      // Errors (like wrong password) are caught here.
      // However, we handle the error state in AuthContext, so we might just leave this empty
      // or log to console for debugging.
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px" }}>
      <h1>Login</h1>

      {/* Conditional rendering: If there is an error, display this error message block */}
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email} // Controlled component: value comes from state
            onChange={handleChange} // Update state on every keystroke
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading} // Disable button while logging in to prevent double clicks
          style={{ width: "100%", padding: "10px", cursor: "pointer" }}
        >
          {/* Show "Logging in..." text if we are currently waiting for the server */}
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        Don&apos;t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
