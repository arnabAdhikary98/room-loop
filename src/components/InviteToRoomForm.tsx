import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Send, Mail, Phone, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRoom } from "@/contexts/RoomContext";

interface InviteToRoomFormProps {
  roomId: string;
  onInviteSuccess: () => void;
}

type InviteType = "email" | "phone";

const InviteToRoomForm = ({ roomId, onInviteSuccess }: InviteToRoomFormProps) => {
  const [inviteType, setInviteType] = useState<InviteType>("email");
  const [inviteValue, setInviteValue] = useState("");
  const [pendingInvites, setPendingInvites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteProgress, setInviteProgress] = useState(0);
  const { toast } = useToast();
  const { inviteToRoom } = useRoom();

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Allow formats like: +1234567890, (123) 456-7890, 123-456-7890
    const regex = /^[0-9\+\-\(\)\s]{10,15}$/;
    return regex.test(phone);
  };

  const handleAddInvite = () => {
    if (!inviteValue.trim()) {
      return;
    }

    // Validate email format
    if (inviteType === "email") {
      if (!validateEmail(inviteValue)) {
        toast({
          title: "Invalid email format",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate phone format
    if (inviteType === "phone") {
      if (!validatePhone(inviteValue)) {
        toast({
          title: "Invalid phone format",
          description: "Please enter a valid phone number (10-15 digits)",
          variant: "destructive",
        });
        return;
      }
    }

    // Check if already in pending invites
    if (pendingInvites.includes(inviteValue)) {
      toast({
        description: "This contact is already in your invite list",
      });
      return;
    }

    setPendingInvites([...pendingInvites, inviteValue]);
    setInviteValue("");
  };

  const handleRemoveInvite = (invite: string) => {
    setPendingInvites(pendingInvites.filter(item => item !== invite));
  };

  const handleSendInvites = async () => {
    if (pendingInvites.length === 0) {
      toast({
        description: "Please add at least one contact to invite",
      });
      return;
    }

    setIsLoading(true);
    setInviteProgress(0);

    try {
      // Show a progress toast
      const progressToastId = Date.now().toString();
      toast({
        id: progressToastId,
        title: "Sending invitations...",
        description: "Please wait while we send your invitations.",
      });

      // Simulate progress updates during invitation sending
      const progressInterval = setInterval(() => {
        setInviteProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 20); // Random increment
          return newProgress > 90 ? 90 : newProgress; // Cap at 90% until complete
        });
      }, 300);

      // Use the inviteToRoom function from RoomContext
      await inviteToRoom(roomId, pendingInvites);
      
      // Clear progress interval
      clearInterval(progressInterval);
      setInviteProgress(100);
      
      // Clear pending invites after successful invitation
      setPendingInvites([]);
      onInviteSuccess();
    } catch (error) {
      // Error is already handled in inviteToRoom function
      console.error("Failed to send invites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <RadioGroup 
          value={inviteType}
          onValueChange={(value) => setInviteType(value as InviteType)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="email" id="email" />
            <Label htmlFor="email" className="cursor-pointer flex items-center gap-1">
              <Mail className="h-4 w-4" /> Email
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="phone" id="phone" />
            <Label htmlFor="phone" className="cursor-pointer flex items-center gap-1">
              <Phone className="h-4 w-4" /> Phone
            </Label>
          </div>
        </RadioGroup>

        <div className="flex gap-2">
          <Input
            value={inviteValue}
            onChange={(e) => setInviteValue(e.target.value)}
            placeholder={inviteType === "email" ? "Enter email address" : "Enter phone number"}
            type={inviteType === "email" ? "email" : "tel"}
            className="flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleAddInvite()}
          />
          <Button type="button" onClick={handleAddInvite} variant="outline">Add</Button>
        </div>

        {inviteType === "email" && (
          <p className="text-xs text-muted-foreground">
            Example: user@example.com
          </p>
        )}

        {inviteType === "phone" && (
          <p className="text-xs text-muted-foreground">
            Example: +1234567890 or (123) 456-7890
          </p>
        )}
      </div>

      {pendingInvites.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {pendingInvites.map((invite) => (
              <Badge key={invite} variant="secondary" className="flex items-center gap-1">
                {invite}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-destructive"
                  onClick={() => handleRemoveInvite(invite)}
                />
              </Badge>
            ))}
          </div>

          <Button 
            onClick={handleSendInvites} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending... {inviteProgress}%
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send {pendingInvites.length} Invite{pendingInvites.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default InviteToRoomForm;
