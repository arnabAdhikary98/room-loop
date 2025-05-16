import { Room } from "@/types";
import RoomCard from "@/components/RoomCard";

interface RoomGridProps {
  rooms: Room[];
}

const RoomGrid = ({ rooms }: RoomGridProps) => {
  if (!rooms.length) {
    return (
      <div className="text-center p-6 border border-dashed rounded-lg bg-accent/50">
        <p className="text-muted-foreground">No rooms found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room, index) => (
        <div 
          key={room.id} 
          className={`animate-fade-in opacity-0`}
          style={{ 
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'forwards' 
          }}
        >
          <RoomCard room={room} />
        </div>
      ))}
    </div>
  );
};

export default RoomGrid;
