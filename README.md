# RoomLoop - Room-Hop-Sessions

A modern, interactive platform for creating and joining temporary rooms for focused collaboration or casual hangouts. RoomLoop enables users to create scheduled sessions, invite participants, and communicate in real-time.

## Features

- **Room Management**: Create, join, and manage rooms with different statuses (live, scheduled, closed)
- **Real-time Chat**: Communicate with participants through a real-time chat interface
- **Invitation System**: Invite users via username, email, or phone number
- **Visual Status Indicators**: Color-coded visual cues to easily identify room status
- **Responsive Design**: Works beautifully on both desktop and mobile devices

## UI Enhancements

The application features a professional, eye-soothing UI with:

- **Color-coded Components**: Visual distinctiveness for different room statuses and component types
- **Animated Interactions**: Subtle animations and hover effects for better user feedback
- **Consistent Visual Language**: Clean, consistent design patterns throughout the application
- **Enhanced Chat Experience**: Better visual separation between messages
- **Accessibility Considerations**: Clear visual hierarchy and readable text

## Technologies Used

This project is built with:

- **Vite**: For fast development and optimized production builds
- **TypeScript**: For type-safe code
- **React**: For component-based UI development
- **Tailwind CSS**: For utility-first styling
- **Radix UI / shadcn-ui**: For accessible UI components

## Getting Started

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/your-username/room-hop-sessions.git

# Step 2: Navigate to the project directory
cd room-hop-sessions

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Application Structure

- `/src/components`: Reusable UI components
- `/src/contexts`: React context providers for state management
- `/src/lib`: Utility functions and services
- `/src/pages`: Application pages
- `/src/types`: TypeScript type definitions

## Development

### Running Tests

```sh
npm test
```

### Building for Production

```sh
npm run build
```

### Deployment

The application can be deployed to any static site hosting service like Vercel, Netlify, or GitHub Pages.

```sh
# Example deployment to Vercel
npm install -g vercel
vercel
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the application.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
