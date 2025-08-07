import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Search,
  Paperclip,
  Image,
  FileText,
  X,
  Circle,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  type: "text" | "file" | "application" | "hiring";
  fileUrl?: string;
  fileName?: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

const MessageModal = ({ isOpen, onClose }: MessageModalProps) => {
  const [activeConversation, setActiveConversation] = useState<string | null>(
    null
  );
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadUserData();
      loadConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation);
    }
  }, [activeConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadUserData = () => {
    const user = JSON.parse(
      localStorage.getItem("hire-nexus-current-user") || "{}"
    );
    const allUsers = JSON.parse(
      localStorage.getItem("hire-nexus-users") || "[]"
    );
    setCurrentUser(user);
    setUsers(allUsers);
  };

  const loadConversations = () => {
    const storedConversations = JSON.parse(
      localStorage.getItem("hire-nexus-conversations") || "[]"
    );
    setConversations(storedConversations);
  };

  const loadMessages = (conversationId: string) => {
    const storedMessages = JSON.parse(
      localStorage.getItem(`hire-nexus-messages-${conversationId}`) || "[]"
    );
    setMessages(storedMessages);

    // Mark messages as read
    const updatedMessages = storedMessages.map((msg: Message) => ({
      ...msg,
      read: msg.receiverId === currentUser.id ? true : msg.read,
    }));
    localStorage.setItem(
      `hire-nexus-messages-${conversationId}`,
      JSON.stringify(updatedMessages)
    );
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: getOtherParticipant(activeConversation),
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      type: "text",
      read: false,
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(
      `hire-nexus-messages-${activeConversation}`,
      JSON.stringify(updatedMessages)
    );

    // Update conversation
    updateConversationLastMessage(activeConversation, message);

    setNewMessage("");
    toast.success("Message sent!");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !activeConversation) return;

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    // In a real app, you would upload to a server
    // For now, we'll simulate with a fake URL
    const fakeUrl = `fake-upload-${Date.now()}-${file.name}`;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: getOtherParticipant(activeConversation),
      content: `Shared a file: ${file.name}`,
      timestamp: new Date().toISOString(),
      type: "file",
      fileUrl: fakeUrl,
      fileName: file.name,
      read: false,
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(
      `hire-nexus-messages-${activeConversation}`,
      JSON.stringify(updatedMessages)
    );
    updateConversationLastMessage(activeConversation, message);

    toast.success("File shared!");
  };

  const getOtherParticipant = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return "";
    return conversation.participants.find((p) => p !== currentUser.id) || "";
  };

  const getOtherParticipantData = (conversationId: string) => {
    const otherUserId = getOtherParticipant(conversationId);

    // First try to find in registered users
    let userData = users.find((u) => u.id === otherUserId);

    // If not found, try to find by email in case userId is email
    if (!userData && otherUserId?.includes("@")) {
      userData = users.find((u) => u.email === otherUserId);
    }

    // Enhanced fallback with better name resolution
    if (!userData && otherUserId) {
      const email = otherUserId.includes("@") ? otherUserId : "";
      const emailPrefix = email.split("@")[0];

      // Better name formatting from email
      const formattedName = emailPrefix
        .split(/[._-]/)
        .map(
          (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
        )
        .join(" ");

      return {
        id: otherUserId,
        fullName: formattedName || "Unknown User",
        email: email,
        userType: "provider",
        isGuest: true,
      };
    }

    return (
      userData || {
        id: otherUserId,
        fullName: "Unknown User",
        email: "",
        userType: "provider",
        isGuest: true,
      }
    );
  };

  const updateConversationLastMessage = (
    conversationId: string,
    message: Message
  ) => {
    const updatedConversations = conversations.map((conv) =>
      conv.id === conversationId ? { ...conv, lastMessage: message } : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem(
      "hire-nexus-conversations",
      JSON.stringify(updatedConversations)
    );
  };

  const startNewConversation = (withUserId: string) => {
    const existingConv = conversations.find(
      (conv) =>
        conv.participants.includes(withUserId) &&
        conv.participants.includes(currentUser.id)
    );

    if (existingConv) {
      setActiveConversation(existingConv.id);
      return;
    }

    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      participants: [currentUser.id, withUserId],
      unreadCount: 0,
    };

    const updatedConversations = [...conversations, newConversation];
    setConversations(updatedConversations);
    localStorage.setItem(
      "hire-nexus-conversations",
      JSON.stringify(updatedConversations)
    );
    setActiveConversation(newConversation.id);
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    const otherUser = getOtherParticipantData(conv.id);
    return otherUser?.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[95vw] lg:max-w-[90vw] max-h-[95vh] p-0 animate-slide-up">
        <DialogHeader className="px-6 py-4 border-b bg-gradient-subtle">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            💬 Messages
            <Badge variant="secondary" className="text-xs">
              {conversations.length} conversation
              {conversations.length !== 1 ? "s" : ""}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[70vh] lg:h-[600px]">
          {/* Conversations Sidebar */}
          <div className="w-full md:w-80 lg:w-1/3 border-r flex flex-col bg-muted/20">
            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Conversation List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {filteredConversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="space-y-2">
                      <p>No conversations yet</p>
                      <p className="text-sm">
                        Start messaging with other users!
                      </p>
                    </div>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => {
                    const otherUser = getOtherParticipantData(conversation.id);
                    const isActive = activeConversation === conversation.id;

                    return (
                      <div
                        key={conversation.id}
                        onClick={() => setActiveConversation(conversation.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          isActive
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                                {otherUser?.fullName
                                  ?.split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase() || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <Circle className="absolute -bottom-1 -right-1 h-3 w-3 text-green-500 fill-current" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center gap-1">
                                  <p className="font-medium text-sm truncate">
                                    {otherUser?.fullName || "Unknown User"}
                                  </p>
                                  {otherUser?.isGuest && (
                                    <Circle className="h-2 w-2 text-orange-500 fill-current" />
                                  )}
                                </div>
                                {otherUser?.userType && (
                                  <Badge
                                    variant="outline"
                                    className={`text-xs px-1 py-0 ${
                                      otherUser.userType === "provider"
                                        ? "border-blue-200 text-blue-700 bg-blue-50"
                                        : "border-green-200 text-green-700 bg-green-50"
                                    }`}
                                  >
                                    {otherUser.userType === "provider"
                                      ? "👨‍💻 Provider"
                                      : "🏢 Seeker"}
                                  </Badge>
                                )}
                              </div>
                              {conversation.unreadCount > 0 && (
                                <Badge
                                  variant="destructive"
                                  className="h-5 w-5 text-xs p-0 flex items-center justify-center animate-pulse"
                                >
                                  {conversation.unreadCount > 99
                                    ? "99+"
                                    : conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <p className="text-xs text-muted-foreground truncate">
                                {conversation.lastMessage?.type ===
                                "application"
                                  ? "📄 Application submitted"
                                  : conversation.lastMessage?.type === "hiring"
                                  ? "💼 Hiring request sent"
                                  : conversation.lastMessage?.content ||
                                    "No messages yet"}
                              </p>
                              {(conversation.lastMessage?.type ===
                                "application" ||
                                conversation.lastMessage?.type ===
                                  "hiring") && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs px-1 py-0 ${
                                    conversation.lastMessage.type ===
                                    "application"
                                      ? "bg-blue-100 text-blue-700"
                                      : "bg-green-100 text-green-700"
                                  }`}
                                >
                                  {conversation.lastMessage.type ===
                                  "application"
                                    ? "Applied"
                                    : "Hired"}
                                </Badge>
                              )}
                            </div>
                            {conversation.lastMessage && (
                              <p className="text-xs text-muted-foreground">
                                {format(
                                  new Date(conversation.lastMessage.timestamp),
                                  "MMM dd, HH:mm"
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                        {getOtherParticipantData(activeConversation)
                          ?.fullName?.split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {getOtherParticipantData(activeConversation)
                          ?.fullName || "Unknown User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getOtherParticipantData(activeConversation)
                          ?.userType === "provider"
                          ? "Service Provider"
                          : "Service Seeker"}
                      </p>
                    </div>
                  </div>
                  
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-6 py-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.senderId === currentUser.id;
                      const sender = users.find(
                        (u) => u.id === message.senderId
                      );

                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isOwn ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[75%] ${
                              isOwn ? "order-2" : "order-1"
                            }`}
                          >
                            {!isOwn && (
                              <p className="text-xs text-muted-foreground mb-1 ml-2">
                                {sender?.fullName || "Unknown User"}
                              </p>
                            )}
                            <div
                              className={`px-4 py-3 rounded-lg ${
                                message.type === "application"
                                  ? "bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800"
                                  : message.type === "hiring"
                                  ? "bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800"
                                  : isOwn
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              }`}
                            >
                              {message.type === "application" && (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                      Application Submitted
                                    </span>
                                  </div>
                                  <div className="text-sm bg-white/50 dark:bg-gray-800/50 rounded p-2">
                                    {message.content}
                                  </div>
                                </div>
                              )}
                              {message.type === "hiring" && (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Circle className="h-4 w-4 text-green-600 fill-current" />
                                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                                      Hiring Request
                                    </span>
                                  </div>
                                  <div className="text-sm bg-white/50 dark:bg-gray-800/50 rounded p-2">
                                    {message.content}
                                  </div>
                                </div>
                              )}
                              {message.type === "file" && (
                                <div className="flex items-center space-x-2">
                                  <FileText className="h-4 w-4" />
                                  <span className="text-sm">
                                    {message.fileName}
                                  </span>
                                </div>
                              )}
                              {message.type === "text" && (
                                <p className="text-sm whitespace-pre-wrap">
                                  {message.content}
                                </p>
                              )}
                            </div>
                            <p
                              className={`text-xs text-muted-foreground mt-1 ${
                                isOwn ? "text-right mr-2" : "ml-2"
                              }`}
                            >
                              {format(new Date(message.timestamp), "HH:mm")}
                              {message.type === "application" && (
                                <span className="ml-1">• Applied</span>
                              )}
                              {message.type === "hiring" && (
                                <span className="ml-1">• Hiring Request</span>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="px-6 py-4 border-t">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1 space-y-2">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="resize-none min-h-[60px]"
                        rows={2}
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        size="sm"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <Send className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
