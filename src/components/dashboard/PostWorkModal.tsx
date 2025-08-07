import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  FileText,
  X,
  Plus,
} from "lucide-react";

interface PostWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const skillCategories = [
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
];

const budgetRanges = [
  "$500 - $1,000",
  "$1,000 - $2,500",
  "$2,500 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000+",
];

const durationOptions = [
  "1-2 weeks",
  "2-4 weeks",
  "1-2 months",
  "2-3 months",
  "3-6 months",
  "6+ months",
];

const experienceLevels = ["Beginner", "Intermediate", "Expert"];

const urgencyLevels = ["Low", "Medium", "High"];

const locationTypes = ["Remote", "On-site", "Hybrid"];

const PostWorkModal = ({ isOpen, onClose }: PostWorkModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    customCategory: "",
    description: "",
    requiredSkills: [] as string[],
    customSkill: "",
    budget: "",
    customBudget: "",
    duration: "",
    customDuration: "",
    location: "",
    experienceLevel: "",
    urgency: "",
    startDate: "",
    deadline: "",
    specialRequirements: "",
    contactPreference: "platform",
  });

  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      const user = JSON.parse(
        localStorage.getItem("hire-nexus-current-user") || "{}"
      );
      setCurrentUser(user);
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }));
  };

  const handleAddCustomSkill = () => {
    if (
      formData.customSkill.trim() &&
      !formData.requiredSkills.includes(formData.customSkill.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, prev.customSkill.trim()],
        customSkill: "",
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
    }));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.title || !formData.category || !formData.description) {
        toast.error("Please fill in all required fields");
        return;
      }
    } else if (currentStep === 2) {
      if (
        !formData.budget ||
        !formData.duration ||
        !formData.location ||
        !formData.experienceLevel
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (!formData.urgency) {
      toast.error("Please select urgency level");
      return;
    }

    try {
      // Create new work posting
      const newWork = {
        id: `work-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category:
          formData.category === "other"
            ? formData.customCategory
            : formData.category,
        requiredSkills: formData.requiredSkills,
        budget:
          formData.budget === "custom"
            ? formData.customBudget
            : formData.budget,
        duration:
          formData.duration === "custom"
            ? formData.customDuration
            : formData.duration,
        location: formData.location,
        experienceLevel: formData.experienceLevel,
        urgency: formData.urgency,
        startDate: formData.startDate,
        deadline: formData.deadline,
        specialRequirements: formData.specialRequirements,
        contactPreference: formData.contactPreference,
        postedBy: currentUser.fullName || "Anonymous",
        postedByEmail: currentUser.email,
        postedOn: new Date().toISOString(),
        applicationsReceived: 0,
        status: "Active",
        field:
          formData.category === "other"
            ? formData.customCategory
            : formData.category,
        urgent: formData.urgency === "High",
      };

      // Save to user's posted works
      const userPostedWorks = JSON.parse(
        localStorage.getItem(`hire-nexus-posted-works-${currentUser.id}`) ||
          "[]"
      );
      userPostedWorks.unshift(newWork);
      localStorage.setItem(
        `hire-nexus-posted-works-${currentUser.id}`,
        JSON.stringify(userPostedWorks)
      );

      // Add to global projects data for service providers to see
      const existingProjects = JSON.parse(
        localStorage.getItem("hire-nexus-all-projects") || "[]"
      );
      existingProjects.unshift(newWork);
      localStorage.setItem(
        "hire-nexus-all-projects",
        JSON.stringify(existingProjects)
      );

      toast.success("Work posted successfully!");
      onClose();

      // Reset form
      setFormData({
        title: "",
        category: "",
        customCategory: "",
        description: "",
        requiredSkills: [],
        customSkill: "",
        budget: "",
        customBudget: "",
        duration: "",
        customDuration: "",
        location: "",
        experienceLevel: "",
        urgency: "",
        startDate: "",
        deadline: "",
        specialRequirements: "",
        contactPreference: "platform",
      });
      setCurrentStep(1);
    } catch (error) {
      toast.error("Failed to post work");
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">Work Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          placeholder="e.g., Build a modern e-commerce website"
          maxLength={100}
          className="mt-2"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData.title.length}/100 characters
        </p>
      </div>

      <div>
        <Label htmlFor="category">Work Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleInputChange("category", value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {skillCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
            <SelectItem value="other">Other (Custom)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.category === "other" && (
        <div>
          <Label htmlFor="customCategory">Custom Category *</Label>
          <Input
            id="customCategory"
            value={formData.customCategory}
            onChange={(e) =>
              handleInputChange("customCategory", e.target.value)
            }
            placeholder="Enter your custom category"
            maxLength={50}
            className="mt-2"
          />
        </div>
      )}

      <div>
        <Label htmlFor="description">Work Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Provide a detailed description of the work you need done..."
          className="mt-2 min-h-[120px]"
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground mt-1">
          {formData.description.length}/1000 characters
        </p>
      </div>

      <div>
        <Label>Required Skills</Label>
        <div className="mt-2 space-y-3">
          {formData.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {formData.requiredSkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="default"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  onClick={() => removeSkill(skill)}
                >
                  {skill}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border border-border rounded p-2">
            {skillCategories.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={`skill-${skill}`}
                  checked={formData.requiredSkills.includes(skill)}
                  onCheckedChange={() => handleSkillToggle(skill)}
                />
                <Label
                  htmlFor={`skill-${skill}`}
                  className="text-xs cursor-pointer"
                >
                  {skill}
                </Label>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              value={formData.customSkill}
              onChange={(e) => handleInputChange("customSkill", e.target.value)}
              placeholder="Add custom skill..."
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddCustomSkill}
              disabled={!formData.customSkill.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Budget Range *</Label>
          <Select
            value={formData.budget}
            onValueChange={(value) => handleInputChange("budget", value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select budget" />
            </SelectTrigger>
            <SelectContent>
              {budgetRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Project Duration *</Label>
          <Select
            value={formData.duration}
            onValueChange={(value) => handleInputChange("duration", value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {durationOptions.map((duration) => (
                <SelectItem key={duration} value={duration}>
                  {duration}
                </SelectItem>
              ))}
              <SelectItem value="custom">Custom Duration</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formData.budget === "custom" && (
        <div>
          <Label htmlFor="customBudget">Custom Budget *</Label>
          <Input
            id="customBudget"
            value={formData.customBudget}
            onChange={(e) => handleInputChange("customBudget", e.target.value)}
            placeholder="e.g., $3,500"
            className="mt-2"
          />
        </div>
      )}

      {formData.duration === "custom" && (
        <div>
          <Label htmlFor="customDuration">Custom Duration *</Label>
          <Input
            id="customDuration"
            value={formData.customDuration}
            onChange={(e) =>
              handleInputChange("customDuration", e.target.value)
            }
            placeholder="e.g., 5 weeks"
            className="mt-2"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Work Location *</Label>
          <Select
            value={formData.location}
            onValueChange={(value) => handleInputChange("location", value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select location type" />
            </SelectTrigger>
            <SelectContent>
              {locationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Experience Level Required *</Label>
          <Select
            value={formData.experienceLevel}
            onValueChange={(value) =>
              handleInputChange("experienceLevel", value)
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <Label>Urgency Level *</Label>
        <Select
          value={formData.urgency}
          onValueChange={(value) => handleInputChange("urgency", value)}
        >
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select urgency" />
          </SelectTrigger>
          <SelectContent>
            {urgencyLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Preferred Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange("startDate", e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="deadline">Application Deadline</Label>
          <Input
            id="deadline"
            type="date"
            value={formData.deadline}
            onChange={(e) => handleInputChange("deadline", e.target.value)}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="specialRequirements">Special Requirements</Label>
        <Textarea
          id="specialRequirements"
          value={formData.specialRequirements}
          onChange={(e) =>
            handleInputChange("specialRequirements", e.target.value)
          }
          placeholder="Any special requirements, tools, or preferences..."
          className="mt-2"
          rows={3}
        />
      </div>

      <div>
        <Label>Contact Preference</Label>
        <Select
          value={formData.contactPreference}
          onValueChange={(value) =>
            handleInputChange("contactPreference", value)
          }
        >
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="platform">Platform Messaging</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Post New Work Opportunity
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Enhanced Progress Indicator */}
          <div className="flex items-center justify-between animate-fade-in">
            <div className="flex items-center space-x-3">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                      step <= currentStep
                        ? "bg-primary text-primary-foreground shadow-lg scale-110"
                        : "bg-muted text-muted-foreground"
                    } ${step === currentStep ? "ring-2 ring-primary/30" : ""}`}
                  >
                    {step <= currentStep ? "✓" : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-12 h-0.5 mx-2 transition-colors duration-200 ${
                        step < currentStep ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-primary">
                Step {currentStep} of 3
              </p>
              <p className="text-xs text-muted-foreground">
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Project Details"}
                {currentStep === 3 && "Final Details"}
              </p>
            </div>
          </div>

          {/* Enhanced Step Content */}
          <Card className="card-interactive animate-scale-in">
            <CardHeader className="pb-4 bg-gradient-subtle rounded-t-lg">
              <CardTitle className="text-lg flex items-center gap-2">
                {currentStep === 1 && (
                  <>
                    📝 Basic Information
                    <span className="text-sm font-normal text-muted-foreground">
                      Tell us about your project
                    </span>
                  </>
                )}
                {currentStep === 2 && (
                  <>
                    💰 Project Details
                    <span className="text-sm font-normal text-muted-foreground">
                      Budget and timeline
                    </span>
                  </>
                )}
                {currentStep === 3 && (
                  <>
                    ⚙️ Final Details
                    <span className="text-sm font-normal text-muted-foreground">
                      Additional requirements
                    </span>
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="spacing-md">
              <div className="animate-fade-in">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Navigation Buttons */}
          <div className="flex justify-between items-center animate-fade-in">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="hover-scale"
            >
              ← Previous
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                {currentStep === 1 && "Next: Project budget & timeline"}
                {currentStep === 2 && "Next: Additional details"}
                {currentStep === 3 && "Ready to post your work!"}
              </p>
            </div>

            {currentStep < 3 ? (
              <Button onClick={nextStep} className="button-primary hover-scale">
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="button-primary hover-scale"
              >
                🚀 Post Work
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostWorkModal;
