import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/LoginForm';
import ChatLayout from './components/Chat/ChatLayout';

export default function App() {
  const [user, setUser] = useState(null);

  // On mount, load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-gray-800 transition-colors duration-300">
      {!user ? (
        <LoginForm onLoginSuccess={handleLogin} />
      ) : (
        <ChatLayout user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
