// ViewBlog.jsx
import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import Comments from "../component/comment";

export default function ViewBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/blogs/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (isLoading) {
    return <div className="container mt-5">Loading...</div>;
  }

  if (!blog) {
    return <div className="container mt-5">Blog not found</div>;
  }

  return (
    <>
      <div className="container mt-5">
        <h2>{blog.title}</h2>
        <img
          src={blog.image}
          alt={blog.title}
          style={{ width: "100%", maxHeight: "400px", objectFit: "contain" }}
        />
        <p className="mt-3">{blog.description}</p>
      </div>
      <hr />
      <div className="container">
        <NavLink to="/blogs" className=" fs-5 btn btn-success">
          More Blogs
        </NavLink>

        <Comments blogId={blog._id} />
      </div>
    </>
  );
}
