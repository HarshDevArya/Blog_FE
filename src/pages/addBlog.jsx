// AddBlog.jsx
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AddBlog() {
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size exceeds 2MB. Please choose a smaller file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/blogs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to create blog");
        }
        alert("Blog created successfully");
        navigate("/blogs");
      } catch (error) {
        console.error("Error creating blog:", error);
        alert(error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, navigate]
  );

  return (
    <div className="container mt-5">
      <h2>Add Blog</h2>
      <form onSubmit={handleSubmit} className="w-50">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Blog Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Blog Image
          </label>
          <input
            type="file"
            name="image"
            id="image"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Blog Content
          </label>
          <textarea
            name="description"
            id="description"
            className="form-control"
            rows="10"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={isSubmitting}></textarea>
        </div>
        <div className="d-flex justify-content-between">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Blog"}
          </button>

          <Link to="/dashboard" className="btn btn-warning">
            Dashboard
          </Link>
        </div>
      </form>
    </div>
  );
}
