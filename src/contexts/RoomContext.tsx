
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Room, RoomStatus, RoomContextType } from '@/types';
import { useAuth } from './AuthContext';

// Mock data for rooms
const mockRooms: Room[] = [
  {
    id: 'room-1',
    title: 'Friday Night Doodles',
    description: 'Casual drawing session. Bring your own tools!',
    roomType: 'public',
    startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    endTime: new Date(Date.now() + 1000 * 60 * 90).toISOString(),   // 90 minutes from now
    maxParticipants: 10,
    tag: 'Hangout',
    status: 'live',
    createdBy: '1',
    participants: ['1', '2'],
    invitedUsers: [],
    messages: [
      {
        id: 'msg-1',
        roomId: 'room-1',
        userId: '1',
        username: 'demo',
        content: 'Welcome to the doodle session!',
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
      {
        id: 'msg-2',
        roomId: 'room-1',
        userId: '2',
        username: 'jane',
        content: 'Excited to be here! What are we drawing today?',
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      },
    ],
  },
  {
    id: 'room-2',
    title: 'Bug Bash: Landing Page',
    description: 'Help find and document bugs in the new landing page before launch.',
    roomType: 'private',
    startTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),  // 1 hour from now
    endTime: new Date(Date.now() + 1000 * 60 * 180).toISOString(),   // 3 hours from now
    tag: 'Work',
    status: 'scheduled',
    createdBy: '2',
    participants: ['2'],
    invitedUsers: ['1', '3'],
    messages: [],
  },
  {
    id: 'room-3',
    title: 'Meditation Circle',
    description: 'Guided meditation session for beginners.',
    roomType: 'public',
    startTime: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    endTime: new Date(Date.now() - 1000 * 60 * 60).toISOString(),    // 1 hour ago
    maxParticipants: 20,
    tag: 'Wellness',
    status: 'closed',
    createdBy: '3',
    participants: ['1', '2', '3'],
    invitedUsers: [],
    messages: [
      {
        id: 'msg-3',
        roomId: 'room-3',
        userId: '3',
        username: 'john',
        content: 'Thanks everyone for joining!',
        createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(),
      },
    ],
  },
];

