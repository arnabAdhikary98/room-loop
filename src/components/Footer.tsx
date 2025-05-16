
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/20 mt-auto">
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-lg font-medium text-primary">
              RoomLoop
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Casual, link-free micro-event platform
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:space-x-12 space-y-4 md:space-y-0 items-center">
            <div className="flex space-x-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/explore" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Explore
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                About
              </Link>
            </div>
            
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} RoomLoop. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
