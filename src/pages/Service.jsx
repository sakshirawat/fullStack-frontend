import React, { useEffect, useState } from 'react';

const ServicesPage = () => {
  // State to hold the list of services fetched from the backend
  const [services, setServices] = useState([]);

  // useEffect hook to fetch services when the component mounts
  useEffect(() => {
    // Define an async function to fetch services data
    const fetchServices = async () => {
      try {
        // Retrieve the JWT token from localStorage to authenticate API requests
        const token = localStorage.getItem('token');

        // Make a GET request to the services API endpoint
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/appoint/services`, {
          headers: {
            'Content-Type': 'application/json',    // Specify JSON response expected
            Authorization: `Bearer ${token}`,       // Pass token in Authorization header for protected route
          },
        });

        // Parse JSON response
        const data = await response.json();

        // Update state with services array from response (default to empty array if undefined)
        setServices(data.services || []);
      } catch (error) {
        // Log any errors that occur during fetch
        console.error('Error fetching services:', error);
      }
    };

    // Call the fetch function when component mounts
    fetchServices();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    // Main container with padding, light gray background, and full viewport height minimum
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Page title */}
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Our Services
      </h2>

      {/* Responsive grid container for service cards: 1 col on small, up to 3 on medium+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {/* Iterate over services and render a card for each */}
        {services.map((service, index) => (
          <div
            key={index}                          // Unique key for React list rendering
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
          >
            {/* Service name */}
            <h3 className="text-xl font-semibold text-gray-800 my-4 mx-4">
              {service.name}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
