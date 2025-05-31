import React from 'react';
import { Provider } from 'react-redux';               // To provide Redux store to components during tests
import { MemoryRouter } from 'react-router-dom';       // In-memory router for test environment (no actual URL changes)
import { render, screen } from '@testing-library/react'; // Render components and query DOM elements
import userEvent from '@testing-library/user-event';   // Simulate user events (click, type, etc.)
import configureMockStore from 'redux-mock-store';     // To create a mock Redux store
import DashboardLayout from '../Layout/DashboardLayout'; // Component under test
import * as userSlice from '../store/userSlice';       // Import all exports from userSlice to spy on actions

// Create a mock Redux store factory (no middleware here)
const mockStore = configureMockStore();

describe('DashboardLayout', () => {
  let store;           // Will hold our mock store instance
  let logoutSpy;       // Spy on the logout action creator
  let removeItemSpy;   // Spy on localStorage.removeItem method

  // Setup before each test runs
  beforeEach(() => {
    // Initialize the mock store with sample state simulating a logged-in user
    store = mockStore({
      user: {
        user: { name: 'John Doe' },    // User info that DashboardLayout expects to display
        token: 'fake-token',            // Simulate authentication token presence
      },
    });

    // Spy on the logout action creator in userSlice module
    // Mock it to return a simple action object with type 'logout'
    logoutSpy = jest.spyOn(userSlice, 'logout').mockReturnValue({ type: 'logout' });

    // Spy on the localStorage removeItem method
    // This lets us verify that the token is removed on logout
    removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');
  });

  // Cleanup after each test to reset spies/mocks
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders username and buttons, handles logout click', async () => {
    // Render the component wrapped in Redux provider and router context
    render(
      <Provider store={store}>
        <MemoryRouter>
          <DashboardLayout />
        </MemoryRouter>
      </Provider>
    );

    // Check if the username is rendered correctly on the screen
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Check if a profile link is present (case-insensitive match on "profile")
    expect(screen.getByRole('link', { name: /profile/i })).toBeInTheDocument();

    // Find the logout button by role and label
    const logoutButton = screen.getByRole('button', { name: /logout/i });
    expect(logoutButton).toBeInTheDocument();

    // Simulate a user clicking the logout button
    await userEvent.click(logoutButton);

    // Expect the logout action creator to have been called when button clicked
    expect(logoutSpy).toHaveBeenCalled();

    // Expect localStorage.removeItem to be called with the key 'token' to clear auth token
    expect(removeItemSpy).toHaveBeenCalledWith('token');
  });
});
