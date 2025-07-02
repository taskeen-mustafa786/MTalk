import React from 'react';

export default function Header({ user, onLogout }) {
  const initials = user?.displayName?.[0]?.toUpperCase() || '?';

  return (
    <header className="bg-[#ededed] border-b border-gray-300 flex items-center justify-between px-4 py-2">
      {/* User info (left) */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold">
          {initials}
        </div>
        <span className="font-medium text-gray-800">{user.displayName}</span>
      </div>

      {/* Title (center - optional) */}
      {/* <div className="text-xl font-semibold text-gray-700">WhatsUp!</div> */}

      {/* Logout button (right) */}
      <button
        onClick={onLogout}
        className="text-sm px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white transition"
        aria-label="Logout"
      >
        Logout
      </button>
    </header>
  );
}
