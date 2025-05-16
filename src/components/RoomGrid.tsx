
import { Room } from "@/types";
import RoomCard from "./RoomCard";

interface RoomGridProps {
  rooms: Room[];
  emptyMessage?: string;
}

const RoomGrid = ({ rooms, emptyMessage = "No rooms found" }: RoomGridProps) => {
  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  );
};

export default RoomGrid;
