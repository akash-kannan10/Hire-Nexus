import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  User,
  Edit3,
  Save,
  X,
  LogOut,
  Briefcase,
  Calendar,
  ExternalLink,
} from "lucide-react";

interface ProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const services = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Graphic Design",
  "Content Writing",
  "Digital Marketing",
  "SEO Services",
  "Data Analysis",
  "Video Editing",
  "Photography",
  "Virtual Assistant",
  "Consulting",
  "Translation",
  "Accounting",
  "Legal Services",
  "Project Management",
];

const ProfileSidebar = ({ isOpen, onClose, onLogout }: ProfileSidebarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    userType: "",
    selectedServices: [] as string[],
    description: "",
    experience: "",
    previousProjects: "" as string,
  });

  useEffect(() => {
    if (isOpen) {
      // Load user data from localStorage
      const currentUser = JSON.parse(
        localStorage.getItem("hire-nexus-current-user") || "{}"
      );
      setUserData({
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        userType: currentUser.userType || "",
        selectedServices: currentUser.selectedServices || [],
        description: currentUser.description || "",
        experience: currentUser.experience || "",
        previousProjects: currentUser.previousProjects || "",
      });
    }
  }, [isOpen]);

  const handleSave = () => {
    try {
      // Get current user and update
      const currentUser = JSON.parse(
        localStorage.getItem("hire-nexus-current-user") || "{}"
      );
      const updatedUser = { ...currentUser, ...userData };

      // Update current user
      localStorage.setItem(
        "hire-nexus-current-user",
        JSON.stringify(updatedUser)
      );

      // Update in users array
      const users = JSON.parse(
        localStorage.getItem("hire-nexus-users") || "[]"
      );
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem("hire-nexus-users", JSON.stringify(users));
      }

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleServiceToggle = (service: string) => {
    setUserData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service],
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem("hire-nexus-current-user");
    onLogout();
    onClose();
    toast.success("Logged out successfully");
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              My Profile
            </SheetTitle>
            <div className="flex items-center gap-2 mt-4">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-3">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">
                {userData.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">{userData.fullName}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {userData.userType.replace("_", " ")}
              </p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={userData.fullName}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, fullName: e.target.value }))
                }
                disabled={!isEditing}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, email: e.target.value }))
                }
                disabled={!isEditing}
                className="mt-1"
              />
            </div>

            <div>
              <Label>User Type</Label>
              <Select
                value={userData.userType}
                onValueChange={(value) =>
                  setUserData((prev) => ({ ...prev, userType: value }))
                }
                disabled={!isEditing}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seeker">Service Seeker</SelectItem>
                  <SelectItem value="provider">Service Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>
                {userData.userType === "provider"
                  ? "Services You Provide"
                  : "Services You're Looking For"}
              </Label>
              <div className="grid grid-cols-1 gap-2 mt-2 max-h-40 overflow-y-auto border border-border rounded-md p-3">
                {services.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={`profile-${service}`}
                      checked={userData.selectedServices.includes(service)}
                      onCheckedChange={() =>
                        isEditing && handleServiceToggle(service)
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor={`profile-${service}`} className="text-sm">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {userData.userType === "provider" && (
              <>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={userData.description}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className="mt-1"
                    placeholder="Tell us about your skills and experience..."
                  />
                </div>

                <div>
                  <Label>Years of Experience</Label>
                  <div>
                    <Select
                      value={userData.experience}
                      onValueChange={(value) =>
                        setUserData((prev) => ({ ...prev, experience: value }))
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="1-3">1-3 years</SelectItem>
                        <SelectItem value="3-5">3-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Portfolio Section */}
                {userData.previousProjects && (
                  <Card className="animate-fade-in">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Briefcase className="h-4 w-4" />
                        Portfolio & Previous Work
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">
                              Project Experience
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {userData.previousProjects}
                            </p>
                            {userData.experience && (
                              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                <span className="text-xs font-medium text-primary">
                                  Experience: {userData.experience}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>

          {/* Logout Button */}
          <div className="pt-6 border-t border-border">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSidebar;
