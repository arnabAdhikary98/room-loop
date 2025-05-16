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
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24 shadow-md transition-all duration-300 hover:shadow-lg">
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
                <Button size="lg" asChild className="transition-transform hover:scale-105">
                  <Link to="/create-room">Create a Room</Link>
                </Button>
              ) : (
                <Button size="lg" asChild className="transition-transform hover:scale-105">
                  <Link to="/signup">Get Started</Link>
                </Button>
              )}
              <Button size="lg" variant="outline" asChild className="transition-transform hover:scale-105">
                <Link to="/explore">Explore Rooms</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Rooms Section */}
      {liveRooms.length > 0 && (
        <section className="py-12 container px-4 md:px-6 my-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Live Now</h2>
              <Button variant="outline" asChild className="transition-transform hover:scale-105">
                <Link to="/explore">See All</Link>
              </Button>
            </div>
            <RoomGrid rooms={liveRooms.slice(0, 3)} />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-accent shadow-md transition-all duration-300 hover:shadow-lg">        
        <div className="container px-4 md:px-6">          
          <div className="grid gap-8 md:grid-cols-3">            
            <div className="space-y-3 p-6 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] border-t-4 border-t-blue-500">              
              <h3 className="text-xl font-medium flex items-center text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Scheduled Rooms
              </h3>              
              <p className="text-muted-foreground">                
                Create rooms with a time window. Only active when you need them to be.              
              </p>            
            </div>            
            <div className="space-y-3 p-6 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] border-t-4 border-t-green-500">              
              <h3 className="text-xl font-medium flex items-center text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Focused Sessions
              </h3>              
              <p className="text-muted-foreground">                
                Invite specific people or make it public. Choose what works for each session.              
              </p>            
            </div>            
            <div className="space-y-3 p-6 bg-white rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] border-t-4 border-t-purple-500">              
              <h3 className="text-xl font-medium flex items-center text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Ephemeral by Design
              </h3>              
              <p className="text-muted-foreground">                
                Rooms appear when scheduled, disappear when done. No permanence, no pressure.              
              </p>            
            </div>          
          </div>        
        </div>      
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 my-4 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to create your first room?</h2>
            <p className="text-muted-foreground max-w-[600px]">
              It takes less than a minute to set up a new room and invite friends or colleagues.
            </p>
            {isAuthenticated ? (
              <Button size="lg" asChild className="transition-transform hover:scale-105">
                <Link to="/create-room">Create a Room</Link>
              </Button>
            ) : (
              <Button size="lg" asChild className="transition-transform hover:scale-105">
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
