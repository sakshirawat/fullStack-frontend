Healthcare Appointment Facility - Frontend
Overview
This is the Frontend part of the Healthcare Appointment Facility application. It allows users to:

View available doctors and services

Browse available appointment slots by doctor

Book appointments with doctors on specific dates and times

Upload medical reports (optional) during booking

View and manage their existing appointments after login

The frontend is built using React.js and communicates with the backend APIs to perform all appointment-related operations.

Features
Doctor Listing: View all doctors with their departments and details.

Available Slots: Fetch and display available time slots for each doctor.

Appointment Booking: Book an appointment by selecting date, time, doctor, and adding optional comments and reports.

User Authentication: Secure login system to identify users and show their appointments.

User Appointments: View past and upcoming appointments, including appointment details.

Input Validation: Validate dates and prevent booking on invalid dates (e.g., past dates, Sundays).

Report Upload: Optionally upload reports while booking appointments.

Responsive UI: Works well on both desktop and mobile devices.

Technologies Used
React.js

Redux 

React Router

Axios / Fetch API for backend communication

Tailwind CSS / Bootstrap / CSS Modules (depending on your styling)

Form validation libraries (e.g., Formik, Yup) - if used

