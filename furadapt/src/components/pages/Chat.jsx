import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { chatAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Send, ArrowLeft, Phone, Video, MoreVertical } from 'lucide-react';

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [startingConversation, setStartingConversation] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeSocket();
    fetchConversations();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user]); // Add user as dependency

  // Handle direct navigation to /chat/:userId
  useEffect(() => {
    if (userId && !loading) {
      console.log('UserId changed or loading completed:', { userId, loading, conversationsCount: conversations.length });
      
      if (conversations.length > 0) {
        const conversation = conversations.find(conv => conv._id === userId);
        if (conversation) {
          console.log('Found existing conversation:', conversation);
          selectConversation(conversation);
        } else {
          console.log('No existing conversation found, starting new one');
          startNewConversation(userId);
        }
      } else {
        // If no conversations loaded yet, start new conversation directly
        console.log('No conversations loaded, starting new conversation directly');
        startNewConversation(userId);
      }
    }
  }, [userId, loading, conversations.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSocket = () => {
    const newSocket = io('http://localhost:5001', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
      if (user) {
        newSocket.emit('user_online', user._id);
      }
    });

    newSocket.on('receive_message', (messageData) => {
      setMessages(prev => [...prev, messageData]);
      
      // Update conversations list with the latest message
      setConversations(prev => 
        prev.map(conv => 
          conv._id === messageData.sender._id 
            ? { 
                ...conv, 
                lastMessage: messageData.message,
                lastMessageTime: messageData.createdAt,
                unreadCount: selectedConversation?._id === messageData.sender._id ? 0 : conv.unreadCount + 1
              }
            : conv
        )
      );
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Connection error. Retrying...');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(newSocket);
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await chatAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      toast.error('Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  const startNewConversation = async (userId) => {
    try {
      setStartingConversation(true);
      console.log('Starting new conversation with userId:', userId);
      console.log('Current user:', user);
      
      // Check if user is trying to chat with themselves
      if (userId === user._id) {
        toast.error("You can't chat with yourself!");
        navigate('/chat');
        return;
      }
      
      const response = await chatAPI.startConversation(userId);
      console.log('Start conversation response:', response);
      const { user: targetUser } = response.data;
      
      // Create a mock conversation object for the UI
      const newConversation = {
        _id: userId,
        otherUser: targetUser,
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0
      };

      console.log('Created new conversation object:', newConversation);
      setSelectedConversation(newConversation);
      setMessages([]);
      
      // Join room for real-time messaging
      const joinRoom = () => {
        if (socket && socket.connected) {
          const roomId = [user._id, userId].sort().join('_');
          console.log('Joining room:', roomId);
          socket.emit('join_room', roomId);
        } else {
          console.log('Socket not ready, waiting...');
          setTimeout(joinRoom, 500);
        }
      };
      joinRoom();

      // Add to conversations list if not already there
      setConversations(prev => {
        const exists = prev.find(conv => conv._id === userId);
        if (!exists) {
          console.log('Adding new conversation to list');
          return [newConversation, ...prev];
        }
        return prev;
      });

    } catch (error) {
      console.error('Failed to start conversation:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Failed to start conversation: ' + (error.response?.data?.message || error.message));
      // Don't navigate away, let user try again
    } finally {
      setStartingConversation(false);
    }
  };

  const selectConversation = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      const response = await chatAPI.getMessages(conversation._id);
      setMessages(response.data.messages);
      
      // Join room for real-time messaging
      if (socket) {
        const roomId = [user._id, conversation._id].sort().join('_');
        socket.emit('join_room', roomId);
      }

      // Mark messages as read
      await chatAPI.markAsRead(conversation._id);
      
      // Update conversation list to remove unread count
      setConversations(prev => 
        prev.map(conv => 
          conv._id === conversation._id 
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to load messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    try {
      setSendingMessage(true);
      const messageData = {
        receiverId: selectedConversation._id,
        message: newMessage.trim()
      };

      const response = await chatAPI.sendMessage(messageData);
      const newMsg = response.data;

      setMessages(prev => [...prev, newMsg]);
      setNewMessage('');

      // Send via socket for real-time delivery
      if (socket) {
        const roomId = [user._id, selectedConversation._id].sort().join('_');
        socket.emit('send_message', {
          ...newMsg,
          room: roomId
        });
      }

      // Update conversation list with latest message
      setConversations(prev => 
        prev.map(conv => 
          conv._id === selectedConversation._id 
            ? { 
                ...conv, 
                lastMessage: newMessage.trim(),
                lastMessageTime: new Date().toISOString()
              }
            : conv
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4e8cff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#4e8cff] text-lg font-semibold">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>No conversations yet</p>
              <p className="text-sm">Start chatting with pet owners!</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => selectConversation(conversation)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                  selectedConversation?._id === conversation._id ? 'bg-blue-50 border-l-4 border-l-[#4e8cff]' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#4e8cff] rounded-full flex items-center justify-center text-white font-semibold">
                    {conversation.otherUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {conversation.otherUser.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <div className="mt-1">
                        <span className="bg-[#4e8cff] text-white text-xs px-2 py-1 rounded-full">
                          {conversation.unreadCount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#4e8cff] rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedConversation.otherUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {selectedConversation.otherUser.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.otherUser.role === 'admin' ? 'Admin' : 'Pet Adopter'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Phone size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <Video size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => {
                const isCurrentUser = message.sender._id === user._id;
                const showDate = index === 0 || 
                  formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);

                return (
                  <div key={message._id}>
                    {showDate && (
                      <div className="text-center text-sm text-gray-500 my-4">
                        {formatDate(message.createdAt)}
                      </div>
                    )}
                    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isCurrentUser
                            ? 'bg-[#4e8cff] text-white'
                            : 'bg-white border border-gray-200 text-gray-800'
                        }`}
                      >
                        <p>{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4e8cff] focus:border-transparent"
                  disabled={sendingMessage}
                />
                <button
                  type="submit"
                  disabled={sendingMessage || !newMessage.trim()}
                  className="px-6 py-2 bg-[#4e8cff] text-white rounded-lg hover:bg-[#2563eb] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send size={18} />
                  {sendingMessage ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </>
        ) : startingConversation ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="w-16 h-16 border-4 border-[#4e8cff] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold mb-2">Starting conversation...</h2>
              <p>Please wait while we set up your chat</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={32} />
              </div>
              <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
              <p>Choose a conversation from the sidebar to start chatting</p>
              {userId && (
                <button
                  onClick={() => startNewConversation(userId)}
                  className="mt-4 px-6 py-2 bg-[#4e8cff] text-white rounded-lg hover:bg-[#2563eb] transition"
                >
                  Start New Conversation
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
