import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { X, Upload } from "lucide-react";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const services = [
  "Web Development & Programming",
  "Mobile App Development",
  "UI/UX Design",
  "Graphic Design & Creative Services",
  "Content Writing & Copywriting",
  "Digital Marketing & SEO",
  "Video Production & Animation",
  "Data Analysis & Research",
  "Business Consulting & Strategy",
  "Social Media Management",
  "Translation & Language Services",
  "Virtual Assistant Services",
  "Accounting & Finance",
  "Legal Services & Consulting",
  "Photography & Photo Editing",
  "E-commerce Solutions",
  "Project Management",
  "Customer Service & Support",
  "Sales & Lead Generation",
  "Training & Education",
  "Game Development",
  "Blockchain Development",
  "AI & Machine Learning",
  "DevOps & Cloud Services",
  "Quality Assurance & Testing",
  "Technical Writing",
  "Voice Over & Audio",
  "3D Modeling & CAD",
  "Architecture & Interior Design",
  "Human Resources",
  "Event Planning",
  "Real Estate Services",
];

const SignUpModal = ({ isOpen, onClose, onSuccess }: SignUpModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    selectedServices: [] as string[],
    customService: "",
    description: "",
    experience: "",
    projectFiles: null as FileList | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [emailExists, setEmailExists] = useState(false);
  const [emailCheckTimeout, setEmailCheckTimeout] =
    useState<NodeJS.Timeout | null>(null);

  // Enhanced email validation with localStorage check
  const checkEmailExists = (email: string) => {
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }

    const timeout = setTimeout(() => {
      const existingUsers = JSON.parse(
        localStorage.getItem("hire-nexus-users") || "[]"
      );
      const emailFound = existingUsers.find(
        (user: any) => user.email.toLowerCase() === email.toLowerCase()
      );
      setEmailExists(!!emailFound);

      if (emailFound) {
        setErrors((prev) => ({
          ...prev,
          email:
            "Account exists with this email. Please login or use a different email address.",
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (newErrors.email?.includes("Account exists")) {
            delete newErrors.email;
          }
          return newErrors;
        });
      }
    }, 300);

    setEmailCheckTimeout(timeout);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    } else if (emailExists) {
      newErrors.email =
        "Account exists with this email. Please login or use a different email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.userType) newErrors.userType = "Please select user type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (
      formData.selectedServices.length === 0 &&
      !formData.customService.trim()
    ) {
      newErrors.services =
        "Please select at least one service or add a custom service";
    }
    if (
      formData.customService.trim() &&
      (formData.customService.length < 2 || formData.customService.length > 50)
    ) {
      newErrors.customService =
        "Custom service must be between 2-50 characters";
    }
    if (formData.userType === "provider" && !formData.description.trim()) {
      newErrors.description = "Description is required for service providers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    // Final check for email existence
    const existingUsers = JSON.parse(
      localStorage.getItem("hire-nexus-users") || "[]"
    );
    if (
      existingUsers.find(
        (user: any) => user.email.toLowerCase() === formData.email.toLowerCase()
      )
    ) {
      setErrors({
        email:
          "Account exists with this email. Please login or use a different email address.",
      });
      setStep(1);
      return;
    }

    // Prepare final services list
    const finalServices = [...formData.selectedServices];
    if (formData.customService.trim()) {
      finalServices.push(formData.customService.trim());
    }

    // Save to localStorage
    const userData = {
      id: Date.now().toString(),
      ...formData,
      selectedServices: finalServices,
      createdAt: new Date().toISOString(),
    };

    existingUsers.push(userData);
    localStorage.setItem("hire-nexus-users", JSON.stringify(existingUsers));
    localStorage.setItem("hire-nexus-current-user", JSON.stringify(userData));

    toast.success("Account created successfully!");
    onSuccess();
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "",
      selectedServices: [],
      customService: "",
      description: "",
      experience: "",
      projectFiles: null,
    });
    setStep(1);
    setErrors({});
    setEmailExists(false);
    if (emailCheckTimeout) {
      clearTimeout(emailCheckTimeout);
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(service)
        ? prev.selectedServices.filter((s) => s !== service)
        : [...prev.selectedServices, service],
    }));
  };

  const handleAddCustomService = () => {
    const trimmed = formData.customService.trim();

    if (
      trimmed.length >= 2 &&
      trimmed.length <= 50 &&
      !formData.selectedServices.includes(trimmed)
    ) {
      setFormData((prev) => ({
        ...prev,
        selectedServices: [...prev.selectedServices, trimmed],
        customService: "",
      }));
      let p = document.getElementById("pp");
      p.innerHTML = formData.customService;
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] sm:max-h-[800px] max-h-[90vh] animate-slide-up">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Join Hire-Nexus
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Connect with opportunities • Step {step} of 2
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className={errors.fullName ? "border-destructive" : ""}
                    style={{ marginTop: "8px" }}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      const newEmail = e.target.value;
                      setFormData((prev) => ({ ...prev, email: newEmail }));
                      if (newEmail.includes("@") && newEmail.includes(".")) {
                        checkEmailExists(newEmail);
                      }
                    }}
                    className={errors.email ? "border-destructive" : ""}
                    style={{ marginTop: "8px" }}
                  />
                  {errors.email && (
                    <div className="text-sm text-destructive mt-1">
                      <p>{errors.email}</p>
                      {emailExists && (
                        <div className="mt-2 space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onClose();
                              // Could trigger login modal here
                            }}
                          >
                            Login Instead
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className={errors.password ? "border-destructive" : ""}
                    style={{ marginTop: "8px" }}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className={
                      errors.confirmPassword ? "border-destructive" : ""
                    }
                    style={{ marginTop: "8px" }}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Are you a?</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, userType: value }))
                    }
                  >
                    <SelectTrigger
                      className={errors.userType ? "border-destructive" : ""}
                      style={{ marginTop: "8px" }}
                    >
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seeker">Service Seeker</SelectItem>
                      <SelectItem value="provider">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.userType && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.userType}
                    </p>
                  )}
                </div>
              </div>
              <br />
              <Button
                type="button"
                onClick={handleNext}
                className="w-full hover-scale bg-primary hover:bg-primary/90"
              >
                Next Step →
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-2">
                <div>
                  <Label>
                    {formData.userType === "provider"
                      ? "Services You Provide"
                      : "Services You're Looking For"}
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.selectedServices.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="default"
                        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        {skill}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-3 mt-2">
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-border rounded-lg p-3 bg-muted/20">
                      {services.map((service) => (
                        <div
                          key={service}
                          className="flex items-center space-x-2 hover:bg-accent/50 rounded p-1 transition-colors"
                        >
                          <Checkbox
                            id={service}
                            checked={formData.selectedServices.includes(
                              service
                            )}
                            onCheckedChange={() => handleServiceToggle(service)}
                          />
                          <Label
                            htmlFor={service}
                            className="text-sm leading-tight cursor-pointer"
                          >
                            {service}
                          </Label>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="customService"
                        className="text-sm font-medium"
                      >
                        Or add your custom service:
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="customService"
                          value={formData.customService}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              customService: e.target.value,
                            }))
                          }
                          placeholder="Add custom service..."
                          maxLength={50}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={handleAddCustomService}
                          disabled={
                            !formData.customService.trim() ||
                            formData.customService.trim().length < 2 ||
                            formData.customService.trim().length > 50
                          }
                          size="sm"
                          variant="secondary"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      {formData.customService && (
                        <p className="text-xs text-muted-foreground">
                          {formData.customService.length}/50 characters
                        </p>
                      )}
                      {errors.customService && (
                        <p className="text-sm text-destructive">
                          {errors.customService}
                        </p>
                      )}
                    </div>

                    {/*  */}
                  </div>
                  {errors.services && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.services}
                    </p>
                  )}
                </div>

                {formData.userType === "provider" && (
                  <>
                    <div>
                      <Label htmlFor="description">
                        Brief Description About Yourself
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        style={{ marginTop: "10px" }}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Tell us about your skills and experience..."
                        className={
                          errors.description ? "border-destructive" : ""
                        }
                      />
                      {errors.description && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <div className="mt-2">
                        <Select
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              experience: value,
                            }))
                          }
                        >
                          <SelectTrigger>
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

                    <div>
                      <Label htmlFor="projects">Previous Works/Projects</Label>
                      <div className="mt-1">
                        <Input
                          id="projects"
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              projectFiles: e.target.files,
                            }))
                          }
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Upload images, PDFs, or documents showcasing your work
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 hover-scale"
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 hover-scale bg-primary hover:bg-primary/90"
                >
                  ✨ Create Account
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;
