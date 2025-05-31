import React from 'react';
import { useSelector, useDispatch } from 'react-redux';  // For accessing Redux state and dispatching actions
import { Link, useNavigate, Outlet } from 'react-router-dom';  // For routing and nested routes rendering
import { logout } from '../store/userSlice';  // Redux action to clear user info on logout
import { LogOut, User } from 'lucide-react';  // Icon components for logout and user profile

const DashboardLayout = () => {
  const dispatch = useDispatch();        // To dispatch Redux actions
  const navigate = useNavigate();        // For programmatic navigation (redirect)
  
  // Get the logged-in user's name from Redux store; use optional chaining in case user is null/undefined
  const user = useSelector((state) => state.user.user?.name);
  
  console.log(user, 'user');  // Debug print to check user value in console

  // Function to handle logout
  const handleLogout = () => {
    dispatch(logout());                  // Clear user info from Redux store
    localStorage.removeItem('token');   // Remove token from localStorage to clear session
    navigate('/');                      // Redirect user to homepage or login page after logout
  };

  return (
    // Outer container for entire dashboard layout
    // Full height viewport, flexbox to split sidebar and main content
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Sidebar on the left */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col gap-6 py-8">
        
        {/* User's name display or fallback to 'User' */}
        <div className="text-lg font-bold text-black-600 mb-6">
          {user || 'User'}
        </div>
        
        {/* Link to Profile page */}
        <Link
          to="/layout/profile"
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-800 transition"
        >
          {/* User icon */}
          <User className="w-5 h-5" />
          <span className="text-base">Profile</span>
        </Link>

        {/* Logout button */}
        <button
          onClick={handleLogout}  // Calls logout handler on click
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-3 rounded hover:bg-red-600 transition"
        >
          {/* Logout icon */}
          <LogOut className="w-5 h-5" />
          <span className="text-base">Logout</span>
        </button>
      </aside>

      {/* Main content area on the right */}
      <div className="flex flex-col flex-1">
        
        {/* Top navigation bar within dashboard */}
        <nav className="bg-gray-200 h-20 shadow-inner text-gray-800 font-semibold flex items-center px-6">
          <div className="text-xl">Patient Dashboard</div>
        </nav>

        {/* Main section where nested routes will render */}
        <main className="flex-1 p-6">
          {/* <Outlet> renders the matched child route component such as Service, Profile etc. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
