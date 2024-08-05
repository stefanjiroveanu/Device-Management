import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthProvider";
import Navbar from "../components/navbar/Navbar";
import { NavbarProvider } from "../context/navbar/NavbarProvider";

export const ProtectedRoute = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <NavbarProvider><Navbar /><Outlet /></NavbarProvider>
    </div>
  );
};
