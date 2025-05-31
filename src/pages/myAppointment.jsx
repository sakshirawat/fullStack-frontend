import React, { useState, useEffect } from 'react';
import image from '../assets/image1.jpg'; // Placeholder image

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);           // All appointments
  const [selectedYear, setSelectedYear] = useState('all');        // Year filter
  const token = localStorage.getItem('token');                    // Auth token

  // Fetch appointments on mount
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/appoint/myAppointments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setAppointments(data.appointments);
        } else {
          console.error('Error fetching appointments:', data.message || data);
        }
      } catch (err) {
        console.error('Network error fetching appointments:', err);
      }
    };

    if (token) {
      fetchAppointments();
    }
  }, [token]);

  // Extract unique years from appointments
  const years = Array.from(
    new Set(
      appointments
        .map(a => new Date(a.dateTime || a.date))
        .filter(date => !isNaN(date))
        .map(date => date.getFullYear())
    )
  ).sort((a, b) => a - b);

  // Filter appointments by year
  const filteredAppointments =
    selectedYear === 'all'
      ? appointments
      : appointments.filter(a => {
          const dateObj = new Date(a.dateTime || a.date);
          return !isNaN(dateObj) && dateObj.getFullYear().toString() === selectedYear;
        });

  // Handle "Join" button click
  const handleJoin = async (time, doctorId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/appoint/joinAppointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ time, doctorId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Successfully joined the appointment!');
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
      {/* Year Filter Dropdown */}
      <div className="mb-6">
        <label htmlFor="yearFilter" className="block mb-2 font-semibold text-gray-700">
          Sort by Year
        </label>
        <select
          id="yearFilter"
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="block w-48 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Years</option>
          {years.map(year => (
            <option key={year} value={year.toString()}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAppointments.map(({ _id, doctorId, doctorName, doctorDepartment, dateTime, time, date }) => {
          const appointmentDate = new Date(dateTime || date);

          // Get today at midnight
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Appointment date at midnight
          const appointmentMidnight = new Date(appointmentDate);
          appointmentMidnight.setHours(0, 0, 0, 0);

          const isToday = appointmentMidnight.getTime() === today.getTime();

          return (
            <div key={_id} className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
              {/* Doctor Image */}
              <img
                src={image}
                alt={`Dr. ${doctorName}`}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1 text-blue-700">{doctorName}</h3>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Department:</span> {doctorDepartment}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span>{' '}
                  {appointmentDate.toLocaleDateString('en-GB')}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Time:</span>{' '}
                  {time || appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>

                {/* Join Button */}
                <button
                  className={`mt-4 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isToday ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!isToday}
                  onClick={() => {
                    if (!isToday) {
                      alert('You can only join appointments scheduled for today.');
                      return;
                    }

                    handleJoin(
                      time || appointmentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      doctorId
                    );
                  }}
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
