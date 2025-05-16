
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="container py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">About RoomLoop</h1>
        
        <div className="space-y-6">
          <p className="text-lg">
            RoomLoop is a casual, link-free micro-event platform designed for spontaneous
            connection and collaboration.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">Our Concept</h2>
          <p>
            Sometimes you want to throw a quick virtual event, a hangout, or a focused collab
            session — no bloated calendar invites, no links buried in chat. You just want a room,
            a time, a vibe — and people show up.
          </p>
          
          <h2 className="text-2xl font-bold mt-8">How It Works</h2>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Create scheduled rooms with themes & time windows</li>
            <li>Invite friends via username or make it public</li>
            <li>Drop into live rooms to chat or leave reactions</li>
            <li>Track past rooms and participation</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8">Why RoomLoop?</h2>
          <p>
            Unlike video conferencing tools, RoomLoop is presence-first. We focus on connecting
            people at the right time without the overhead of traditional meetings. It's perfect
            for casual hangouts, quick brainstorming sessions, or focused collaboration.
          </p>
          
          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link to="/signup">Get Started</Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              Join RoomLoop and experience a new way to connect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
