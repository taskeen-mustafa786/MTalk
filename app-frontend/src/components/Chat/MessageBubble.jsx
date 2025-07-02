import React from 'react';

export default function MessageBubble({ message, isOwn }) {
  const alignment = isOwn ? 'self-end bg-indigo-600 text-white' : 'self-start bg-gray-700 text-gray-200';
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`max-w-xs break-words rounded-lg p-3 ${alignment}`}>
      <div>{message.content}</div>
      <div className="text-xs text-gray-300 mt-1 text-right">{time}</div>
    </div>
  );
}
