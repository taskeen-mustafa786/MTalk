import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import loginSchema from '../../validationSchemas/loginSchema';

function LoginForm({ onSubmit }) {
  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={loginSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-md space-y-6 text-white">
          <h2 className="text-2xl font-semibold text-center">Login</h2>

          <div>
            <label htmlFor="username" className="block mb-1 font-medium">Username</label>
            <Field
              type="text"
              name="username"
              id="username"
              placeholder="Enter your username"
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="username" component="div" className="text-red-400 mt-1 text-sm" />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
            <Field
              type="password"
              name="password"
              id="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <ErrorMessage name="password" component="div" className="text-red-400 mt-1 text-sm" />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded bg-blue-600 hover:bg-blue-700 transition-colors font-semibold ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

        </Form>
      )}
    </Formik>
  );
}

export default LoginForm;
