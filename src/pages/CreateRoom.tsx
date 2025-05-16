
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom } from "@/contexts/RoomContext";
import { RoomTag, RoomType } from "@/types";
import UserInviteInput from "@/components/UserInviteInput";

const CreateRoom = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState<RoomType>("private");
  const [startTimeString, setStartTimeString] = useState("");
  const [endTimeString, setEndTimeString] = useState("");
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>(undefined);
  const [hasMaxParticipants, setHasMaxParticipants] = useState(false);
  const [tag, setTag] = useState<RoomTag>("Hangout");
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();
  const { createRoom, loading } = useRoom();

  // Default start time to now, end time to 1 hour from now
  const initializeTimes = () => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    
    const formatDateTimeLocal = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    
    setStartTimeString(formatDateTimeLocal(now));
    setEndTimeString(formatDateTimeLocal(oneHourLater));
  };
  
  // Initialize times on component mount
  useState(() => {
    initializeTimes();
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!startTimeString || !endTimeString) {
      setError("Start and end times are required");
      return;
    }

    const startTime = new Date(startTimeString);
    const endTime = new Date(endTimeString);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      setError("Invalid date format");
      return;
    }
    
    if (startTime >= endTime) {
      setError("End time must be after start time");
      return;
    }
    
    try {
      await createRoom({
        title,
        description,
        roomType,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        maxParticipants: hasMaxParticipants ? maxParticipants : undefined,
        tag,
        invitedUsers: roomType === "private" ? invitedUsers : [],
      });
      
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to create room:", err);
      setError(err instanceof Error ? err.message : "Failed to create room");
    }
  };

  const handleInviteUser = (username: string) => {
    if (!invitedUsers.includes(username)) {
      setInvitedUsers([...invitedUsers, username]);
    }
  };

  const handleRemoveInvite = (username: string) => {
    setInvitedUsers(invitedUsers.filter((u) => u !== username));
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create a New Room</h1>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Room Details</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Room Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g., Friday Night Doodles, Bug Bash, Catch-Up Session"
                />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this room about?"
                  rows={3}
                />
              </div>
              
              {/* Room Type */}
              <div className="space-y-2">
                <Label>Room Type</Label>
                <RadioGroup value={roomType} onValueChange={(value) => setRoomType(value as RoomType)} className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="cursor-pointer">Private (invite only)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="cursor-pointer">Public (anyone can join)</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {/* Invite Users (for private rooms) */}
              {roomType === "private" && (
                <div className="space-y-2">
                  <Label>Invite Users</Label>
                  <UserInviteInput
                    invitedUsers={invitedUsers}
                    onInviteUser={handleInviteUser}
                    onRemoveInvite={handleRemoveInvite}
                  />
                </div>
              )}
              
              {/* Time Window */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={startTimeString}
                    onChange={(e) => setStartTimeString(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={endTimeString}
                    onChange={(e) => setEndTimeString(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Max Participants */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maxParticipants"
                    checked={hasMaxParticipants}
                    onCheckedChange={setHasMaxParticipants}
                  />
                  <Label htmlFor="maxParticipants" className="cursor-pointer">
                    Limit maximum participants
                  </Label>
                </div>
                
                {hasMaxParticipants && (
                  <div className="space-y-2">
                    <Label htmlFor="participantsCount">Maximum number of participants</Label>
                    <Input
                      id="participantsCount"
                      type="number"
                      min={2}
                      max={100}
                      value={maxParticipants || ""}
                      onChange={(e) => setMaxParticipants(parseInt(e.target.value) || undefined)}
                    />
                  </div>
                )}
              </div>
              
              {/* Room Tag */}
              <div className="space-y-2">
                <Label htmlFor="tag">Room Tag</Label>
                <Select value={tag} onValueChange={(value) => setTag(value as RoomTag)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hangout">Hangout</SelectItem>
                    <SelectItem value="Work">Work</SelectItem>
                    <SelectItem value="Brainstorm">Brainstorm</SelectItem>
                    <SelectItem value="Wellness">Wellness</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {error && <p className="text-sm text-destructive">{error}</p>}
            </CardContent>
            
            <CardFooter className="justify-between">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Room"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateRoom;
