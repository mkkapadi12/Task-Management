import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Guest pages
import HomePage from "@/features/guest/pages/HomePage";

// Auth pages
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";

// User pages
import UserDashboard from "@/features/user/pages/UserDashboard";
import ProfilePage from "@/features/user/pages/ProfilePage";

// guards
import GuestRoute from "@/components/routes/GuestRoute";
import ProtectedRoute from "@/components/routes/ProtectedRoute";

//Layouts
import AppLayout from "@/components/layouts/AppLayout";


const router = createBrowserRouter([
  // ── Guest routes (redirect to /dashboard if already logged in)
  {
    element: <GuestRoute />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  // ── Protected routes (redirect to /login if not logged in)
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />, // sidebar + topbar wrapper
        children: [
          { path: "/dashboard", element: <UserDashboard /> },
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
