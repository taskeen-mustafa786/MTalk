import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import ChatWindow from './ChatWindow';
import CreateGroupModal from '../Models/CreateGroupModel';

export default function ChatLayout({ user, onLogout }) {
  const [conversations, setConversations] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isGroupModalOpen, setGroupModalOpen] = useState(false);

  /* ─────────────────────────────────────────────
     1. FETCH CONVERSATIONS + SAVED CONTACTS
  ───────────────────────────────────────────── */
  useEffect(() => {
    fetchConversations();
    fetchContacts();
  }, []);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setConversations(data);
      if (data.length) setSelectedConversation(data[0]);
    } catch (err) {
      console.error('fetchConversations:', err);
    }
  };

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/contacts/saved-contacts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error('fetchContacts:', err);
    }
  };

  /* ─────────────────────────────────────────────
     2. CREATE GROUP HANDLER
  ───────────────────────────────────────────── */
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
      if (!res.ok) throw new Error('Group create failed');

      const newGroup = await res.json();
      setConversations((prev) => [newGroup, ...prev]);
      setSelectedConversation(newGroup);
      setGroupModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* ─────────────────────────────────────────────
     3. START / OPEN CONVERSATION WITH A CONTACT
  ───────────────────────────────────────────── */
  const startConversationWith = async (contactId, savedName) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/conversations/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contactId }),
      });
      if (!res.ok) throw new Error('Failed to start conversation');

      const convo = await res.json();

      // Patch saved name to show in sidebar
      convo.contactDisplayName = savedName;
      convo.members = convo.members.map((m) =>
        m._id === contactId ? { ...m, displayName: savedName } : m
      );

      setConversations((prev) => {
        const exists = prev.find((c) => c._id === convo._id);
        return exists ? prev : [convo, ...prev];
      });

      setSelectedConversation(convo);
      return convo; // ✅ Return for Sidebar to use
    } catch (err) {
      console.error('startConversationWith:', err);
      alert('Unable to open chat.');
      return null;
    }
  };

  /* ─────────────────────────────────────────────
     4. ADD CONTACT BY EMAIL
  ───────────────────────────────────────────── */
  const handleAddContact = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    if (!email) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/contacts/add-by-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        alert('✅ Contact added.');
        fetchContacts();
        e.target.reset();
      } else {
        alert(data.message || 'Failed to add contact');
      }
    } catch (err) {
      console.error('addContact error:', err);
    }
  };

  /* ─────────────────────────────────────────────
     5. RENDER
  ───────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header user={user} onLogout={onLogout} />

      <div className="flex flex-1 overflow-hidden">
        {/* ───── Sidebar ───── */}
        <div className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 bg-white border-r border-gray-200 overflow-y-auto">
          <Sidebar
            conversations={conversations}
            selectedConversation={selectedConversation}
            onSelect={setSelectedConversation}
            currentUserId={user._id}
            onNewGroupClick={() => setGroupModalOpen(true)}
            savedContacts={contacts}
            startConversationWith={startConversationWith}
          />

          {/* Add Contact Form */}
          <div className="p-3 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">Add Contact</h2>
            <form onSubmit={handleAddContact} className="flex gap-2 items-center">
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="flex-1 px-2 py-1 border rounded text-sm"
                required
              />
              <button
                type="submit"
                className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Add
              </button>
            </form>
          </div>
        </div>

        {/* ───── Chat Window ───── */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedConversation && selectedConversation._id ? (
            <ChatWindow
              conversation={selectedConversation}
              currentUserId={user._id}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg font-medium">
              Select a conversation to start chatting
            </div>
          )}
        </div>

        {/* ───── Group Modal ───── */}
        <CreateGroupModal
          isOpen={isGroupModalOpen}
          onClose={() => setGroupModalOpen(false)}
          onCreate={handleGroupCreate}
        />
      </div>
    </div>
  );
}
