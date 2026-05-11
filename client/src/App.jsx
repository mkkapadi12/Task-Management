import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Guest pages
import Home from "@/features/guest/pages/Home";
import About from "@/features/guest/pages/About";
import Contact from "@/features/guest/pages/Contact";

// Auth pages
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";

// User pages
import UserDashboard from "@/features/user/pages/UserDashboard";
import ProfilePage from "@/features/user/pages/ProfilePage";

// Post pages
import PostsPage from "@/features/post/pages/PostsPage";
import PostDetailPage from "@/features/post/pages/PostDetailPage";

// Guards
import GuestRoute from "@/components/routes/GuestRoute";
import ProtectedRoute from "@/components/routes/ProtectedRoute";

// Layouts
import AppLayout from "@/components/layouts/AppLayout";
import GuestLayout from "@/components/layouts/GuestLayout";

const router = createBrowserRouter([
  // ── Guest routes (redirect to /dashboard if already logged in)
  {
    element: <GuestRoute />,
    children: [
      {
        element: <GuestLayout />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/about", element: <About /> },
          { path: "/contact", element: <Contact /> },
        ],
      },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  // ── Protected routes (redirect to /login if not logged in)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/dashboard", element: <UserDashboard /> },
          { path: "/posts", element: <PostsPage /> },
          { path: "/posts/:id", element: <PostDetailPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },

  // ── Fallback
  { path: "*", element: <LoginPage /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
