import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';   // Hooks for Redux state management
import { loginStart, loginSuccess, loginFailure } from '../store/userSlice';  // Redux actions
import { useNavigate } from 'react-router-dom';  // Navigation hook from React Router
import image3 from '../assets/image3.jpg';        // Background image
import imageSignIn from '../assets/imageSignIn.webp';  // Logo/image above form

const SignIn = () => {
  const dispatch = useDispatch();    // To dispatch Redux actions
  const navigate = useNavigate();    // To navigate programmatically

  // Extract loading and error states from Redux store (user slice)
  const { loading, error } = useSelector(state => state.user);

  // Local component state for controlled input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = async e => {
    e.preventDefault();            // Prevent default form submit behavior (page reload)

    dispatch(loginStart());        // Dispatch loginStart action to set loading state

    try {
      // Call signin API endpoint with email and password in request body
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },  // Tell server we are sending JSON data
        body: JSON.stringify({ email, password }),        // Convert email and password to JSON string
      });

      // Parse JSON response from server
      const data = await response.json();

      // If response is not OK, throw an error to be caught below
      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store the received JWT token in localStorage for later authenticated requests
      localStorage.setItem('token', data.token);

      // Dispatch loginSuccess action with user info and token to update Redux store
      dispatch(loginSuccess({ user: { id: data.userId, name: data.name }, token: data.token }));

      alert('Login successful!');  // Show success alert to user
    } catch (err) {
      // If there was any error (network or API), dispatch loginFailure with error message
      dispatch(loginFailure(err.message));
    }

    // After login attempt, navigate to '/layout' page regardless of success/failure
    navigate('/layout');
  };

  // Handle clicking the close (X) button, navigating back to home page
  const handleClose = () => {
    navigate('/');
  };

  return (
    // Full screen container with background image, flexbox centering
    <div
      className="w-full h-screen bg-cover bg-center flex items-center justify-center relative"
      style={{ backgroundImage: `url(${image3})` }}
    >
      {/* Dark overlay with blur effect to dim the background image */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-0" />
   
      {/* The actual form container with white background, padding, rounded corners, shadow */}
      <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-lg shadow-lg mx-4 text-center">

        {/* Close button positioned top-right corner */}
        <button
          onClick={handleClose}                 // Go to home page when clicked
          aria-label="Close"                    // Accessibility label for screen readers
          className="absolute top-4 right-4 z-50 text-black p-2 rounded-full hover:bg-red-700 focus:outline-none"
        >
          {/* SVG icon for "X" */}
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

        {/* Logo/image shown above the heading */}
        <img src={imageSignIn} alt="Logo" className="w-50 h-40 mx-auto mb-4 object-contain" />

        {/* Heading for the form */}
        <h2 className="text-2xl font-bold mb-6 text-blue-600">Sign In</h2>

        {/* Show error message if there is any error from Redux state */}
        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}

        {/* Sign In form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">

          {/* Email input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}                      // Controlled input, value linked to state
              onChange={e => setEmail(e.target.value)}  // Update email state on change
              required                          // HTML5 required validation
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Password input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}                  // Controlled input for password
              onChange={e => setPassword(e.target.value)}  // Update password state on change
              required
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit button, disabled when loading */}
          <button
            type="submit"
            disabled={loading}                // Disable button while loading
            className={`w-full py-2 rounded text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition`}
          >
            {/* Show dynamic text based on loading state */}
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
