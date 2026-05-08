import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/features/auth/LoginPage";
import RegisterPage from "@/features/auth/RegisterPage";
import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./features/user/page/Dashboard";
import Home from "./features/guest/Home";

const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [{ path: "/dashboard", element: <Dashboard /> }],
  },
  { path: "*", element: <LoginPage /> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
