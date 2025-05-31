// Import necessary testing utilities and libraries
import { render } from "@testing-library/react";         // For rendering React components in a test environment
import { Provider } from "react-redux";                   // To provide Redux store to components during tests
import { BrowserRouter } from "react-router-dom";         // To provide routing context for components that use react-router
import configureStore from "redux-mock-store";            // Library to create a mock Redux store for testing
import BookAppointment from "../pages/BookAppointment";   // Component under test

// Create a mock Redux store factory with no middleware
const mockStore = configureStore([]);

// Initialize the mock store with initial state matching what the BookAppointment component expects
const store = mockStore({
  // Example slice of state for user authentication
  user: { 
    isAuthenticated: true,        // Simulate user is logged in
    user: { name: "Test User" },  // Example user data that component might consume
  },
  // You can add more slices here if the component relies on them
});

// Helper function to wrap components with all needed providers for tests
// This function makes sure the component has access to Redux store and routing context
function renderWithProviders(ui) {
  return render(
    <Provider store={store}>          {/* Provides the Redux store to the component */}
      <BrowserRouter>                 {/* Provides routing context, necessary if component uses react-router features */}
        {ui}
      </BrowserRouter>
    </Provider>
  );
}

// Test suite for the BookAppointment component
describe("BookAppointment", () => {
  // Test case to verify the component renders without throwing errors
  it("renders without crashing", () => {
    // Render the component wrapped with providers
    renderWithProviders(<BookAppointment />);
    // If no errors occur during render, this test passes
  });
});
