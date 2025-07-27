import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ conversation, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [media, setMedia] = useState(null);
  const messagesEndRef = useRef(null);

  // Ensure we reset messages when conversation changes
  useEffect(() => {
    setMessages([]);
  }, [conversation?._id]);

  // Initialize socket
  useEffect(() => {
    if (!conversation?._id) return;

    const newSocket = io('http://localhost:4000', {
      withCredentials: true,
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    setSocket(newSocket);
    newSocket.emit('joinConversation', conversation._id);

    const handleNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    newSocket.on('newMessage', handleNewMessage);

    return () => {
      newSocket.off('newMessage', handleNewMessage);
      newSocket.disconnect();
    };
  }, [conversation?._id]);

  // Fetch initial messages
  useEffect(() => {
  async function fetchMessages() {
    try {
      const res = await fetch(`http://localhost:4000/api/conversations/${conversation._id}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  }
 if (conversation?._id) {
  setMessages([]); // Clear previous
  fetchMessages();
}

}, [conversation?._id]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage() {
    try {
      if (!input.trim() && !media) return;

      const messagePayload = {
        conversationId: conversation._id,
        type: media ? 'image' : 'text',
        content: input.trim(),
      };

      // Handle media upload
      if (media) {
        const formData = new FormData();
        formData.append('file', media);

        const uploadRes = await fetch('http://localhost:4000/api/media/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
          body: formData,
        });

        const uploadData = await uploadRes.json();
        messagePayload.content = uploadData.url;
      }

      await fetch('http://localhost:4000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify(messagePayload),
      });

      setInput('');
      setMedia(null);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setMedia(file);
  };

  // ✅ Early return to prevent crashing before a valid conversation is set
  if (!conversation || !conversation._id) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
        No conversation selected
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4">
       {messages.length > 0 ? (
  messages.map(msg => (
    <MessageBubble 
      key={msg._id}
      message={msg}
      isOwn={msg.sender === currentUserId || msg.sender?._id === currentUserId} 
    />
  ))
) : (
  <div className="text-gray-500 text-sm text-center mt-10">
    No messages yet. Start the conversation!
  </div>
)}

        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer bg-gray-200 p-2 rounded hover:bg-gray-300">
            📎
          </label>

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
            disabled={!input.trim() && !media}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            Send
          </button>
        </div>

        {media && (
          <div className="mt-2 text-sm text-gray-600">
            Attached: {media.name}
          </div>
        )}
      </div>
    </div>
  );
}
