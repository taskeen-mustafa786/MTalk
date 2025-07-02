import React from 'react';

export default function ConversationListItem({ conversation, isActive, onSelect, currentUserId }) {
  const contact =
    conversation.isGroup
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
      className={`cursor-pointer flex items-center gap-4 p-4 ${
        isActive ? 'bg-gray-700' : 'hover:bg-gray-800'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onSelect(conversation);
      }}
    >
      <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl text-white select-none">
        {contact?.avatarUrl ? (
          <img
            src={contact.avatarUrl}
            alt={`${contact.displayName || 'User'} avatar`}
            className="w-full h-full rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          contact?.displayName?.[0].toUpperCase()
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{contact?.displayName || 'Unknown'}</div>
        <div className="text-sm text-gray-400 truncate">{lastMsgText}</div>
      </div>
    </div>
  );
}
