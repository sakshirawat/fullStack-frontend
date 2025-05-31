import React, { useState, useEffect } from 'react';
import image from '../assets/image1.jpg';  // Placeholder image for doctors or appointment cards

const MyAppointments = () => {
  // State to hold all fetched appointments
  const [appointments, setAppointments] = useState([]);

  // State to hold the currently selected year filter; default is 'all' (no filter)
  const [selectedYear, setSelectedYear] = useState('all');

  // Retrieve auth token from localStorage for API requests
  const token = localStorage.getItem('token');

  // Fetch appointments from the backend when component mounts or token changes
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Fetch API call with authorization header
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/appoint/myAppointments`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Bearer token for authentication
          },
        });

        // Parse JSON response
        const data = await res.json();

        // If response is OK, set appointments state with fetched data
        if (res.ok) {
          setAppointments(data.appointments);
        } else {
          // Log error message if response not OK
          console.error('Error fetching appointments:', data.message || data);
        }
      } catch (err) {
        // Log network or fetch errors
        console.error('Network error fetching appointments:', err);
      }
    };

    fetchAppointments();
  }, [token]);

  // Extract unique years from appointment dates for the year filter dropdown
  // Steps:
  // - Map each appointment to a Date object (use dateTime if available, fallback to date)
  // - Filter out invalid dates (NaN)
  // - Extract the year from each valid date
  // - Convert to Set to keep unique years
  // - Convert back to Array and sort ascending
  const years = Array.from(
    new Set(
      appointments
        .map(a => new Date(a.dateTime || a.date))  // Convert appointment date string to Date object
        .filter(date => !isNaN(date))              // Filter out invalid dates
        .map(date => date.getFullYear())            // Extract year number
    )
  ).sort((a, b) => a - b);

  // Filter appointments based on the selected year filter
  // If 'all' is selected, show all appointments
  // Otherwise, filter appointments to only those matching the selected year
  const filteredAppointments =
    selectedYear === 'all'
      ? appointments
      : appointments.filter(a => {
          const dateObj = new Date(a.dateTime || a.date);
          return !isNaN(dateObj) && dateObj.getFullYear().toString() === selectedYear;
        });

  // Handler function to join an appointment by sending a POST request to backend
  const handleJoin = async (time, doctorId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/appoint/joinAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',          // Set content type to JSON
          Authorization: `Bearer ${token}`,             // Auth header with token
        },
        body: JSON.stringify({
          time,        // Appointment time to join
          doctorId,    // Doctor's ID for the appointment
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Successfully joined the appointment!');
        // Optionally, refresh appointments or update UI here
      } else {
        alert(data.message || 'Failed to join appointment');
      }
    } catch (err) {
      console.error('Join error:', err);
      alert('Error joining appointment');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-8">
      {/* Year dropdown filter */}
      <div className="mb-6">
        <label htmlFor="yearFilter" className="block mb-2 font-semibold text-gray-700">
          Sort by Year
        </label>
        <select
          id="yearFilter"
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}  // Update selected year state on change
          className="block w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {/* Default option to show all appointments regardless of year */}
          <option value="all">All Years</option>
          {/* Dynamically generate options from extracted years */}
          {years.map(year => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Appointment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAppointments.map(({ _id, doctorId, doctorName, doctorDepartment, dateTime, time, date }) => {
          // Prefer dateTime if available, fallback to date for the appointment date
          const appointmentDate = dateTime ? new Date(dateTime) : new Date(date);

          // Get today's date at midnight for comparison (only date part)
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Check if the appointment date is in the past (before today)
          const isPast = appointmentDate < today;

          return (
            <div
              key={_id}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
            >
              {/* Doctor image - placeholder */}
              <img
                src={image}
                alt={`Dr. ${doctorName}`}  // Alt text for accessibility
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                {/* Doctor's Name */}
                <h3 className="text-xl font-semibold mb-1 text-blue-700">{doctorName}</h3>

                {/* Doctor's Department */}
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Department:</span> {doctorDepartment}
                </p>

                {/* Appointment Date formatted as DD/MM/YYYY */}
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span>{' '}
                  {appointmentDate.toLocaleDateString('en-GB')}
                </p>

                {/* Appointment Time */}
                <p className="text-gray-600">
                  <span className="font-medium">Time:</span>{' '}
                  {time || appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>

                {/* Join button: disabled if appointment is in the past */}
                <button
                  className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isPast
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  onClick={() =>
                    handleJoin(
                      time || appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      doctorId
                    )
                  }
                  disabled={isPast} // Disable button if appointment is past
                >
                  Join
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyAppointments;
