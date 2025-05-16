
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="border-b bg-white sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-2xl font-bold text-primary">
            RoomLoop
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/explore" className="text-foreground hover:text-primary transition-colors">
            Explore
          </Link>
          {user && (
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground hidden sm:block">
                Hi, {user.username}
              </div>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
              <Button asChild>
                <Link to="/create-room">Create Room</Link>
              </Button>
            </div>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
