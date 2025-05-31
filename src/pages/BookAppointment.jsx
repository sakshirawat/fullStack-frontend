import React, { useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux'; // To access redux store state (e.g., user info)
import { useNavigate } from 'react-router-dom'; // To programmatically navigate routes
import { appointmentReducer, initialState } from '../reducers/appointmentReducer'; // Reducer and initial state for managing form state

const BookAppointment = () => {
  // Get JWT token from localStorage for authenticated API calls
  const token = localStorage.getItem('token');

  // Get logged-in user ID from redux state
  const userId = useSelector((state) => state.user.user.id);

  // Hook for programmatic navigation after booking appointment
  const navigate = useNavigate();

  // useReducer to manage local state of appointment form and related data
  const [state, dispatch] = useReducer(appointmentReducer, initialState);

  // Destructure state properties for easier use in JSX and handlers
  const {
    doctors,
    departments,
    selectedDepartment,
    selectedDoctorId,
    selectedDoctor,
    availableSlots,
    selectedDate,
    selectedTime,
    comments,
    reportFile,
  } = state;

  // Fetch list of doctors on component mount (or when token changes)
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/appoint/getDoctors`, {
          headers: { Authorization: `Bearer ${token}` }, // Auth header with token
        });
        const data = await res.json();
        if (res.ok) {
          // Dispatch action to store doctors list in state
          dispatch({ type: 'SET_DOCTORS', payload: data });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchDoctors();
  }, [token]); // Runs once or when token changes

  // Fetch available slots for the selected doctor whenever selectedDoctorId changes
  useEffect(() => {
    if (!selectedDoctorId) return; // If no doctor selected, skip

    const fetchSlots = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/appoint/getAvailableAppointment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Auth header with token
          },
          body: JSON.stringify({ doctorId: selectedDoctorId }), // Send selected doctor ID
        });
        const data = await res.json();
        if (res.ok) {
          // Update available slots in state
          dispatch({ type: 'SET_AVAILABLE_SLOTS', payload: data.availableSlots });
          // Find selected doctor details from doctors array
          const doc = doctors.find(d => d._id === selectedDoctorId);
          dispatch({ type: 'SET_SELECTED_DOCTOR', payload: doc });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSlots();
  }, [selectedDoctorId, token, doctors]); // Run when selectedDoctorId, token, or doctors change

  // Handler for form submission to book appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation to ensure required fields are selected
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert("Please select all required fields.");
      return;
    }

    // Use FormData to handle file upload with other data
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('doctorId', selectedDoctor._id);
    formData.append('doctorName', selectedDoctor.name);
    formData.append('doctorDepartment', selectedDoctor.department);
    formData.append('time', selectedTime);
    formData.append('date', selectedDate);
    formData.append('comments', comments);
    if (reportFile) formData.append('report', reportFile); // Attach file if any

    try {
      // POST request to backend to book appointment
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/appoint/bookAppointment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }, // Auth header with token
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        alert("Appointment booked successfully.");
        dispatch({ type: 'RESET_FORM' }); // Reset form state
        navigate('/myAppointments'); // Redirect to appointments page
      } else {
        alert(data.message || 'Failed to book appointment');
      }
    } catch (err) {
      console.error(err);
      alert('Error booking appointment.');
    }
  };

  // Filter doctors based on selected department for doctor dropdown
  const filteredDoctors = doctors.filter(doc => doc.department === selectedDepartment);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Book Appointment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Department Selection */}
        <div>
          <label htmlFor="department" className="block mb-1 font-medium">Department</label>
          <select
            id="department"
            value={selectedDepartment}
            onChange={(e) => dispatch({ type: 'SET_DEPARTMENT', payload: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Doctor Selection (shown only if department is selected) */}
        {selectedDepartment && (
          <div>
            <label htmlFor="doctor" className="block mb-1 font-medium">Doctor</label>
            <select
              id="doctor"
              value={selectedDoctorId}
              onChange={(e) => dispatch({ type: 'SET_DOCTOR_ID', payload: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">-- Select Doctor --</option>
              {filteredDoctors.map(doc => (
                <option key={doc._id} value={doc._id}>{doc.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Date Picker (shown only if doctor is selected) */}
        {selectedDoctorId && (
          <div>
            <label htmlFor="date" className="block mb-1 font-medium">Select Date</label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              onChange={(e) => dispatch({ type: 'SET_DATE', payload: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        )}

        {/* Time Slots Dropdown (shown only if date is selected) */}
        {selectedDate && (
          <div>
            <label htmlFor="time" className="block mb-1 font-medium">Select Time</label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => dispatch({ type: 'SET_TIME', payload: e.target.value })}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">-- Select Slot --</option>
              {availableSlots
                .filter((slot) => !slot.isBooked) // Show only unbooked slots
                .map((slot) => {
                  // Disable slot if date/time is in past
                  const slotDateTime = new Date(`${selectedDate}T${slot.time}`);
                  const now = new Date();
                  const isDisabled = slotDateTime <= now;

                  return (
                    <option key={slot._id} value={slot._id} disabled={isDisabled}>
                      {slot.time} {isDisabled ? "(Unavailable)" : ""}
                    </option>
                  );
                })}
            </select>
          </div>
        )}

        {/* Optional Comments Textarea */}
        <div>
          <label htmlFor="comments" className="block mb-1 font-medium">Comments</label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => dispatch({ type: 'SET_COMMENTS', payload: e.target.value })}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        {/* File Upload Input for reports */}
        <div>
          <label htmlFor="report" className="block mb-1 font-medium">Upload Report</label>
          <input
            id="report"
            type="file"
            onChange={(e) => dispatch({ type: 'SET_REPORT', payload: e.target.files[0] })}
            className="w-full"
            accept=".pdf,.doc,.docx,image/*" // Accept PDF, Word docs, and images
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Book Appointment
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
