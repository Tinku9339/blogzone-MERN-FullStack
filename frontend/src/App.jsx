import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useTheme } from "./context/ThemeContext.jsx";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Home from "./pages/Home.jsx";
import Archive from "./pages/Archive.jsx";
import BlogDetail from "./pages/BlogDetail.jsx";
import AuthorProfile from "./pages/AuthorProfile.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ManageBlogs from "./pages/ManageBlogs.jsx";
import BlogEditor from "./pages/BlogEditor.jsx";
import ManageComments from "./pages/ManageComments.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: isLight ? "#fffdf8" : "#1b1f29",
            color: isLight ? "#28231d" : "#f1ead9",
            border: isLight
              ? "1px solid rgba(82,67,47,0.18)"
              : "1px solid rgba(217,205,174,0.15)",
            fontSize: "13px",
          },
          success: {
            iconTheme: {
              primary: "#7C9A78",
              secondary: isLight ? "#fffdf8" : "#1b1f29",
            },
          },
          error: {
            iconTheme: {
              primary: "#C1543A",
              secondary: isLight ? "#fffdf8" : "#1b1f29",
            },
          },
        }}
      />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/author/:id" element={<AuthorProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/blogs" element={<ManageBlogs />} />
          <Route path="/dashboard/blogs/new" element={<BlogEditor />} />
          <Route path="/dashboard/blogs/:id/edit" element={<BlogEditor />} />
          <Route path="/dashboard/comments" element={<ManageComments />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
