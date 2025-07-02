import React from 'react';
import { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import ChatWindow from './ChatWindow';
import CreateGroupModal from '../Models/CreateGroupModel'

export default function ChatLayout({ user, onLogout }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);

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

  const handleGroupCreate = async (groupData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/conversations/group', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(groupData),
      });

      if (res.ok) {
        const newGroup = await res.json();
        setConversations((prev) => [newGroup, ...prev]);
        setSelectedConversation(newGroup);
        setGroupModalOpen(false);
      } else {
        console.error('Group creation failed');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} onLogout={onLogout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelect={setSelectedConversation}
          currentUserId={user._id}
          onNewGroupClick={() => setGroupModalOpen(true)}
        />
        {selectedConversation ? (
          <ChatWindow conversation={selectedConversation} currentUserId={user._id} />
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            No conversation selected
          </div>
        )}
        <CreateGroupModal
          isOpen={isGroupModalOpen}
          onClose={() => setGroupModalOpen(false)}
          onCreate={handleGroupCreate}
        />
      </div>
    </div>
  );
}
