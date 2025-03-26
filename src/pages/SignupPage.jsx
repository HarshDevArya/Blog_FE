import { useState, useCallback, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function SignupPage() {
  const { setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    profileImage: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Generic field change handler
  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  // File/image change handler
  const handleImageChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Ensure the file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }

    // Optionally limit size (example: 2MB max)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size exceeds 2MB. Please choose a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevData) => ({
        ...prevData,
        profileImage: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }, []);

  // Submit the form data
  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        // If you have your server URL in .env, use that:
        // e.g., REACT_APP_API_URL=http://localhost:5000
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Signup failed");
        }

        setUser(data);

        // Redirect to the Dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("Error during signup:", error);
        alert(error.message || "Error during signup");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate, setUser]
  );

  return (
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            name="email"
            id="email"
            type="email"
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
            name="password"
            id="password"
            type="password"
            className="form-control"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="profileImage" className="form-label">
            Profile Image
          </label>
          <input
            type="file"
            id="profileImage"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
        </div>

        <p>
          Already have account <Link to="/login">Login</Link>
        </p>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
