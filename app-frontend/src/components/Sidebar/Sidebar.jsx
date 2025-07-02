import React from 'react';
import ConversationListItem from '../Conversations/ConversationListItem';

export default function Sidebar({ conversations, selectedConversation, onSelect, currentUserId }) {
  return (
    <aside className="w-80 bg-gray-900 text-gray-100 overflow-y-auto">
      <div className="p-4 border-b border-gray-700 font-semibold text-lg">Conversations</div>
      {conversations.map((conv) => (
        <ConversationListItem
          key={conv._id}
          conversation={conv}
          isActive={selectedConversation?._id === conv._id}
          onSelect={onSelect}
          currentUserId={currentUserId}
        />
      ))}
    </aside>
  );
}
