import React, { useState, useEffect } from 'react';

const Profile = () => {
  // State to hold the profile data with initial empty values
  const [profile, setProfile] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
  });

  // State to control whether the form is in editing mode or read-only mode
  const [isEditing, setIsEditing] = useState(false);

  // Retrieve the user's token from localStorage to authorize API requests
  const token = localStorage.getItem('token');

  // useEffect to fetch profile data from backend API when the component mounts or token changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Make a GET request to the profile endpoint with the token in Authorization header
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/getProfile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          // If successful, update profile state with data received (fallback to empty string if undefined)
          setProfile({
            name: data.name || '',
            phone: data.phone || '',
            email: data.email || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipcode: data.zipcode || '',
          });
        } else {
          // Log error message if the response is not ok
          console.error(data.message);
        }
      } catch (err) {
        // Catch and log network or other errors
        console.error('Error:', err);
      }
    };

    fetchProfile();
  }, [token]);

  // Generic input change handler to update the profile state based on input's name and value
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Function to handle saving the profile data when user clicks "Save"
  const handleSave = async () => {
    try {
      // Send a POST request to save the profile with updated data, including token for authorization
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/auth/postProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile), // Send profile data as JSON
      });

      const data = await res.json();

      if (res.ok) {
        // If save is successful, notify user and exit editing mode
        alert('Profile saved!');
        setIsEditing(false);
      } else {
        // Alert the error message if saving fails
        alert(data.message);
      }
    } catch (err) {
      // Log any errors during saving
      console.error('Error saving:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8 bg-white shadow-md rounded-md">
      {/* Profile heading */}
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-600">Patient Profile</h2>

      {/* Form grid container with 1 column on small and 2 columns on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Each input field below represents a profile attribute */}

        {/* Name input */}
        <div>
          <label htmlFor="name" className="block text-gray-700 font-medium capitalize mb-1">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!isEditing} // disable input when not editing
            className={`mt-1 block w-full border border-gray-300 p-2 rounded-md text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !isEditing ? 'bg-gray-100 cursor-not-allowed' : '' // style differently when disabled
            }`}
            placeholder="Your full name"
          />
        </div>

        {/* Phone input */}
        <div>
          <label htmlFor="phone" className="block text-gray-700 font-medium capitalize mb-1">Phone</label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full border border-gray-300 p-2 rounded-md text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Phone number"
          />
        </div>

        {/* Email input */}
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium capitalize mb-1">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full border border-gray-300 p-2 rounded-md text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Email address"
          />
        </div>

        {/* Address input */}
        <div>
          <label htmlFor="address" className="block text-gray-700 font-medium capitalize mb-1">Address</label>
          <input
            id="address"
            type="text"
            name="address"
            value={profile.address}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full border border-gray-300 p-2 rounded-md text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Street address"
          />
        </div>

        {/* City input */}
        <div>
          <label htmlFor="city" className="block text-gray-700 font-medium capitalize mb-1">City</label>
          <input
            id="city"
            type="text"
            name="city"
            value={profile.city}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full border border-gray-300 p-2 rounded-md text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="City"
          />
        </div>

        {/* State input */}
        <div>
          <label htmlFor="state" className="block text-gray-700 font-medium capitalize mb-1">State</label>
          <input
            id="state"
            type="text"
            name="state"
            value={profile.state}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full border border-gray-300 p-2 rounded-md text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="State / Province"
          />
        </div>

        {/* Zipcode input */}
        <div>
          <label htmlFor="zipcode" className="block text-gray-700 font-medium capitalize mb-1">Zipcode</label>
          <input
            id="zipcode"
            type="text"
            name="zipcode"
            value={profile.zipcode}
            onChange={handleChange}
            disabled={!isEditing}
            className={`mt-1 block w-full border border-gray-300 p-2 rounded-md text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
            placeholder="Zip or Postal code"
          />
        </div>
      </div>

      {/* Buttons container */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
        {!isEditing ? (
          // Show Edit button when not editing
          <button
            onClick={() => setIsEditing(true)} // Enable editing mode on click
            className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
          >
            Edit
          </button>
        ) : (
          // Show Save button when editing
          <button
            onClick={handleSave} // Save changes on click
            className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
