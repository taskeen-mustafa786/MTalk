import React from 'react';

export default function Header({ user, onLogout }) {
  return (
    <header className="bg-gray-800 text-white flex items-center justify-between p-4 shadow">
      <div className="text-xl font-bold">WA Clone</div>
      <div className="flex items-center space-x-4">
        <span>{user.displayName}</span>
        <button
          onClick={onLogout}
          className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
