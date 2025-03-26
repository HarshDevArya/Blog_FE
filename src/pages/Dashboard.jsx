// Dashboard.jsx
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("I am ing Desboard", user);

  const handleLogout = async () => {
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseURL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        // Clear user state and localStorage
        setUser(null);
        // localStorage.removeItem("user");
        // Redirect to signup page
        navigate("/signup");
      } else {
        alert("Logout failed, please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Dashboard</h1>
      {user && (
        <div className="d-flex align-items-center float-end">
          <img
            src={user.profileImage}
            alt="Profile"
            className="rounded-circle"
            style={{ width: "50px", height: "50px" }}
          />
          <p className="ms-2 mb-0">{user.email}</p>
        </div>
      )}
      <p>Welcome to your dashboard!</p>
      <button className="btn btn-danger" onClick={handleLogout}>
        Logout
      </button>
      <hr />
      <NavLink to="/blogs/add" className="btn btn-success">
        Add Blog
      </NavLink>
      <br />
      <br />
      <NavLink to="/blogs" className="btn btn-primary">
        View Blogs
      </NavLink>
      {/* Add any additional dashboard content here */}
    </div>
  );
}
