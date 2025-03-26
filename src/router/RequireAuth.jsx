import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  console.log("data in Req", user);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect unauthenticated users to the signup page
    console.log("I am Going to signup");
    return <Navigate to="/login" />;
  }
  return children;
}
