import './App.css';
import { Routes, Route } from 'react-router-dom';

// Import reusable components
import Header from './components/Header';
import Footer from './components/Footer';

// Import page components for routing
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Service from './pages/Service';
import Profile from './pages/Profile';
import MyAppointments from './pages/myAppointment';
import BookAppointment from './pages/BookAppointment';

// Import layout and route protection components
import DashboardLayout from './Layout/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      {/* Site-wide header visible on all pages */}
      <Header />

      {/* React Router v6 Routes configuration */}
      <Routes>
        {/* Public route: Home page */}
        <Route path="/" element={<Home />} />

        {/* Public route: Sign In page */}
        <Route path="/signin" element={<SignIn />} />

        {/* Public route: Sign Up page */}
        <Route path="/signup" element={<SignUp />} />

        {/* Protected route: Dashboard layout with nested routes */}
        <Route
          path="/layout"
          element={
            // ProtectedRoute component checks if user is authenticated
            // If not, it redirects to sign in or other fallback page
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes under /layout */}

          {/* Service page: /layout/services */}
          <Route path="services" element={<Service />} />

          {/* User profile page: /layout/profile */}
          <Route path="profile" element={<Profile />} />

          {/* User's appointments page: /layout/myAppointments */}
          <Route path="myAppointments" element={<MyAppointments />} />

          {/* Page to book new appointments: /layout/bookAppointments */}
          <Route path="bookAppointments" element={<BookAppointment />} />
        </Route>
      </Routes>

      {/* Site-wide footer visible on all pages */}
      <Footer />
    </>
  );
}

export default App;
