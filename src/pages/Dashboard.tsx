
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom } from "@/contexts/RoomContext";
import RoomGrid from "@/components/RoomGrid";
import { RoomStatus } from "@/types";

const Dashboard = () => {
  const { user } = useAuth();
  const { userRooms, invitedRooms, refreshRooms, loading } = useRoom();
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "all">("all");

  const filterRoomsByStatus = (rooms: typeof userRooms, status: RoomStatus | "all") => {
    if (status === "all") return rooms;
    return rooms.filter((room) => room.status === status);
  };

  const myRoomsFiltered = filterRoomsByStatus(userRooms, statusFilter);
  const invitedRoomsFiltered = filterRoomsByStatus(invitedRooms, statusFilter);

  const handleRefresh = () => {
    refreshRooms();
  };

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Login Required</h1>
        <p className="mb-8">Please login to view your dashboard.</p>
        <Button asChild>
          <Link to="/login">Log In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground">Manage your rooms and invitations</p>
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          <Button asChild>
            <Link to="/create-room">Create Room</Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Room Status</h2>
          <div className="flex space-x-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("all")}
            >
              All
            </Button>
            <Button
              variant={statusFilter === "live" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("live")}
            >
              Live
            </Button>
            <Button
              variant={statusFilter === "scheduled" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("scheduled")}
            >
              Scheduled
            </Button>
            <Button
              variant={statusFilter === "closed" ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter("closed")}
            >
              Closed
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="my-rooms" className="w-full">
        <TabsList className="w-full md:w-auto mb-4">
          <TabsTrigger value="my-rooms" className="flex-1">My Rooms</TabsTrigger>
          <TabsTrigger value="invitations" className="flex-1">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="my-rooms">
          <RoomGrid
            rooms={myRoomsFiltered}
            emptyMessage={
              userRooms.length === 0
                ? "You haven't created any rooms yet"
                : `No ${statusFilter !== "all" ? statusFilter : ""} rooms found`
            }
          />
        </TabsContent>

        <TabsContent value="invitations">
          <RoomGrid
            rooms={invitedRoomsFiltered}
            emptyMessage={
              invitedRooms.length === 0
                ? "You don't have any room invitations"
                : `No ${statusFilter !== "all" ? statusFilter : ""} invitations found`
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
