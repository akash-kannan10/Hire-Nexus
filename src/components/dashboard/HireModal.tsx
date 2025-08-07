import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import { Send } from "lucide-react";

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancer: {
    id: string;
    fullName: string;
    title: string;
  };
}

const HireModal = ({ isOpen, onClose, freelancer }: HireModalProps) => {
  const [formData, setFormData] = useState({
    projectTitle: "",
    description: "",
    budget: "",
    timeline: "",
    urgency: "medium",
    requirements: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectTitle.trim())
      newErrors.projectTitle = "Project title is required";
    if (!formData.description.trim())
      newErrors.description = "Project description is required";
    if (!formData.budget.trim()) newErrors.budget = "Budget range is required";
    if (!formData.timeline.trim()) newErrors.timeline = "Timeline is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Create hiring message and conversation
    const currentUser = JSON.parse(
      localStorage.getItem("hire-nexus-current-user") || "{}"
    );
    const conversationId = `conv-${Date.now()}`;

    // Create conversation
    const conversations = JSON.parse(
      localStorage.getItem("hire-nexus-conversations") || "[]"
    );
    const newConversation = {
      id: conversationId,
      participants: [currentUser.id, freelancer.id],
      unreadCount: 0,
    };
    conversations.push(newConversation);
    localStorage.setItem(
      "hire-nexus-conversations",
      JSON.stringify(conversations)
    );

    // Create hiring message
    const message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: freelancer.id,
      content: `Hiring Request: ${formData.projectTitle}\n\nDescription: ${
        formData.description
      }\n\nBudget: ${formData.budget}\nTimeline: ${
        formData.timeline
      }\nUrgency: ${formData.urgency}${
        formData.requirements
          ? `\n\nSpecial Requirements: ${formData.requirements}`
          : ""
      }`,
      timestamp: new Date().toISOString(),
      type: "hiring",
      read: false,
    };

    const messages = [message];
    localStorage.setItem(
      `hire-nexus-messages-${conversationId}`,
      JSON.stringify(messages)
    );

    toast.success(`Hiring request sent to ${freelancer.fullName}!`);
    onClose();
    resetForm();
  };

  const createConversationAndMessage = (
    freelancer: any,
    formData: any,
    currentUser: any
  ) => {
    const conversations = JSON.parse(
      localStorage.getItem("hire-nexus-conversations") || "[]"
    );

    // Check if conversation already exists
    let conversation = conversations.find(
      (conv: any) =>
        conv.participants.includes(currentUser.id) &&
        conv.participants.includes(freelancer.id)
    );

    if (!conversation) {
      // Create new conversation
      conversation = {
        id: `conv-${Date.now()}`,
        participants: [currentUser.id, freelancer.id],
        unreadCount: 0,
      };
      conversations.push(conversation);
      localStorage.setItem(
        "hire-nexus-conversations",
        JSON.stringify(conversations)
      );
    }

    // Create hiring message
    const messages = JSON.parse(
      localStorage.getItem(`hire-nexus-messages-${conversation.id}`) || "[]"
    );
    const hiringMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: freelancer.id,
      content: `Hi ${freelancer.fullName}! I'd like to hire you for a project.\n\nProject: ${formData.projectTitle}\n\nDescription: ${formData.description}\n\nBudget: ${formData.budget}\nTimeline: ${formData.timeline}\n\nLet's discuss the details!`,
      timestamp: new Date().toISOString(),
      type: "hiring",
      read: false,
    };

    messages.push(hiringMessage);
    localStorage.setItem(
      `hire-nexus-messages-${conversation.id}`,
      JSON.stringify(messages)
    );

    // Update conversation with last message
    const updatedConversations = conversations.map((conv: any) =>
      conv.id === conversation.id
        ? { ...conv, lastMessage: hiringMessage }
        : conv
    );
    localStorage.setItem(
      "hire-nexus-conversations",
      JSON.stringify(updatedConversations)
    );
  };

  const resetForm = () => {
    setFormData({
      projectTitle: "",
      description: "",
      budget: "",
      timeline: "",
      urgency: "medium",
      requirements: "",
    });
    setErrors({});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Hire {freelancer.fullName}
          </DialogTitle>
          <p className="text-muted-foreground">{freelancer.title}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="projectTitle">Project Title *</Label>
            <Input
              id="projectTitle"
              value={formData.projectTitle}
              style={{ marginTop: "7px" }}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  projectTitle: e.target.value,
                }))
              }
              placeholder="Brief title for your project"
              className={errors.projectTitle ? "border-destructive" : ""}
            />
            {errors.projectTitle && (
              <p className="text-sm text-destructive mt-1">
                {errors.projectTitle}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Project Description *</Label>
            <Textarea
              id="description"
              style={{ marginTop: "7px" }}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Detailed description of your project requirements..."
              className={errors.description ? "border-destructive" : ""}
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget Range *</Label>
              <div className="mt-2">
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, budget: value }))
                  }
                >
                  <SelectTrigger
                    className={errors.budget ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-500">Under $500</SelectItem>
                    <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                    <SelectItem value="1000-2500">$1,000 - $2,500</SelectItem>
                    <SelectItem value="2500-5000">$2,500 - $5,000</SelectItem>
                    <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                    <SelectItem value="over-10000">Over $10,000</SelectItem>
                  </SelectContent>
                </Select>
                {errors.budget && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.budget}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="timeline">Timeline *</Label>
              <div className="mt-2">
                <Select
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, timeline: value }))
                  }
                >
                  <SelectTrigger
                    className={errors.timeline ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="1-week">Within 1 week</SelectItem>
                    <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                    <SelectItem value="1-month">Within 1 month</SelectItem>
                    <SelectItem value="2-months">Within 2 months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
                {errors.timeline && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.timeline}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="urgency">Priority Level</Label>
            <div className="mt-2">
              <Select
                value={formData.urgency}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, urgency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="requirements">Special Requirements</Label>
            <Textarea
              className="mt-2"
              id="requirements"
              value={formData.requirements}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  requirements: e.target.value,
                }))
              }
              placeholder="Any specific requirements or preferences..."
              rows={3}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Hiring Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HireModal;
