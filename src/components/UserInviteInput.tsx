import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface UserInviteInputProps {
  invitedUsers: string[];
  onInviteUser: (username: string) => void;
  onRemoveInvite: (username: string) => void;
}

// In a real app, this would come from an API
const mockUsernames = ["demo", "jane", "john", "alex", "morgan", "taylor", "jordan"];

const UserInviteInput = ({
  invitedUsers,
  onInviteUser,
  onRemoveInvite,
}: UserInviteInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (inputValue.trim()) {
      const filteredSuggestions = mockUsernames
        .filter(
          username =>
            username.toLowerCase().includes(inputValue.toLowerCase()) && 
            !invitedUsers.includes(username)
        )
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, invitedUsers]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      
      if (suggestions.length > 0) {
        // If we have suggestions, use the first one
        onInviteUser(suggestions[0]);
      } else {
        // Otherwise use the input value directly
        onInviteUser(inputValue.trim());
      }
      
      setInputValue("");
    }
  };

  const handleSelectSuggestion = (username: string) => {
    onInviteUser(username);
    setInputValue("");
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Enter username to invite..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
            <ul className="py-1">
              {suggestions.map((username) => (
                <li
                  key={username}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-muted"
                  onMouseDown={() => handleSelectSuggestion(username)}
                >
                  {username}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {invitedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {invitedUsers.map((username) => (
            <Badge key={username} variant="secondary" className="flex items-center gap-1">
              {username}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => onRemoveInvite(username)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserInviteInput;
