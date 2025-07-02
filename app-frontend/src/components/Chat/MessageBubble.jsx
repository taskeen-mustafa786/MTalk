import React from 'react';

export default function MessageBubble({ message, isOwn }) {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} px-2`}>
      <div
        className={`relative max-w-[75%] px-4 py-2 rounded-lg shadow-md text-sm ${
          isOwn
            ? 'bg-green-500 text-white rounded-br-none'
            : 'bg-white text-gray-800 rounded-bl-none'
        }`}
      >
        {/* Bubble content */}
        <div>
          {message.type === 'image' ? (
            <img
              src={message.content}
              alt="sent media"
              className="rounded max-w-full h-auto"
            />
          ) : (
            message.content
          )}
        </div>

        {/* Timestamp */}
        <div className="text-[10px] text-gray-600 mt-1 text-right">{time}</div>

        {/* Bubble tail */}
        <div
          className={`absolute bottom-0 ${
            isOwn
              ? 'right-0 w-0 h-0 border-t-[10px] border-t-green-500 border-l-[10px] border-l-transparent'
              : 'left-0 w-0 h-0 border-t-[10px] border-t-white border-r-[10px] border-r-transparent'
          }`}
        />
      </div>
    </div>
  );
}
