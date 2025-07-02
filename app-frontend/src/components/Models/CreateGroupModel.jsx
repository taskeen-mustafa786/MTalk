import React, { useEffect, useState } from 'react';

export default function CreateGroupModal({ isOpen, onClose, onCreate }) {
  const [groupName, setGroupName] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [inviteLink, setInviteLink] = useState('');
  const [manualContact, setManualContact] = useState('');

  useEffect(() => {
    async function fetchContacts() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/users/saved-contacts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch saved contacts');
        const data = await res.json();
        setContacts(data);
      } catch (err) {
        console.error(err);
      }
    }
    if (isOpen) fetchContacts();
  }, [isOpen]);

  const toggleUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSubmit = () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;
    onCreate({ name: groupName, members: selectedUsers });
  };

  const handleGenerateLink = () => {
    setInviteLink(`http://localhost:5173/join-group?name=${encodeURIComponent(groupName)}`);
  };

  const handleManualAdd = async () => {
    if (!manualContact.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: manualContact.trim() }),
      });

      if (!res.ok) throw new Error('Failed to add contact');
      setManualContact('');
      // Refresh contacts
      const contactsRes = await fetch('http://localhost:4000/api/users/saved-contacts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await contactsRes.json();
      setContacts(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Create Group</h2>

        <input
          type="text"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
        />

        {/* Manual Add Contact */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Username to add"
              value={manualContact}
              onChange={(e) => setManualContact(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
            />
            <button
              onClick={handleManualAdd}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
        </div>

        <div className="max-h-40 overflow-y-auto mb-4 border border-gray-200 p-2 rounded">
          {contacts.length === 0 ? (
            <p className="text-gray-500 text-sm">No saved contacts available</p>
          ) : (
            contacts.map((user) => (
              <label key={user._id} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => toggleUser(user._id)}
                />
                <span className="text-gray-700">{user.displayName}</span>
              </label>
            ))
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>

          <button
            onClick={handleGenerateLink}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Generate Invite Link
          </button>

          {inviteLink && (
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="w-full mt-2 px-3 py-1 border text-sm text-gray-700 border-gray-300 rounded"
            />
          )}

          <button
            onClick={onClose}
            className="mt-2 text-sm text-red-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
