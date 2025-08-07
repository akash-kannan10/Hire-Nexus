import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Dashboard from "@/pages/Dashboard";
import ProfileSidebar from "@/components/ProfileSidebar";

const DashboardPage = () => {
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("hire-nexus-current-user");
    if (!currentUser) {
      navigate("/");
      return;
    }
    setIsAuthenticated(true);
  }, [navigate]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/");
  };

  if (!isAuthenticated) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        isAuthenticated={isAuthenticated}
        onProfileClick={() => setIsProfileSidebarOpen(true)}
      />
      
      <Dashboard />

      <ProfileSidebar
        isOpen={isProfileSidebarOpen}
        onClose={() => setIsProfileSidebarOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default DashboardPage;