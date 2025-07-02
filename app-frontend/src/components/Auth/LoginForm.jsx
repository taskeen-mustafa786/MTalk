import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

export default function LoginForm({ onLoginSuccess }) {
  // loginForm.jsx
async function handleSubmit(values, { setSubmitting, setErrors }) {
  try {
    const res = await fetch('http://localhost:4000/api/auth/login', {  // This is correct
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await res.json();

    if (!res.ok) {
      setErrors({ password: data.message || 'Login failed' });
      setSubmitting(false);
      return;
    }

    localStorage.setItem('token', data.token);
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(data.user);
    }
  } catch (err) {
    setErrors({ password: 'Network error' });
    setSubmitting(false);
  }
}


  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-gray-800 rounded-md shadow-md text-white">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="username" className="block mb-1">Username</label>
              <Field
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Enter your username"
              />
              <ErrorMessage name="username" component="div" className="text-red-500 mt-1" />
            </div>
            <div>
              <label htmlFor="password" className="block mb-1">Password</label>
              <Field
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Enter your password"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 mt-1" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded bg-indigo-600 hover:bg-indigo-700 transition-colors font-semibold ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
