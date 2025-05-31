import React from 'react';

// Footer functional component definition
const Footer = () => {
  return (
    // Main footer container with background color, text color, and padding using TailwindCSS
    <footer className="bg-blue-100 text-gray-800 px-6 py-10">

      {/* 
        Wrapper div to center content horizontally (max width 7xl),
        use responsive grid layout with 1 column on small screens,
        2 columns on small+ screens, and 4 columns on large screens,
        with gaps between grid items
      */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* About Section */}
        <div>
          {/* Section title with larger font size and bold styling */}
          <h3 className="text-xl font-semibold mb-3">HospitalCare</h3>
          {/* Description text with smaller font */}
          <p className="text-sm">
            Empowering lives through accessible healthcare. We aim to deliver quality services for everyone.
          </p>
        </div>

        {/* Wellness Tips Section */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Wellness Tips</h3>
          {/* List of wellness tips with spacing between list items */}
          <ul className="text-sm space-y-2">
            <li>💧 Stay hydrated</li>
            <li>🥗 Eat balanced meals</li>
            <li>🏃 Exercise 30 min daily</li>
            <li>🛌 Sleep 7–8 hrs</li>
          </ul>
        </div>

        {/* Another Wellness Tips Section (You might want to rename this header for clarity) */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Wellness Tips</h3>
          <ul className="text-sm space-y-2">
            <li>Practice Deep Breathing</li>
            <li>Eat Mindfully</li>
            <li>Get Sunlight</li>
            <li>Connect with Others</li>
          </ul>
        </div>

        {/* Contact Info Section */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
          {/* Contact details with spacing */}
          <ul className="text-sm space-y-2">
            <li>📍 123 Health Street, Wellness City</li>
            <li>📞 +91 12345 67890</li>
            <li>✉️ care@hospitalcare.com</li>
          </ul>
        </div>
      </div>

      {/* Footer bottom text with smaller font, gray color, centered and spaced from above content */}
      <div className="text-center text-xs text-gray-600 mt-8">
        © {new Date().getFullYear()} HospitalCare. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
