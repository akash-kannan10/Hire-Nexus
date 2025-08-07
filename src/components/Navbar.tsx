import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Search } from "lucide-react";
import MessageIcon from "@/components/messaging/MessageIcon";
import logo from "../assets/hire-nexus_favicon.png";

interface NavbarProps {
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  isAuthenticated?: boolean;
  onProfileClick?: () => void;
}

const Navbar = ({
  onLoginClick,
  onSignUpClick,
  isAuthenticated,
  onProfileClick,
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={logo} alt="Hire-Nexus Logo" />
            </div>
            <span className="text-2xl font-bold text-foreground text-primary">
              Hire-Nexus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-smooth ${
                isActive("/")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-smooth ${
                  isActive("/dashboard")
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onProfileClick}
                  className="p-2"
                >
                  <User className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={onLoginClick}>
                  Login
                </Button>
                <Button size="sm" onClick={onSignUpClick}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Message Icon - Only show when authenticated */}
          {isAuthenticated && <MessageIcon />}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                  isActive("/")
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`block px-3 py-2 text-sm font-medium rounded-md transition-smooth ${
                    isActive("/dashboard")
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <div className="pt-2 space-y-2">
                {isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onProfileClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full justify-start"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onLoginClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Login
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        onSignUpClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
