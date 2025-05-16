/**
 * Formats a date as a time string in local time
 * @param dateString ISO date string
 * @returns Formatted time string (e.g., "7:30 PM")
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

/**
 * Formats a date as a readable date string in local time
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "May 15, 2025")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

/**
 * Returns a readable time window string
 * @param startTime ISO date string for start time
 * @param endTime ISO date string for end time
 * @returns Formatted time window (e.g., "7:30 PM - 9:00 PM, May 15")
 */
export const getTimeWindow = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  // If dates are the same, only show date once
  if (start.toDateString() === end.toDateString()) {
    return `${formatTime(startTime)} - ${formatTime(endTime)}, ${formatDate(startTime)}`;
  }
  
  // Otherwise show both dates
  return `${formatTime(startTime)}, ${formatDate(startTime)} - ${formatTime(endTime)}, ${formatDate(endTime)}`;
};

/**
 * Calculates the time remaining until a date
 * @param dateString ISO date string
 * @returns Time remaining string (e.g., "5 minutes" or "2 hours")
 */
export const getTimeRemaining = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffMs = date.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  if (diffMinutes < 0) return "Started";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
};

/**
 * Gets a readable duration string
 * @param startTime ISO date string for start time
 * @param endTime ISO date string for end time
 * @returns Duration string (e.g., "2 hours")
 */
export const getDuration = (startTime: string, endTime: string): string => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  const diffMs = end.getTime() - start.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
};

/**
 * Checks if a room is currently live based on start/end times
 */
export const isRoomLive = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);
  
  return now >= start && now <= end;
};
