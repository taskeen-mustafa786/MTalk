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
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogout={onLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelect={setSelectedConversation}
          currentUserId={user.id}
        />
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} currentUserId={user.id} />
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            No conversation selected
          </div>
        )}
      </div>
    </div>
  );
}
