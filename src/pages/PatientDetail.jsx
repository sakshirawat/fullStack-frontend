import React, { useState } from 'react';

const PatientForm = () => {
  // Initialize form state with empty strings for each field
  const [formData, setFormData] = useState({
    firstName: '',  // Patient's first name
    lastName: '',   // Patient's last name
    phone: '',      // Patient's phone number
    email: '',      // Patient's email address
    address: '',    // Patient's street address
    city: '',       // City of residence
    state: '',      // State of residence
    zipcode: ''     // Zip code / postal code
  });

  // Handle input changes: update the corresponding field in formData state
  const handleChange = e => {
    // Spread current formData and update the changed field by name
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission asynchronously
  const handleSubmit = async e => {
    e.preventDefault(); // Prevent page reload on form submit

    try {
      // Send POST request to backend API to save patient details
      const res = await fetch('http://localhost:5000/addPatientDetails', {
        method: 'POST',             // HTTP POST method
        headers: {
          'Content-Type': 'application/json', // Send JSON data
          // Add Authorization header here if your API requires it
        },
        body: JSON.stringify(formData) // Convert formData object to JSON string
      });

      const data = await res.json();  // Parse JSON response from server
      console.log(data);              // Log response data for debugging

      // Alert success message to user
      alert('Patient details submitted successfully!');
    } catch (error) {
      // Catch and log any errors during fetch or server response parsing
      console.error('Error:', error);
      alert('Submission failed');  // Alert user of failure
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {/* Centered container with padding, white background, rounded corners, and shadow */}
      <div className="w-full max-w-2xl bg-white p-8 rounded shadow">
        {/* Form title */}
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Patient Details
        </h2>

        {/* Form element handling submit with handleSubmit */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Dynamically render input fields from an array of [fieldName, label] */}
          {[
            ['firstName', 'First Name'],
            ['lastName', 'Last Name'],
            ['phone', 'Phone'],
            ['email', 'Email'],
            ['address', 'Address'],
            ['city', 'City'],
            ['state', 'State'],
            ['zipcode', 'Zipcode']
          ].map(([name, label]) => (
            <div key={name}>
              {/* Label for accessibility: associates label with input by htmlFor/id */}
              <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>

              {/* Text input bound to formData state */}
              <input
                type="text"
                id={name}          // id matches htmlFor on label
                name={name}        // name attribute used in handleChange
                value={formData[name]} // Controlled input value from state
                onChange={handleChange} // Update state on user input
                required          // Field must be filled out before submit
                className="mt-1 w-full p-2 border rounded focus:ring-2 focus:ring-green-400"
              />
            </div>
          ))}

          {/* Submit button spans both columns on medium+ screens */}
          <div className="col-span-1 md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
