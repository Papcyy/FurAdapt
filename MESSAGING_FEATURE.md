# Messaging Feature - FurAdapt

## Overview
The messaging feature allows users to communicate with each other in real-time, particularly for discussing pet adoptions. The system uses Socket.IO for real-time messaging and stores message history in MongoDB.

## Features Implemented

### 1. Real-time Chat
- **WebSocket Connection**: Uses Socket.IO for instant message delivery
- **Room-based messaging**: Users join unique rooms for each conversation
- **Message persistence**: All messages are stored in the database
- **Read receipts**: Messages are marked as read when viewed

### 2. Chat Interface
- **Conversation List**: Shows all ongoing conversations with last message preview
- **Unread Count**: Displays unread message counts in the sidebar
- **Message History**: Loads previous messages with pagination
- **User-friendly UI**: Clean interface with message bubbles and timestamps

### 3. Integration with Pet Adoption
- **Contact Owner**: Users can contact pet owners directly from pet detail pages
- **Contextual Messaging**: Start conversations from pet listings
- **User Identification**: Shows user roles (admin, adopter) in chat

## Architecture

### Backend (Node.js/Express)
- **Routes**: `/api/chat/*` handles all chat operations
- **Models**: ChatMessage model stores messages with sender/receiver references
- **Socket.IO**: Real-time communication server
- **Authentication**: Protected routes using JWT middleware

### Frontend (React)
- **Chat Component**: Main chat interface with conversation list and message view
- **Socket Connection**: Client-side Socket.IO integration
- **API Integration**: Axios-based API calls for message operations
- **State Management**: React hooks for managing chat state

## API Endpoints

### Chat Routes (`/api/chat`)
1. `GET /` - Get user's conversations
2. `GET /:userId` - Get messages with specific user
3. `POST /` - Send a message
4. `POST /start` - Start conversation with a user
5. `PUT /:userId/read` - Mark messages as read
6. `GET /unread/count` - Get unread message count

## Socket.IO Events

### Client Events
- `user_online` - User comes online
- `join_room` - Join conversation room
- `send_message` - Send message to room
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server Events
- `receive_message` - Receive new message
- `user_typing` - Someone is typing
- `user_stop_typing` - Someone stopped typing

## Usage Flow

### Starting a Conversation
1. User clicks "Contact" button on pet detail page
2. Navigate to `/chat/:userId`
3. System checks for existing conversation
4. If none exists, create new conversation context
5. User can send first message

### Real-time Messaging
1. User types message and hits send
2. Message saved to database via API
3. Socket.IO broadcasts message to conversation room
4. Recipient receives message instantly
5. Conversation list updates with latest message

### Message Management
1. Messages marked as read when conversation is opened
2. Unread counts updated in real-time
3. Message history paginated for performance
4. Timestamps and user identification displayed

## Configuration

### Environment Variables
- `MONGODB_URI` - Database connection string
- `JWT_SECRET` - JWT token secret
- `PORT` - Server port (default: 5001)

### Socket.IO Setup
- CORS enabled for frontend origins
- Websocket and polling transport methods
- Automatic reconnection on client side

## Security Features
- **Authentication Required**: All chat endpoints protected by JWT
- **User Validation**: Verify users exist before creating conversations
- **Message Validation**: Input validation and sanitization
- **Rate Limiting**: Prevent spam and abuse

## Performance Optimizations
- **Message Pagination**: Load messages in chunks
- **Socket Room Management**: Efficient room joining/leaving
- **Debounced API Calls**: Prevent excessive API requests
- **Lazy Loading**: Load conversations and messages on demand

## Testing the Feature

### Prerequisites
1. Backend server running on port 5001
2. Frontend server running on port 5174
3. MongoDB connection established
4. At least 2 user accounts created

### Test Steps
1. Login with first user
2. Navigate to pet listings
3. Click on a pet detail
4. Click "Contact" button
5. Send a test message
6. Login with second user (in different browser/incognito)
7. Check if message appears in their chat
8. Reply to test real-time messaging

## Troubleshooting

### Common Issues
1. **Socket Connection Failed**: Check if backend server is running and CORS is configured
2. **Messages Not Appearing**: Verify database connection and user authentication
3. **Real-time Not Working**: Check Socket.IO version compatibility and port configuration
4. **Unread Counts Wrong**: Ensure read status is properly updated in database

### Debug Tools
- Browser console for Socket.IO connection logs
- Network tab for API request/response inspection
- Backend logs for server-side debugging
- MongoDB logs for database operations

## Future Enhancements
- File/image sharing in messages
- Message reactions and emojis
- Group messaging for multiple users
- Message encryption for privacy
- Push notifications for mobile
- Voice/video calling integration
- Message search functionality
- Conversation archiving

## Files Modified/Created

### Backend Files
- `routes/chat.js` - Chat API endpoints
- `models/ChatMessage.js` - Message data model
- `server.js` - Socket.IO integration

### Frontend Files
- `components/pages/Chat.jsx` - Main chat interface
- `components/pages/sidenav.jsx` - Added unread count badge
- `utils/api.js` - Chat API methods
- `App.jsx` - Chat routes configuration

This messaging feature provides a solid foundation for user communication within the FurAdapt pet adoption platform.
