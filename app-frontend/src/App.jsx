import React, { useState, useEffect } from 'react';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ChatLayout from './components/Chat/ChatLayout';
import EmailVerificationPage from './components/Auth/EmailVerificationPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [stage, setStage] = useState('login');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (userData) => {
    if (userData.isVerified) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      setStage('verify');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setStage('login');
  };

  const handleRegistered = () => {
    setStage('verify');
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-gray-800">
      {user ? (
        <ChatLayout user={user} onLogout={handleLogout} />
      ) : stage === 'login' ? (
        <LoginForm onLoginSuccess={handleLogin} onSwitchToRegister={() => setStage('register')} />
      ) : stage === 'register' ? (
        <RegisterForm onRegistered={handleRegistered} onSwitchToLogin={() => setStage('login')} />
      ) : (
        <EmailVerificationPage />
      )}
    </div>
  );
}
