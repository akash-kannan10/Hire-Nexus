import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const LoginModal = ({ isOpen, onClose, onSuccess }: LoginModalProps) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials against localStorage
      const users = JSON.parse(
        localStorage.getItem("hire-nexus-users") || "[]"
      );
      const user = users.find(
        (u: any) =>
          u.email === formData.email && u.password === formData.password
      );

      if (user) {
        localStorage.setItem("hire-nexus-current-user", JSON.stringify(user));
        toast.success("Login successful!");
        onSuccess();
        onClose();
        resetForm();
      } else {
        setErrors({ general: "Invalid email or password" });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ email: "", password: "" });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Welcome Back
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{errors.general}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className={errors.email ? "border-destructive" : ""}
                style={{ marginTop: "10px" }}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                className={errors.password ? "border-destructive" : ""}
                style={{ marginTop: "10px" }}
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password}
                </p>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  // This would trigger the signup modal
                }}
                className="text-primary hover:underline"
              >
                Sign up here
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
