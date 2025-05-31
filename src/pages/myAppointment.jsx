import React, { useState, useEffect } from 'react';
import image from '../assets/image1.jpg';  // Placeholder image for doctors or appointment cards

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/appoint/myAppointments`, {
          headers: { Authorization: `Bearer ${token}` },
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
    fetchAppointments();
  }, [token]);

  const years = Array.from(
    new Set(
      appointments
        .map(a => new Date(a.dateTime || a.date))
        .filter(date => !isNaN(date))
        .map(date => date.getFullYear())
    )
  ).sort((a, b) => a - b);

  const filteredAppointments =
    selectedYear === 'all'
      ? appointments
      : appointments.filter(a => {
          const dateObj = new Date(a.dateTime || a.date);
          return !isNaN(dateObj) && dateObj.getFullYear().toString() === selectedYear;
        });

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAppointments.map(({ _id, doctorId, doctorName, doctorDepartment, dateTime, time, date }) => {
          const appointmentDate = dateTime ? new Date(dateTime) : new Date(date);

          // Normalize dates to midnight for date-only comparison
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const appointmentDateOnly = new Date(appointmentDate);
          appointmentDateOnly.setHours(0, 0, 0, 0);

          const isPast = appointmentDateOnly < today;
          const isToday = appointmentDateOnly.getTime() === today.getTime();

          return (
            <div
              key={_id}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
            >
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

                <button
                  className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                    isPast
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  }`}
                  disabled={isPast}
                  onClick={() => {
                    if (!isToday && !isPast) {
                      alert("You can't join this appointment before its scheduled date.");
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
