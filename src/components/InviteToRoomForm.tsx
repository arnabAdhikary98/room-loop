
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Send, Mail, Phone } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
  const { toast } = useToast();

  const handleAddInvite = () => {
    if (!inviteValue.trim()) {
      return;
    }

    // Validate email format
    if (inviteType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(inviteValue)) {
        toast({
          title: "Invalid email format",
          description: "Please enter a valid email address",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate phone format (simple validation)
    if (inviteType === "phone") {
      const phoneRegex = /^[0-9\+\-\(\)\s]{10,15}$/;
      if (!phoneRegex.test(inviteValue)) {
        toast({
          title: "Invalid phone format",
          description: "Please enter a valid phone number",
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

    try {
      // In a real app, this would be an API call
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Invites sent!",
        description: `Successfully sent ${pendingInvites.length} invitation${pendingInvites.length > 1 ? 's' : ''}`,
      });

      setPendingInvites([]);
      onInviteSuccess();
    } catch (error) {
      toast({
        title: "Failed to send invites",
        description: "Please try again later",
        variant: "destructive",
      });
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
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? "Sending..." : `Send ${pendingInvites.length} Invite${pendingInvites.length > 1 ? 's' : ''}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default InviteToRoomForm;
