import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/LoginForm';
import ChatLayout from './components/Chat/ChatLayout';

// Simple state for whether user is authenticated
export default function App() {
  const [user, setUser] = useState(null);

  // On mount, check for token in localStorage & optionally fetch user profile
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // On login, store user info
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // On logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!user ?
        <LoginForm onLoginSuccess={handleLogin} /> :
        <ChatLayout user={user} onLogout={handleLogout} />
      }
    </div>
  );
}
