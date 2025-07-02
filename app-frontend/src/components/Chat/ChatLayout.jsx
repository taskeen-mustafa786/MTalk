import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import ChatWindow from './ChatWindow';

export default function ChatLayout({ user, onLogout }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/conversations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch conversations');
        const data = await res.json();
        setConversations(data);
        if (data.length) setSelectedConversation(data[0]);
      } catch (err) {
        console.error(err);
      }
    }
    fetchConversations();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#f0f2f5]">
      {/* Top Header */}
      <Header user={user} onLogout={onLogout} />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-full max-w-sm min-w-[300px] border-r border-gray-300 bg-white">
          <Sidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelect={setSelectedConversation}
            currentUserId={user.id}
          />
        </div>

        {/* Chat Window */}
        <div className="flex-1 bg-[#efeae2]">
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              currentUserId={user.id}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No conversation selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
