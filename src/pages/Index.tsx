
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRoom } from "@/contexts/RoomContext";
import RoomGrid from "@/components/RoomGrid";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { publicRooms } = useRoom();
  
  // Get only live public rooms for showcase
  const liveRooms = publicRooms.filter(room => room.status === 'live');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
              Quick rooms for spontaneous connection
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              Create temporary spaces for focused collaboration or casual hangouts — no calendar invites, no hidden links.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              {isAuthenticated ? (
                <Button size="lg" asChild>
                  <Link to="/create-room">Create a Room</Link>
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild>
                <Link to="/explore">Explore Rooms</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Rooms Section */}
      {liveRooms.length > 0 && (
        <section className="py-12 container px-4 md:px-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Live Now</h2>
              <Button variant="outline" asChild>
                <Link to="/explore">See All</Link>
              </Button>
            </div>
            <RoomGrid rooms={liveRooms.slice(0, 3)} />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-3">
              <h3 className="text-xl font-medium">Scheduled Rooms</h3>
              <p className="text-muted-foreground">
                Create rooms with a time window. Only active when you need them to be.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">Focused Sessions</h3>
              <p className="text-muted-foreground">
                Invite specific people or make it public. Choose what works for each session.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-medium">Ephemeral by Design</h3>
              <p className="text-muted-foreground">
                Rooms appear when scheduled, disappear when done. No permanence, no pressure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to create your first room?</h2>
            <p className="text-muted-foreground max-w-[600px]">
              It takes less than a minute to set up a new room and invite friends or colleagues.
            </p>
            {isAuthenticated ? (
              <Button size="lg" asChild>
                <Link to="/create-room">Create a Room</Link>
              </Button>
            ) : (
              <Button size="lg" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
