// EmailVerificationPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }

      try {
        const res = await fetch(`http://localhost:4000/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Verification failed');

        setStatus('success');
        setMessage('Email verified successfully! You can now log in.');
      } catch (err) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-md shadow-md p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {status === 'verifying' && 'Verifying your email...'}
          {status === 'success' && 'Success!'}
          {status === 'error' && 'Verification Failed'}
        </h2>
        <p className="text-gray-700">{message}</p>
        {status === 'success' && (
          <a
            href="/"
            className="mt-4 inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Go to Login
          </a>
        )}
      </div>
    </div>
  );
}
