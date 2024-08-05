import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthProvider";
import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "../pages/Login";
import UserPage from "../components/dashboard/UserPage";
import CustomersDashboard from "../components/dashboard/CustomersDashboard";
import DeviceDashboard from "../components/dashboard/DeviceDashboard";
import DevicePage from "../components/dashboard/DevicePage";
import AdminDashboard from "../pages/AdminDashboard";
import UserDashboard from "../pages/UserDashboard";
import DevicePageForUsers from "../components/dashboard/DevicePageForUser";
import Page404 from "../pages/Page404";
import { WebSocketProvider } from "../context/websocket/WebSocketProvider";
import ChatRoom from "../pages/ChatRoom";

const Routes = () => {
  const { token, role, uuid } = useAuth();
  // Define public routes accessible to all users
  const routesForPublic = [
    {
      path: "/service",
      element: <div>Service Page</div>,
    },
    {
      path: "/about-us",
      element: <div>About Us</div>,
    },
  ];


  // Define routes accessible only to authenticated users
  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />, // Wrap the component in ProtectedRoute
      children: role.toLocaleLowerCase() === "admin" ? [
        {
          path:"/",
          element: token ? <Navigate to="/dashboard" /> : <LoginPage />
        },
        {
          path: "/dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "/logout",
          element: <div>Logout</div>,
        },
        {
          path: "/dashboard/users/:uuid",
          element: <UserPage />
        }, 
        {
          path: "/dashboard/users/",
          element: <CustomersDashboard />
        },
        {
          path: "/dashboard/devices/",
          element: <DeviceDashboard />
        },
        {
          path: "/dashboard/devices/:uuid",
          element: <DevicePage />
        },
        {
          path: "chat-room",
          element: <ChatRoom />
        }
      ] : [
          {
            path:"/",
            element: token ? <Navigate to="/dashboard" /> : <LoginPage />
          },
          {
            path: "/dashboard",
            element: role.toLocaleLowerCase() === "user" ? <WebSocketProvider url = {"ws://localhost:8083/"}><UserDashboard /></WebSocketProvider> : <LoginPage />,
          },
          {
            path: "/logout",
            element: <div>Logout</div>,
          },
          {
            path: "/dashboard/devices/:uuid",
            element: role.toLocaleLowerCase() === "user" && uuid && <WebSocketProvider url = {"ws://localhost:8083/"}><DevicePageForUsers /></WebSocketProvider>
          }
      ],
    },
  ];

  // Define routes accessible only to non-authenticated users
  const routesForNotAuthenticatedOnly = [
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ];

  const notFoundRoute = {
    path: "*",
    element: <Page404 />,
  };

  // Combine and conditionally include routes based on authentication status
  const router = createBrowserRouter([
    ...routesForPublic,
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
    notFoundRoute
  ]);

  // Provide the router configuration using RouterProvider
  return <RouterProvider router={router} />;
};

export default Routes;