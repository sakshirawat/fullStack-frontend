import React from 'react';
import { useSelector } from 'react-redux';   // To access Redux state
import { Link } from 'react-router-dom';     // For client-side navigation links

const Header = () => {
  // Extract the 'user' object from Redux store (assumes user slice with user info)
  const user = useSelector((state) => state.user.user);

  return (
    // Header container with white background and shadow, padding and flex layout
    // Responsive padding: small on xs, more on sm and md
    // Flex container with column direction on small screens and row on medium and up
    // Justify space between and center aligned items vertically
    // Gap between elements adapts to screen size
    <header className="bg-white shadow-md py-6 px-4 sm:px-6 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
      
      {/* Logo / Brand Name */}
      <div className="text-3xl sm:text-4xl font-bold text-blue-600 text-center md:text-left">
        HospitalCare
      </div>

      {/* Navigation menu - only visible if user is logged in */}
      {user && (
        <nav
          className="
            flex
            flex-col      /* stack links vertically on small screens */
            md:flex-row   /* arrange links horizontally on medium and larger screens */
            items-center  /* vertically center nav items */
            gap-3         /* spacing between nav items on small screens */
            md:gap-6      /* larger spacing on medium+ screens */
            text-gray-700 /* medium gray text color */
          "
        >
          {/* Nav Link - Services */}
          <Link
            to="/layout/services"
            className="bg-blue-400 text-black px-4 py-2 md:py-3 rounded hover:bg-blue-700 transition text-sm md:text-base"
          >
            Services
          </Link>

          {/* Nav Link - Book Appointment */}
          <Link
            to="/layout/bookAppointments"
            className="bg-blue-400 text-black px-4 py-2 md:py-3 rounded hover:bg-blue-700 transition text-sm md:text-base"
          >
            Book Appointment
          </Link>

          {/* Nav Link - My Appointment */}
          <Link
            to="/layout/myAppointments"
            className="bg-blue-400 text-black px-4 py-2 md:py-3 rounded hover:bg-blue-700 transition text-sm md:text-base"
          >
            My Appointment
          </Link>
        </nav>
      )}

      {/* Authentication buttons - shown only when user is NOT logged in */}
      {!user && (
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          {/* Sign In Button */}
          <Link
            to="/signin"
            className="text-blue-600 border border-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition text-sm md:text-base"
          >
            Sign In
          </Link>

          {/* Sign Up Button */}
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition text-sm md:text-base"
          >
            Sign Up
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
