import React from 'react';
import { render, screen } from '@testing-library/react';  // For rendering and querying DOM
import Home from '../pages/Home';                         // Component under test
import { Provider } from 'react-redux';                   // To provide Redux store context
import configureStore from 'redux-mock-store';            // To create a mock Redux store
import * as userSlice from '../store/userSlice';          // To spy on the logout action creator

// Create a mock store factory without middleware
const mockStore = configureStore();

describe('Home component', () => {
  let store;
  let logoutSpy;

  // Setup before each test
  beforeEach(() => {
    // Initialize mock store with an empty initial state (could be expanded if needed)
    store = mockStore({});

    // Spy on the logout action creator imported from userSlice
    // We mock its return value to an action object with type 'user/logout'
    logoutSpy = jest.spyOn(userSlice, 'logout').mockReturnValue({ type: 'user/logout' });

    // Replace the store's dispatch function with a Jest mock function to track calls
    store.dispatch = jest.fn();
  });

  // Clear all mocks after each test to avoid interference between tests
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to render the component with Redux Provider wrapping it
  // This makes the Redux store available to the component during testing
  function renderWithProvider(ui) {
    return render(<Provider store={store}>{ui}</Provider>);
  }

  // Test to check that the Home component renders welcome message and description correctly
  test('renders welcome message and description', () => {
    // Render the Home component wrapped with the mocked Redux Provider
    renderWithProvider(<Home />);

    // Assert that the welcome text is rendered (case-insensitive)
    expect(screen.getByText(/Welcome to HospitalCare/i)).toBeInTheDocument();

    // Assert that the description text is rendered
    expect(screen.getByText(/Your trusted partner for quality healthcare services/i)).toBeInTheDocument();
  });

  // Test to verify that the logout action is dispatched when Home component mounts
  test('dispatches logout on mount', () => {
    // Render the Home component wrapped with the mocked Redux Provider
    renderWithProvider(<Home />);

    // Expect that the logout action creator was called once on mount
    expect(logoutSpy).toHaveBeenCalledTimes(1);

    // Expect that the store's dispatch method was called with the logout action object
    expect(store.dispatch).toHaveBeenCalledWith({ type: 'user/logout' });
  });
});
