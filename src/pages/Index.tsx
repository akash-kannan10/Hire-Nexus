import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import SignUpModal from "@/components/auth/SignUpModal";
import LoginModal from "@/components/auth/LoginModal";
import ProfileSidebar from "@/components/ProfileSidebar";

const Index = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isProfileSidebarOpen, setIsProfileSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem("hire-nexus-current-user");
    setIsAuthenticated(!!currentUser);
  }, []);

  const handleSignUpSuccess = () => {
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        onLoginClick={() => setIsLoginModalOpen(true)}
        onSignUpClick={() => setIsSignUpModalOpen(true)}
        isAuthenticated={isAuthenticated}
        onProfileClick={() => setIsProfileSidebarOpen(true)}
      />
      
      <Home
        onLoginClick={() => setIsLoginModalOpen(true)}
        onSignUpClick={() => setIsSignUpModalOpen(true)}
      />

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        onSuccess={handleSignUpSuccess}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <ProfileSidebar
        isOpen={isProfileSidebarOpen}
        onClose={() => setIsProfileSidebarOpen(false)}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Index;
