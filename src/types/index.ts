
// Room Types
export type RoomStatus = "scheduled" | "live" | "closed";
export type RoomTag = "Hangout" | "Work" | "Brainstorm" | "Wellness" | "Other";
export type RoomType = "private" | "public";

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

export interface Room {
  id: string;
  title: string;
  description: string;
  roomType: RoomType;
  startTime: string;  // ISO string
  endTime: string;    // ISO string
  maxParticipants?: number;
  tag: RoomTag;
  status: RoomStatus;
  createdBy: string;  // User ID
  participants: string[];  // Array of user IDs
  invitedUsers: string[];  // Array of user IDs for private rooms
  messages: Message[];
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  username: string;
  content: string;
  createdAt: string;  // ISO string
}

export interface Reaction {
  id: string;
  roomId: string;
  userId: string;
  emoji: string;
  createdAt: string;  // ISO string
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Room context types
export interface RoomContextType {
  rooms: Room[];
  userRooms: Room[];
  invitedRooms: Room[];
  publicRooms: Room[];
  loading: boolean;
  error: string | null;
  createRoom: (room: Partial<Room>) => Promise<void>;
  updateRoomStatus: (roomId: string, status: RoomStatus) => Promise<void>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, content: string) => Promise<void>;
  sendReaction: (roomId: string, emoji: string) => Promise<void>;
  getRoomById: (roomId: string) => Room | undefined;
  refreshRooms: () => Promise<void>;
}
