import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ conversation, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:4000', {
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    setSocket(newSocket);

    if (conversation?._id) {
      newSocket.emit('joinConversation', conversation._id);
    }

    const handleNewMessage = (message) => {
      setMessages(prev => [...prev, message]);
    };
    newSocket.on('newMessage', handleNewMessage);

    return () => {
      newSocket.off('newMessage', handleNewMessage);
      newSocket.disconnect();
    };
  }, [conversation?._id]);

  // Initial messages
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

        if (!res.ok) throw new Error('Failed to fetch messages');

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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
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

      if (!res.ok) throw new Error(await res.text());

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
    <div className="flex flex-col h-full bg-[#f0f0f0] relative">
      {/* Chat Header */}
      <div className="flex items-center px-4 py-3 bg-white shadow-md sticky top-0 z-10">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {conversation?.title || 'Chat'}
          </span>
          <span className="text-xs text-gray-500">Online</span>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            isOwn={msg.sender === currentUserId || msg.sender?._id === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sticky bottom-0 z-10">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-full disabled:opacity-50 hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
