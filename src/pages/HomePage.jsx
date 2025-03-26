import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="container mt-5">
      <h1>Welcome to My Blog App</h1>
      <p>To read Our Amazing Blogs Signup with any email ID</p>
      <Link to="/Login" className="btn btn-success">
        Go to Login
      </Link>
      <br />
      <br />
      <Link to="/signup" className="btn btn-primary">
        Go to Signup
      </Link>
    </div>
  );
}

export default HomePage;
