import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SignupPage from "../pages/SignupPage";
import Dashboard from "../pages/Dashboard";
import LoginPage from "../pages/LoginPage";

import AddBlog from "../pages/addBlog";
import BlogList from "../pages/BlogList";
import EditBlog from "../pages/EditBlog";
import ViewBlog from "../pages/ViewBlog";

import RequireAuth from "./RequireAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
  },
  {
    path: "/blogs",
    element: (
      <RequireAuth>
        <BlogList />
      </RequireAuth>
    ),
  },
  {
    path: "/blogs/add",
    element: (
      <RequireAuth>
        <AddBlog />
      </RequireAuth>
    ),
  },
  {
    path: "/blogs/edit/:id",
    element: (
      <RequireAuth>
        <EditBlog />
      </RequireAuth>
    ),
  },
  {
    path: "/blogs/:id",
    element: (
      <RequireAuth>
        <ViewBlog />
      </RequireAuth>
    ),
  },
]);

export default router;
