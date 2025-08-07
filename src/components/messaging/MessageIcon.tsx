import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Bell } from "lucide-react";
import MessageModal from "./MessageModal";

interface MessageIconProps {
  className?: string;
}

const MessageIcon = ({ className = "" }: MessageIconProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    checkUnreadMessages();

    // Check for new messages periodically (in real app, this would be websockets)
    const interval = setInterval(checkUnreadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkUnreadMessages = () => {
    const currentUser = JSON.parse(
      localStorage.getItem("hire-nexus-current-user") || "{}"
    );
    if (!currentUser.id) return;

    const conversations = JSON.parse(
      localStorage.getItem("hire-nexus-conversations") || "[]"
    );
    let totalUnread = 0;

    conversations.forEach((conv: any) => {
      if (conv.participants.includes(currentUser.id)) {
        const messages = JSON.parse(
          localStorage.getItem(`hire-nexus-messages-${conv.id}`) || "[]"
        );
        const unreadMessages = messages.filter(
          (msg: any) => msg.receiverId === currentUser.id && !msg.read
        );
        totalUnread += unreadMessages.length;
      }
    });

    setUnreadCount(totalUnread);
    setHasNotification(totalUnread > 0);
  };

  const handleClick = () => {
    setIsModalOpen(true);
    setHasNotification(false); // Clear notification when opened
  };

  return (
    <>
      <div className={`fixed top-4 right-20 z-[9999] ${className}`}>
        <Button
          onClick={handleClick}
          className="relative h-10 w-10 rounded-full bg-primary hover:bg-primary/90 shadow-elegant hover-scale"
          size="sm"
        >
          <MessageCircle className="h-5 w-5 text-primary-foreground" />

          {/* Notification Badge */}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 text-xs p-0 flex items-center justify-center pulse-soft animate-scale-in"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}

          {/* Pulse Animation for New Messages */}
          {hasNotification && (
            <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
          )}
        </Button>
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default MessageIcon;
