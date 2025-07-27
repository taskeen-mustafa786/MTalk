import React, { useState } from 'react';
import ConversationListItem from '../Conversations/ConversationListItem';

export default function Sidebar({
  conversations = [], // Safe default
  selectedConversation,
  onSelect,
  currentUserId,
  onNewGroupClick,
  savedContacts = [],
  startConversationWith
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    const contact = conv.isGroup
      ? { displayName: conv.name }
      : conv.members.find((m) => m._id !== currentUserId);

    return contact?.displayName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  return (
    <aside className="w-full max-w-sm min-w-[300px] bg-[#f0f2f5] border-r border-gray-300 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-300 text-lg font-semibold text-gray-800 flex justify-between items-center">
        <span>Chats</span>
        <button
          className="text-sm px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
          onClick={onNewGroupClick}
        >
          + Group
        </button>
      </div>

      {/* Search bar */}
      <div className="px-4 py-2 border-b border-gray-300">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search chats"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conv) => (
            <ConversationListItem
              key={conv._id}
              conversation={conv}
              isActive={selectedConversation?._id === conv._id}
              onSelect={onSelect}
              currentUserId={currentUserId}
            />
          ))
        ) : (
          <div className="p-4 text-gray-500 text-sm text-center">No matches found</div>
        )}
      </div>

     {/* Saved Contacts Section */}
<div className="p-3 border-t border-gray-200">
  <h2 className="text-sm font-semibold text-gray-600 mb-2">Saved Contacts</h2>
  {Array.isArray(savedContacts) && savedContacts.length > 0 ? (
    savedContacts.map((contact, index) => {
      const key = contact._id || `${contact.email}-${index}`;
      const existingConversation = conversations.find(
        (c) =>
          !c.isGroup &&
          c.members.some((m) => m._id === contact._id) &&
          c.members.some((m) => m._id === currentUserId)
      );

      const handleClick = () => {
        if (existingConversation) {
          onSelect(existingConversation);
        } else {
          startConversationWith?.(contact._id, contact.displayName);
        }
      };

      return (
        <div
          key={key}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleClick()}
          className={`cursor-pointer px-3 py-2 rounded text-sm ${
            existingConversation
              ? 'text-gray-400 hover:bg-gray-100'
              : 'text-gray-800 hover:bg-gray-100'
          }`}
        >
          💬 {contact.displayName || contact.email}
          {existingConversation && (
            <span className="ml-2 text-xs text-gray-500">(In chat)</span>
          )}
        </div>
      );
    })
  ) : (
    <div className="text-xs text-gray-400">No saved contacts</div>
  )}
</div>

    </aside>
  );
}
