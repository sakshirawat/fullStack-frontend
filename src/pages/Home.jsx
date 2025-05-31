import React from 'react';
import image3 from '../assets/image3.jpg';  // Import the background image used in the homepage banner
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';  // To dispatch Redux actions
import { logout } from '../store/userSlice'; // Import logout action to clear user state

const Home = () => {
  const dispatch = useDispatch();  // Initialize dispatch function from Redux

  // useEffect hook runs once when the component mounts
  useEffect(() => {
    // When the Home component loads, clear any existing user session from Redux store
    // This ensures that visiting the homepage logs out the user automatically
    dispatch(logout());
  }, [dispatch]);

  return (
    // Main container taking full viewport width and height, with overflow hidden to avoid scrollbars
    <main className="w-full h-screen overflow-hidden">
      
      {/* Section containing the background image and overlay */}
      <section className="w-full h-full relative">
        
        {/* Background image filling the entire section */}
        <img
          src={image3}                // Source of the image imported at the top
          alt="Hospital Banner"      // Alt text for accessibility and SEO
          className="w-full h-full object-cover"  // Makes image cover entire container with proper aspect ratio
        />

        {/* Overlay div that sits on top of the image */}
        {/* Uses absolute positioning to fill the parent section */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center px-4 text-center">
          
          {/* Heading text displayed on top of the overlay */}
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Welcome to HospitalCare
          </h1>

          {/* Subheading or description text */}
          <p className="text-white max-w-xl text-sm sm:text-base md:text-lg">
            Your trusted partner for quality healthcare services
          </p>
        </div>
      </section>
    </main>
  );
};

export default Home;
