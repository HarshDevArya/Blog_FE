// BlogList.jsx
import { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/blogs`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const handleView = (id) => {
    navigate(`/blogs/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/blogs/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/blogs/${id}`, {
          method: "DELETE",
          credentials: "include",
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to delete blog");
        }
        alert("Blog deleted successfully");
        setBlogs(blogs.filter((blog) => blog._id !== id));
      } catch (error) {
        console.error("Error deleting blog:", error);
        alert(error.message);
      }
    }
  };

  if (isLoading) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex  mb-2   justify-content-between">
        <h2>Blog List</h2>
        <NavLink className=" fs-5 btn btn-success" to="/dashboard">
          Desboard
        </NavLink>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Image</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>{blog.title}</td>
              <td>
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </td>
              <td>{blog.description.substring(0, 100)}...</td>
              <td>
                <button
                  className="btn btn-primary me-2"
                  onClick={() => handleView(blog._id)}>
                  View
                </button>
                {user && blog.author === user._id && (
                  <>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleEdit(blog._id)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(blog._id)}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
