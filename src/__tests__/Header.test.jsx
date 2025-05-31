// src/__tests__/Header.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';  // For rendering components and querying DOM
import Header from '../components/Header';               // Component under test
import { Provider } from 'react-redux';                   // To provide Redux store context
import { MemoryRouter } from 'react-router-dom';          // In-memory router for testing routing
import configureStore from 'redux-mock-store';            // To create a mock Redux store

// Create a mock store factory (no middleware needed)
const mockStore = configureStore([]);

describe('Header component', () => {
  let store;

  // Before each test, initialize the mock store with user set to null (no logged-in user)
  beforeEach(() => {
    store = mockStore({
      user: { user: null },  // Represents no authenticated user
    });
  });

  // Helper function to render Header component with required Redux Provider and Router context
  const renderWithProviders = (store) =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </Provider>
    );

  // Test to ensure the logo "HospitalCare" is always rendered, regardless of user state
  test('renders logo always', () => {
    renderWithProviders(store);  // Render with user not logged in
    // Expect the text "HospitalCare" (case-insensitive) to be present in the document
    expect(screen.getByText(/HospitalCare/i)).toBeInTheDocument();
  });

  // Test to check that authentication buttons (Sign In, Sign Up) show when no user is logged in
  test('renders auth buttons when no user is logged in', () => {
    renderWithProviders(store);  // Render with user = null

    // Auth buttons should be rendered as links with accessible names
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();

    // Navigation links related to authenticated users should NOT be visible
    expect(screen.queryByText(/services/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/book appointment/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/my appointment/i)).not.toBeInTheDocument();
  });

  // Test that when a user is logged in, navigation links are displayed and auth buttons are hidden
  test('renders navigation links when user is logged in', () => {
    // Update the store to simulate a logged-in user
    store = mockStore({
      user: { user: { id: '123', name: 'John' } },  // Logged-in user object
    });

    renderWithProviders(store);  // Render Header with logged-in user state

    // Expect navigation links visible for logged-in users
    expect(screen.getByText(/services/i)).toBeInTheDocument();
    expect(screen.getByText(/book appointment/i)).toBeInTheDocument();
    expect(screen.getByText(/my appointment/i)).toBeInTheDocument();

    // Authentication links should NOT be visible once user is logged in
    expect(screen.queryByRole('link', { name: /sign in/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /sign up/i })).not.toBeInTheDocument();
  });
});
