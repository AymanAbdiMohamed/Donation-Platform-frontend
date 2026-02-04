import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Run once when app loads: check token and fetch user
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    try {
      const data = await getMe(); // expected { user }
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem("access_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError(null);
    setLoading(true);

    try {
      // api.js expects an object
      const data = await loginUser({ email, password }); // expected { user, access_token }

      localStorage.setItem("access_token", data.access_token);
      setUser(data.user);

      return data.user;
    } catch (err) {
      const status = err.response?.status;

      let message = err.response?.data?.error || "Login failed";
      if (status === 401) message = "Invalid credentials";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, role = "donor") => {
    setError(null);
    setLoading(true);

    try {
      // api.js expects an object
      const data = await registerUser({ email, password, role }); // expected { user, access_token }

      localStorage.setItem("access_token", data.access_token);
      setUser(data.user);

      return data.user;
    } catch (err) {
      const status = err.response?.status;

      let message = err.response?.data?.error || "Registration failed";
      if (status === 422) message = "Validation error";

      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export default AuthContext;
