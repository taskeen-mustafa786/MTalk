import React, { useState } from 'react';
import ConversationListItem from '../Conversations/ConversationListItem';

export default function Sidebar({
  conversations,
  selectedConversation,
  onSelect,
  currentUserId
}) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations based on display name
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
      <div className="p-4 border-b border-gray-300 text-lg font-semibold text-gray-800">
        Chats
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
    </aside>
  );
}
