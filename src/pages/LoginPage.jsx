import { useState, useCallback, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Handle input changes
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitting(true);
      setError(null);
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // send cookies along with the request
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }

        // If login is successful, set the user context and redirect to the dashboard
        setUser(data);
        navigate("/dashboard");
      } catch (err) {
        console.error("Login error:", err);
        setError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate, setUser]
  );

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="w-50">
        {error && <div className="alert alert-danger">{error}</div>}
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="form-control"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="form-control"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>
        <p>
          Don't have account Create it <NavLink to="/signup">Signup</NavLink>
        </p>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
