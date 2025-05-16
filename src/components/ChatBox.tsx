import { useState, FormEvent, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/types";
import { formatTime } from "@/lib/date-utils";
import { useAuth } from "@/contexts/AuthContext";

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLive: boolean;
}

const ChatBox = ({ messages, onSendMessage, isLive }: ChatBoxProps) => {
  const [message, setMessage] = useState("");
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && isLive) {
      onSendMessage(message);
      setMessage("");
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="p-2 border-b bg-accent">
        <h3 className="font-medium text-sm">Room Chat</h3>
      </div>
      
      <ScrollArea className="flex-1 p-2" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-2">
            <p className="text-muted-foreground text-xs">
              {isLive 
                ? "No messages yet. Start the conversation!" 
                : "This room has no messages."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`px-3 py-2 rounded-lg max-w-[90%] transition-all duration-300 hover:shadow-sm ${
                    msg.userId === user?.id 
                      ? 'bg-primary text-primary-foreground rounded-br-none' 
                      : 'bg-muted rounded-bl-none border-l-4 border-l-secondary'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <div className="flex items-center mt-1 gap-1 px-1">
                  <span className={`text-xs font-medium ${msg.userId === user?.id ? 'text-primary' : 'text-secondary'}`}>
                    {msg.username}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>
      
      <form onSubmit={handleSubmit} className="p-2 border-t bg-muted/30">
        <div className="flex gap-1">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isLive ? "Type a message..." : "Room is not active"}
            disabled={!isLive}
            className="flex-1 text-sm h-8 transition-all focus:shadow-sm"
          />
          <Button 
            type="submit" 
            disabled={!isLive || !message.trim()}
            size="sm"
            className="h-8 transition-all hover:shadow-sm"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