// Create the room context
const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Helper function to check and update room status based on current time
  const updateRoomStatusByTime = (room: Room): Room => {
    const now = new Date();
    const startTime = new Date(room.startTime);
    const endTime = new Date(room.endTime);

    let newStatus: RoomStatus = room.status;

    if (now < startTime) {
      newStatus = 'scheduled';
    } else if (now >= startTime && now <= endTime) {
      newStatus = 'live';
    } else if (now > endTime) {
      newStatus = 'closed';
    }

    return newStatus !== room.status ? { ...room, status: newStatus } : room;
  };

  // Fetch rooms from mock API and initialize
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update statuses based on current time
        const updatedRooms = mockRooms.map(updateRoomStatusByTime);
        setRooms(updatedRooms);
      } catch (err) {
        setError("Failed to fetch rooms");
        console.error("Error fetching rooms:", err);
        toast({
          title: "Error",
          description: "Failed to fetch rooms.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();

    // Set up interval to update room statuses
    const intervalId = setInterval(() => {
      setRooms(prevRooms => prevRooms.map(updateRoomStatusByTime));
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [toast]);

  // Filter rooms for current user
  const userRooms = rooms.filter(room => room.createdBy === user?.id);
  
  const invitedRooms = rooms.filter(
    room => room.invitedUsers.includes(user?.id || '') && room.createdBy !== user?.id
  );
  
  const publicRooms = rooms.filter(
    room => room.roomType === 'public' && room.createdBy !== user?.id
  );

  // Create a new room
  const createRoom = async (roomData: Partial<Room>) => {
    setLoading(true);
    try {
      if (!user) throw new Error("You must be logged in to create a room");

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      const now = new Date();
      const startTime = new Date(roomData.startTime || now.toISOString());
      const endTime = new Date(roomData.endTime || 
        new Date(now.getTime() + 60 * 60 * 1000).toISOString()); // Default 1 hour

      let status: RoomStatus = 'scheduled';
      if (now >= startTime && now <= endTime) {
        status = 'live';
      } else if (now > endTime) {
        status = 'closed';
      }

      const newRoom: Room = {
        id: `room-${Date.now()}`,
        title: roomData.title || 'Untitled Room',
        description: roomData.description || '',
        roomType: roomData.roomType || 'private',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        maxParticipants: roomData.maxParticipants,
        tag: roomData.tag || 'Other',
        status,
        createdBy: user.id,
        participants: [user.id],
        invitedUsers: roomData.invitedUsers || [],
        messages: [],
      };

      setRooms(prevRooms => [...prevRooms, newRoom]);
      
      toast({
        title: "Room created!",
        description: `Your room "${newRoom.title}" has been created.`,
      });
      
      return;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create room";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update room status manually
  const updateRoomStatus = async (roomId: string, status: RoomStatus) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? { ...room, status } : room
        )
      );
      
      toast({
        title: "Status updated",
        description: `Room status changed to ${status}.`,
      });
    } catch (err) {
      setError("Failed to update room status");
      toast({
        title: "Error",
        description: "Failed to update room status.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Join a room
  const joinRoom = async (roomId: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to join a room.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const room = rooms.find(r => r.id === roomId);
      if (!room) throw new Error("Room not found");

      // Check if room is live
      if (room.status !== 'live') {
        throw new Error(`Cannot join a room that is ${room.status}`);
      }

      // Check if user is already in the room
      if (room.participants.includes(user.id)) {
        throw new Error("You are already in this room");
      }

      // For private rooms, check if user is invited
      if (room.roomType === 'private' && !room.invitedUsers.includes(user.id) && room.createdBy !== user.id) {
        throw new Error("You are not invited to this room");
      }

      // Check if room is full
      if (room.maxParticipants && room.participants.length >= room.maxParticipants) {
        throw new Error("This room is full");
      }

      setRooms(prevRooms => 
        prevRooms.map(r => 
          r.id === roomId ? {
            ...r,
            participants: [...r.participants, user.id]
          } : r
        )
      );
      
      toast({
        title: "Joined room",
        description: `You've joined "${room.title}".`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to join room";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Leave a room
  const leaveRoom = async (roomId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? {
            ...room,
            participants: room.participants.filter(id => id !== user.id)
          } : room
        )
      );
      
      toast({
        title: "Left room",
        description: "You have left the room.",
      });
    } catch (err) {
      setError("Failed to leave room");
      toast({
        title: "Error",
        description: "Failed to leave room.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Send a message in a room
  const sendMessage = async (roomId: string, content: string) => {
    if (!user) return;
    if (!content.trim()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      const newMessage = {
        id: `msg-${Date.now()}`,
        roomId,
        userId: user.id,
        username: user.username,
        content,
        createdAt: new Date().toISOString(),
      };

      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? {
            ...room,
            messages: [...room.messages, newMessage]
          } : room
        )
      );
    } catch (err) {
      setError("Failed to send message");
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Send a reaction in a room
  const sendReaction = async (roomId: string, emoji: string) => {
    if (!user) return;

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      // In a real app, we'd store this in a reactions array
      // For now, we'll just show a toast
      toast({
        title: `${emoji} Reaction sent!`,
        description: "Your reaction has been shared with the room.",
      });
    } catch (err) {
      setError("Failed to send reaction");
    }
  };

  // Get a room by ID
  const getRoomById = (roomId: string) => {
    return rooms.find(room => room.id === roomId);
  };

  // Refresh rooms (manually trigger refetch)
  const refreshRooms = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setRooms(prevRooms => prevRooms.map(updateRoomStatusByTime));
    } catch (err) {
      setError("Failed to refresh rooms");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        userRooms,
        invitedRooms,
        publicRooms,
        loading,
        error,
        createRoom,
        updateRoomStatus,
        joinRoom,
        leaveRoom,
        sendMessage,
        sendReaction,
        getRoomById,
        refreshRooms,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  
  if (context === undefined) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  
  return context;
};
