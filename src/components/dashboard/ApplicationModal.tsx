import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    title: string;
    postedBy: string;
  };
}

const ApplicationModal = ({ isOpen, onClose, service }: ApplicationModalProps) => {
  const [formData, setFormData] = useState({
    description: "",
    resume: null as File | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = "Please describe why you're apt for this work";
    } else if (formData.description.trim().length < 50) {
      newErrors.description = "Description should be at least 50 characters";
    }

    if (!formData.resume) {
      newErrors.resume = "Please upload your resume";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get current user
      const currentUser = JSON.parse(localStorage.getItem("hire-nexus-current-user") || "{}");
      
      // Save application to localStorage
      const applications = JSON.parse(localStorage.getItem("hire-nexus-applications") || "[]");
      const newApplication = {
        id: Date.now().toString(),
        serviceId: service.id,
        serviceTitle: service.title,
        applicantId: currentUser.id,
        applicantName: currentUser.fullName,
        description: formData.description,
        resumeName: formData.resume?.name,
        appliedAt: new Date().toISOString(),
        status: "pending"
      };
      
      applications.push(newApplication);
      localStorage.setItem("hire-nexus-applications", JSON.stringify(applications));

      toast.success("Application submitted successfully!");
      
      // Create a conversation with the service poster
      createConversationAndMessage(service, formData, currentUser);
      
      onClose();
      resetForm();
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      description: "",
      resume: null,
    });
    setErrors({});
  };

  const createConversationAndMessage = (service: any, formData: any, currentUser: any) => {
    const conversations = JSON.parse(localStorage.getItem("hire-nexus-conversations") || "[]");
    const users = JSON.parse(localStorage.getItem("hire-nexus-users") || "[]");
    const serviceOwner = users.find((user: any) => user.fullName === service.postedBy);
    
    if (!serviceOwner) return;

    // Check if conversation already exists
    let conversation = conversations.find((conv: any) => 
      conv.participants.includes(currentUser.id) && conv.participants.includes(serviceOwner.id)
    );

    if (!conversation) {
      // Create new conversation
      conversation = {
        id: `conv-${Date.now()}`,
        participants: [currentUser.id, serviceOwner.id],
        unreadCount: 0
      };
      conversations.push(conversation);
      localStorage.setItem("hire-nexus-conversations", JSON.stringify(conversations));
    }

    // Create application message
    const messages = JSON.parse(localStorage.getItem(`hire-nexus-messages-${conversation.id}`) || "[]");
    const applicationMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: serviceOwner.id,
      content: `Hi! I've applied for your project "${service.title}". Here's my application:\n\n${formData.description}${formData.resume ? `\n\nI've also attached my resume: ${formData.resume.name}` : ''}`,
      timestamp: new Date().toISOString(),
      type: 'application',
      read: false
    };

    messages.push(applicationMessage);
    localStorage.setItem(`hire-nexus-messages-${conversation.id}`, JSON.stringify(messages));

    // Update conversation with last message
    const updatedConversations = conversations.map((conv: any) => 
      conv.id === conversation.id 
        ? { ...conv, lastMessage: applicationMessage }
        : conv
    );
    localStorage.setItem("hire-nexus-conversations", JSON.stringify(updatedConversations));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['.pdf', '.doc', '.docx'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        setErrors({ resume: "Please upload a PDF, DOC, or DOCX file" });
        return;
      }
      
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ resume: "File size should be less than 5MB" });
        return;
      }
      
      setFormData(prev => ({ ...prev, resume: file }));
      setErrors(prev => ({ ...prev, resume: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Apply for: {service.title}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Posted by {service.postedBy}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="description">
              How are you apt for this work?
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
              placeholder="Describe your relevant experience, skills, and why you're the perfect fit for this project..."
              className={`min-h-[120px] mt-2 ${errors.description ? "border-destructive" : ""}`}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/500 characters (minimum 50)
            </p>
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <Label htmlFor="resume">Resume/CV</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="resume"
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-smooth hover:bg-muted/50 ${
                    errors.resume ? "border-destructive" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                    {formData.resume ? (
                      <p className="text-sm text-foreground font-medium">
                        {formData.resume.name}
                      </p>
                    ) : (
                      <>
                        <p className="mb-1 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> your resume
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOC, or DOCX (MAX. 5MB)
                        </p>
                      </>
                    )}
                  </div>
                  <Input
                    id="resume"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={isSubmitting}
                  />
                </label>
              </div>
              {errors.resume && (
                <p className="text-sm text-destructive mt-1">{errors.resume}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationModal;