import React from 'react';

export default function ConversationListItem({
  conversation,
  isActive,
  onSelect,
  currentUserId
}) {
  const contact = conversation.isGroup
    ? { displayName: conversation.name, avatarUrl: null }
    : conversation.members.find((m) => m._id !== currentUserId);

  const lastMsg = conversation.lastMessage;

  const lastMsgText =
    lastMsg?.type === 'text'
      ? lastMsg.content
      : lastMsg?.type === 'image'
      ? '[Image]'
      : '[Other]';

  return (
    <div
      onClick={() => onSelect(conversation)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(conversation);
      }}
      className={`flex items-center gap-4 px-4 py-3 cursor-pointer select-none transition-colors
        ${isActive ? 'bg-[#e1f3fb]' : 'hover:bg-[#f5f5f5]'}`}
    >
      {/* Avatar / Initial */}
      <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white text-lg font-medium overflow-hidden">
        {contact?.avatarUrl ? (
          <img
            src={contact.avatarUrl}
            alt={contact.displayName || 'User'}
            className="w-full h-full object-cover"
          />
        ) : (
          contact?.displayName?.[0]?.toUpperCase() || '?'
        )}
      </div>

      {/* Name and last message */}
      <div className="flex-1 min-w-0 border-b border-gray-200 pb-3">
        <div className="flex justify-between items-center">
          <span className="font-medium text-gray-900 truncate">
            {contact?.displayName || 'Unknown'}
          </span>
          {/* You can add timestamp here later */}
          {/* <span className="text-xs text-gray-500">{...}</span> */}
        </div>
        <div className="text-sm text-gray-600 truncate">{lastMsgText}</div>
      </div>
    </div>
  );
}
