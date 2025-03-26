// EditBlog.jsx
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditBlog() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBlog() {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/blogs/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setFormData({
          title: data.title,
          image: data.image,
          description: data.description,
        });
      } catch (error) {
        console.error("Error fetching blog:", error);
        alert("Failed to load blog data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

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
        const response = await fetch(`${baseURL}/api/blogs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to update blog");
        }
        alert("Blog updated successfully");
        navigate("/blogs");
      } catch (error) {
        console.error("Error updating blog:", error);
        alert(error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, id, navigate]
  );

  if (isLoading) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Edit Blog</h2>
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
            disabled={isSubmitting}
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Current Blog"
              style={{ width: "200px", marginTop: "10px" }}
            />
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Blog Description
          </label>
          <textarea
            name="description"
            id="description"
            className="form-control"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={isSubmitting}></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
