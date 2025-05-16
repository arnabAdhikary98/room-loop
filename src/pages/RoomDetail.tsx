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
      <div className="mb-6 p-4 rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4 transition-all hover:shadow-sm">
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
          <Card className="h-[400px] lg:h-[450px] shadow-md transition-all duration-300 hover:shadow-lg border-t-4 border-t-primary">
            <CardHeader className="pb-2 bg-primary/10">
              <CardTitle className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-2 0a6 6 0 11-12 0 6 6 0 0112 0zm-6-3a1 1 0 100 2 1 1 0 000-2zm-2 3a1 1 0 011-1h2a1 1 0 110 2h-1v3a1 1 0 11-2 0V10z" clipRule="evenodd" />
                </svg>
                Room Chat
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-60px)] p-0">
              <ChatBox
                messages={room.messages}
                onSendMessage={handleSendMessage}
                isLive={isLive}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <div className="space-y-4">
            <Card className="shadow-md transition-all duration-300 hover:shadow-lg border-t-4 border-t-secondary">
              <CardHeader className="pb-2 bg-secondary/10">
                <CardTitle className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Room Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Description</h3>
                  <p className="text-sm">{room.description || "No description provided."}</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-md border-l-4 border-l-blue-400">
                  <h3 className="font-medium mb-2 text-blue-700 flex items-center">
                    <Users className="h-4 w-4 mr-1 text-blue-600" />
                    Participants ({room.participants.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {room.participants.map((userId) => (
                      <Badge key={userId} variant="secondary" className="flex items-center gap-1 transition-all hover:shadow-sm bg-blue-100 text-blue-700 hover:bg-blue-200">
                        <Users className="h-3 w-3 mr-1" />
                        {/* In a real app, we'd get usernames from the server */}
                        {userId === "1" ? "demo" : userId === "2" ? "jane" : userId === "3" ? "john" : `user-${userId}`}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {room.roomType === "private" && (
                  <div className="p-3 bg-purple-50 rounded-md border-l-4 border-l-purple-400">
                    <h3 className="font-medium mb-2 text-purple-700 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      Invited Users
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {room.invitedUsers.length > 0 ? (
                        room.invitedUsers.map((userId) => (
                          <Badge key={userId} variant="outline" className="transition-all hover:shadow-sm bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-200">
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
                    className="w-full flex gap-2 transition-all hover:shadow-md hover:bg-accent/20"
                    onClick={() => setShowInviteForm(!showInviteForm)}
                  >
                    <UserPlus className="h-4 w-4" /> 
                    {showInviteForm ? "Cancel Invite" : "Invite Others"}
                  </Button>
                )}

                {/* Invite form - conditionally displayed */}
                {showInviteForm && (
                  <Card className="border border-dashed bg-accent/50 shadow-md transition-all duration-300 hover:shadow-lg border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <h3 className="font-medium mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                        </svg>
                        Invite by Email or Phone
                      </h3>
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
                      className="w-full transition-all hover:shadow-md hover:bg-accent/20"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="h-4 w-4 mr-2" /> Send Reaction
                    </Button>
                    
                    {showEmojiPicker && (
                      <div className="absolute top-full mt-2 bg-white border rounded-md p-2 shadow-md z-10 transition-all hover:shadow-lg animate-fade-in">
                        <div className="grid grid-cols-4 gap-2">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              className="text-2xl p-2 hover:bg-accent rounded-md transition-transform hover:scale-110"
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
                    className="w-full text-destructive hover:bg-destructive/10 transition-all hover:shadow-md"
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
