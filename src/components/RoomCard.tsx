import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Room } from "@/types";
import { getTimeRemaining, getTimeWindow } from "@/lib/date-utils";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom } from "@/contexts/RoomContext";
import { useNavigate } from "react-router-dom";

interface RoomCardProps {
  room: Room;
  showJoin?: boolean;
}

const RoomCard = ({ room, showJoin = true }: RoomCardProps) => {
  const { user } = useAuth();
  const { joinRoom } = useRoom();
  const navigate = useNavigate();
  
  const isCreator = user?.id === room.createdBy;
  const isParticipant = room.participants.includes(user?.id || '');
  const isInvited = room.invitedUsers.includes(user?.id || '');
  const canJoin = room.status === 'live' && 
    (room.roomType === 'public' || isCreator || isInvited) &&
    (!room.maxParticipants || room.participants.length < room.maxParticipants);
  
  const handleJoin = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (isParticipant) {
      navigate(`/room/${room.id}`);
      return;
    }
    
    try {
      await joinRoom(room.id);
      navigate(`/room/${room.id}`);
    } catch (error) {
      console.error("Failed to join room:", error);
    }
  };
  
  const handleViewRoom = () => {
    navigate(`/room/${room.id}`);
  };

  return (
    <Card className={`room-card ${room.status} transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px] border-l-4 ${
      room.status === 'live' 
        ? 'border-l-room-live bg-green-50' 
        : room.status === 'scheduled' 
        ? 'border-l-room-scheduled bg-blue-50' 
        : 'border-l-room-closed bg-gray-50'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge
            className={
              room.status === 'live'
                ? 'bg-room-live text-white animate-pulse-subtle'
                : room.status === 'scheduled'
                ? 'bg-room-scheduled text-white'
                : 'bg-room-closed text-white'
            }
          >
            {room.status === 'live' ? (
              'LIVE NOW'
            ) : room.status === 'scheduled' ? (
              `Starts in ${getTimeRemaining(room.startTime)}`
            ) : (
              'Ended'
            )}
          </Badge>
          <Badge variant="outline">{room.tag}</Badge>
        </div>
        <CardTitle className="line-clamp-1 text-lg">{room.title}</CardTitle>
        <CardDescription className="text-xs">{getTimeWindow(room.startTime, room.endTime)}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
          {room.description}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="text-xs text-muted-foreground">
            {room.roomType === 'private' ? 'Private Room' : 'Public Room'}
            {room.maxParticipants && ` • Max ${room.maxParticipants} people`}
          </div>
          <div className="text-xs">
            {room.participants.length} {room.participants.length === 1 ? 'person' : 'people'}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        {showJoin ? (
          canJoin && room.status === 'live' ? (
            <Button 
              className="w-full transition-all duration-300 hover:shadow-md" 
              variant={isParticipant ? "outline" : "default"}
              onClick={handleJoin}
            >
              {isParticipant ? 'Return to Room' : 'Join Room'}
            </Button>
          ) : isCreator && room.status === 'scheduled' ? (
            <Button 
              className="w-full transition-all duration-300 hover:shadow-md"
              variant="outline"
              onClick={handleViewRoom}
            >
              Manage Room
            </Button>
          ) : (
            <Button 
              className="w-full transition-all duration-300 hover:shadow-md" 
              variant="outline"
              onClick={handleViewRoom}
              disabled={room.status === 'scheduled' && !isCreator}
            >
              View Details
            </Button>
          )
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
