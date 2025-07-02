import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ conversation, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize socket connection with credentials
  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    setSocket(newSocket);

    // Join conversation room
    if (conversation?._id) {
      newSocket.emit('joinConversation', conversation._id);
    }

    // Message event listener
    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };
    newSocket.on('newMessage', handleNewMessage);

    // Cleanup on unmount
    return () => {
      newSocket.off('newMessage', handleNewMessage);
      newSocket.disconnect();
    };
  }, [conversation?._id]);

  // Fetch initial messages
  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(
          `http://localhost:4000/api/conversations/${conversation._id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          }
        );
        
        if (!res.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
      }
    }
    
    if (conversation?._id) {
      fetchMessages();
    }
  }, [conversation?._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message handler
  async function sendMessage() {
    try {
      if (!input.trim()) return;
      
      const res = await fetch('http://localhost:4000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          conversationId: conversation._id,
          type: 'text',
          content: input.trim()
        })
      });
      
      if (!res.ok) {
        throw new Error(await res.text());
      }
      
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Message display */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map(msg => (
          <MessageBubble 
            key={msg._id}
            message={msg}
            isOwn={msg.sender === currentUserId || msg.sender?._id === currentUserId} 
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
