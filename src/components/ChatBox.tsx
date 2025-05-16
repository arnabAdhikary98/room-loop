
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
    <div className="flex flex-col h-full border rounded-md overflow-hidden bg-white">
      <div className="p-3 border-b bg-muted/20">
        <h3 className="font-medium">Room Chat</h3>
      </div>
      
      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center p-4">
            <p className="text-muted-foreground text-sm">
              {isLive 
                ? "No messages yet. Start the conversation!" 
                : "This room has no messages."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.userId === user?.id ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`px-3 py-2 rounded-lg max-w-[85%] ${
                    msg.userId === user?.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
                <div className="flex items-center mt-1 gap-2">
                  <span className="text-xs text-muted-foreground">
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
      
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isLive ? "Type a message..." : "Room is not active"}
            disabled={!isLive}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={!isLive || !message.trim()}>
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
