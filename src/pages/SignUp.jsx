import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image3 from '../assets/image3.jpg';      // Background image
import logo from '../assets/imageSignIn.webp';  // Logo image

const BASE_URL = process.env.REACT_APP_BASE_URL;  // Base URL from environment variables

const Signup = () => {
  // State variables to hold form input values
  const [name, setName] = useState('');           
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State variables for feedback messages
  const [error, setError] = useState(null);       // To show error messages
  const [success, setSuccess] = useState(null);   // To show success messages

  const navigate = useNavigate();  // React Router's navigation hook

  // Handle form submission
  const handleSubmit = async e => {
    e.preventDefault();           // Prevent default form submission behavior (page reload)
    setError(null);               // Clear previous errors
    setSuccess(null);             // Clear previous success messages

    try {
      // Send POST request to signup endpoint with user input as JSON
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },    // Set content type to JSON
        body: JSON.stringify({ name, email, password }),     // Convert data to JSON string
      });

      // Parse JSON response from backend
      const data = await response.json();

      // If response is NOT OK, show error message returned from backend or generic error
      if (!response.ok) {
        setError(data.message || 'Signup failed');
        return;
      }

      // On success, show success message
      setSuccess('Signup successful! You can now login.');

      // Clear input fields after successful signup
      setName('');
      setEmail('');
      setPassword('');

      // Navigate user to the signin page
      navigate('/signin');
    } catch (err) {
      // Catch any network or unexpected errors and show message
      setError('Network error: ' + err.message);
    }
  };

  // Handle close button click to navigate back to home page
  const handleClose = () => {
    navigate('/'); // Navigate to homepage or root route
  };

  return (
    // Full screen container with background image and centered content
    <div 
      className="w-full h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${image3})` }}
    >
      {/* Form container with white background, padding, rounded corners and shadow */}
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md relative mx-4">

        {/* Close button positioned at top right corner */}
        <button
          onClick={handleClose}                 // Navigate home when clicked
          aria-label="Close"                    // Accessibility label
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
        >
          {/* SVG for an "X" close icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo image centered above the form */}
        <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-4" />

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-6 text-green-600 text-center">Sign Up</h2>

        {/* Show error message box if error exists */}
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        {/* Show success message box if signup was successful */}
        {success && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>
        )}

        {/* Signup form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Name input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}   // Update name state on input change
              required                                  // Required field validation
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}  // Update email state on input change
              required
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Password input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}  // Update password state on input change
              required
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
