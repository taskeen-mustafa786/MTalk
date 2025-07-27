import React from 'react';

export default function ConversationListItem({ conversation, isActive, onSelect, currentUserId }) {
  const otherMember = !conversation.isGroup
    ? conversation.members.find((m) => m._id !== currentUserId)
    : null;

  const displayName = conversation.isGroup
    ? conversation.name
    : conversation.contactDisplayName || otherMember?.displayName || otherMember?.email || 'Unknown';

  return (
    <div
      onClick={() => onSelect(conversation)}
      className={`px-4 py-3 cursor-pointer hover:bg-gray-200 ${
        isActive ? 'bg-gray-300' : ''
      }`}
    >
      <p className="text-sm font-medium text-gray-800 truncate">{displayName}</p>
    </div>
  );
}
