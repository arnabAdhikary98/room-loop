
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom } from "@/contexts/RoomContext";
import { getTimeWindow, isRoomLive } from "@/lib/date-utils";
import ChatBox from "@/components/ChatBox";
import InviteToRoomForm from "@/components/InviteToRoomForm";
import { Smile, UserPlus, Users } from "lucide-react";

const EMOJI_OPTIONS = ["👍", "❤️", "😊", "🎉", "👏", "⚡️", "💡", "✨"];

const RoomDetail = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRoomById, sendMessage, sendReaction, leaveRoom, refreshRooms } = useRoom();
  
  const room = getRoomById(roomId || "");
  const isLive = room ? isRoomLive(room.startTime, room.endTime) : false;
  
  useEffect(() => {
    // Refresh room status
    refreshRooms();
    
    // Set up interval to refresh room status
    const intervalId = setInterval(() => {
      refreshRooms();
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [refreshRooms]);
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  if (!room) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
        <p className="mb-8">This room doesn't exist or you don't have access to it.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }
  
  const isRoomCreator = room.createdBy === user?.id;
  const isParticipant = room.participants.includes(user?.id);
  
  // Users can only access the room if they are the creator or an invited user
  const canAccess = isRoomCreator || 
    (room.roomType === "public") || 
    (room.invitedUsers.includes(user?.id));
  
  if (!canAccess) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-8">You don't have access to this room.</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }
  
  const handleSendMessage = (content: string) => {
    if (roomId) {
      sendMessage(roomId, content);
    }
  };
  
  const handleSendReaction = (emoji: string) => {
    if (roomId) {
      sendReaction(roomId, emoji);
      setShowEmojiPicker(false);
    }
  };
  
  const handleLeaveRoom = async () => {
    if (roomId) {
      await leaveRoom(roomId);
      navigate("/dashboard");
    }
  };

  const handleInviteSuccess = () => {
    setShowInviteForm(false);
    refreshRooms();
  };
  
  return (
    <div className="container py-8 px-4">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          ← Back
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{room.title}</h1>
            <p className="text-muted-foreground">{getTimeWindow(room.startTime, room.endTime)}</p>
          </div>
          
          <div className="flex gap-2 flex-wrap justify-end">
            <Badge
              className={
                room.status === 'live'
                  ? 'bg-room-live text-white animate-pulse-subtle'
                  : room.status === 'scheduled'
                  ? 'bg-room-scheduled text-white'
                  : 'bg-room-closed text-white'
              }
            >
              {room.status.toUpperCase()}
            </Badge>
            <Badge variant="outline">{room.tag}</Badge>
            <Badge variant="outline">{room.roomType === "private" ? "Private" : "Public"}</Badge>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-[500px] lg:h-[600px]">
            <CardHeader>
              <CardTitle>Room Chat</CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-70px)] p-0">
              <ChatBox
                messages={room.messages}
                onSendMessage={handleSendMessage}
                isLive={isLive}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Room Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Description</h3>
                  <p className="text-sm">{room.description || "No description provided."}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">Participants ({room.participants.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.participants.map((userId) => (
                      <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3 mr-1" />
                        {/* In a real app, we'd get usernames from the server */}
                        {userId === "1" ? "demo" : userId === "2" ? "jane" : userId === "3" ? "john" : `user-${userId}`}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {room.roomType === "private" && (
                  <div>
                    <h3 className="font-medium mb-1">Invited Users</h3>
                    <div className="flex flex-wrap gap-2">
                      {room.invitedUsers.length > 0 ? (
                        room.invitedUsers.map((userId) => (
                          <Badge key={userId} variant="outline">
                            {/* In a real app, we'd get usernames from the server */}
                            {userId === "1" ? "demo" : userId === "2" ? "jane" : userId === "3" ? "john" : userId}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No additional users invited.</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Invite users button - visible to room creator and participants */}
                {(isRoomCreator || isParticipant) && (room.status !== 'closed') && (
                  <Button 
                    variant="outline" 
                    className="w-full flex gap-2"
                    onClick={() => setShowInviteForm(!showInviteForm)}
                  >
                    <UserPlus className="h-4 w-4" /> 
                    {showInviteForm ? "Cancel Invite" : "Invite Others"}
                  </Button>
                )}

                {/* Invite form - conditionally displayed */}
                {showInviteForm && (
                  <Card className="border border-dashed bg-muted/40">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3">Invite by Email or Phone</h3>
                      <InviteToRoomForm 
                        roomId={roomId || ""} 
                        onInviteSuccess={handleInviteSuccess} 
                      />
                    </CardContent>
                  </Card>
                )}
                
                {isLive && isParticipant && (
                  <div className="relative mt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-4 w-4 mr-2" /> Send Reaction
                    </Button>
                    
                    {showEmojiPicker && (
                      <div className="absolute top-full mt-2 bg-white border rounded-md p-2 shadow-md z-10">
                        <div className="grid grid-cols-4 gap-2">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              className="text-2xl p-2 hover:bg-accent rounded-md"
                              onClick={() => handleSendReaction(emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {isLive && isParticipant && (
                  <Button 
                    variant="outline" 
                    className="w-full text-destructive hover:bg-destructive/10"
                    onClick={handleLeaveRoom}
                  >
                    Leave Room
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;
