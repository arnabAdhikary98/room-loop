import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom } from "@/contexts/RoomContext";
import { RoomTag, RoomStatus } from "@/types";
import RoomGrid from "@/components/RoomGrid";

const Explore = () => {
  const { isAuthenticated } = useAuth();
  const { publicRooms, refreshRooms } = useRoom();
  const [statusFilter, setStatusFilter] = useState<RoomStatus | "all">("all");
  const [tagFilter, setTagFilter] = useState<RoomTag | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  useEffect(() => {
    // Initial load of rooms
    handleRefresh();
    // Don't include handleRefresh in dependencies to avoid refresh loops
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter rooms based on selected filters
  const filteredRooms = publicRooms.filter((room) => {
    const matchesStatus = statusFilter === "all" ? true : room.status === statusFilter;
    const matchesTag = tagFilter === "all" ? true : room.tag === tagFilter;
    const matchesSearch = searchQuery === "" ? true : 
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesTag && matchesSearch;
  });
  
  // Get live and scheduled rooms
  const liveRooms = filteredRooms.filter(room => room.status === "live");
  const scheduledRooms = filteredRooms.filter(room => room.status === "scheduled");
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshRooms();
    } finally {
      // Ensure we always set refreshing to false, even if there's an error
      setTimeout(() => {
        setIsRefreshing(false);
      }, 600); // Add a short delay to ensure UI feels responsive
    }
  };

  return (
    <div className="container py-8 px-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Explore Rooms</h1>
          <p className="text-muted-foreground">
            Discover public rooms to join and participate in
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          className="mt-4 md:mt-0"
          disabled={isRefreshing}
        >
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <Input
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as RoomStatus | "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tagFilter} onValueChange={(value) => setTagFilter(value as RoomTag | "all")}>
            <SelectTrigger>
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              <SelectItem value="Hangout">Hangout</SelectItem>
              <SelectItem value="Work">Work</SelectItem>
              <SelectItem value="Brainstorm">Brainstorm</SelectItem>
              <SelectItem value="Wellness">Wellness</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <RoomGrid
            rooms={filteredRooms}
            emptyMessage="No rooms match your filters. Try adjusting your search criteria."
          />
        </TabsContent>
        
        <TabsContent value="live">
          <RoomGrid
            rooms={liveRooms}
            emptyMessage="No live rooms at the moment. Check back later or browse upcoming rooms."
          />
        </TabsContent>
        
        <TabsContent value="upcoming">
          <RoomGrid
            rooms={scheduledRooms}
            emptyMessage="No upcoming rooms scheduled. Check the 'All' tab for more options."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Explore;
