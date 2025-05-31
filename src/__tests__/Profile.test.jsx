import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Profile from '../pages/Profile';

// Setup global mocks before each test run
beforeEach(() => {
  // Spy on window.fetch to mock network requests
  jest.spyOn(window, 'fetch');
  // Mock window.alert to avoid real alert popups during tests and to verify calls
  jest.spyOn(window, 'alert').mockImplementation(() => {});
  // Set a mock token in localStorage (if Profile component depends on token)
  localStorage.setItem('token', 'mock-token');
});

// Clean up mocks and localStorage after each test to prevent leakage between tests
afterEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});

describe('Profile Component', () => {
  // Sample mock profile data to be returned by fetch calls
  const mockProfileData = {
    name: 'John Doe',
    phone: '1234567890',
    email: 'john@example.com',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipcode: '90001',
  };

  // Test that Profile component fetches profile data on mount and renders inputs disabled initially
  test('renders inputs disabled initially and fetches profile data', async () => {
    // Mock fetch to resolve with mock profile data on first call (data loading)
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData,
    });

    render(<Profile />);

    // Wait for profile data to load and for input to display the fetched name
    await waitFor(() => {
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });

    // Check that key input fields are disabled initially (read-only mode)
    expect(screen.getByLabelText(/name/i)).toBeDisabled();
    expect(screen.getByLabelText(/phone/i)).toBeDisabled();
    expect(screen.getByLabelText(/email/i)).toBeDisabled();
  });

  // Test that clicking the "Edit" button enables input fields for editing
  test('enables inputs when Edit button is clicked', async () => {
    // Mock fetch to resolve profile data
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData,
    });

    render(<Profile />);

    // Wait for data to load and input to be rendered
    await waitFor(() => screen.getByDisplayValue('John Doe'));

    // Get the Edit button and simulate a click event
    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    // Verify that inputs are now enabled and editable
    expect(screen.getByLabelText(/name/i)).not.toBeDisabled();
    expect(screen.getByLabelText(/phone/i)).not.toBeDisabled();
  });

  // Test that changes to inputs are accepted and profile saves successfully
  test('changes input values and saves profile successfully', async () => {
    // First fetch call returns existing profile data
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData,
    });

    // Second fetch call simulates a successful profile save response
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Profile saved' }),
    });

    render(<Profile />);
    // Wait for initial data to load
    await waitFor(() => screen.getByDisplayValue('John Doe'));

    // Click Edit to enable input fields
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Change the name input value to a new name
    const nameInput = screen.getByLabelText(/name/i);
    fireEvent.change(nameInput, { target: { value: 'Jane Smith' } });
    expect(nameInput.value).toBe('Jane Smith'); // Confirm the input value updated

    // Click Save button to submit updated profile
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Wait for save to complete and assertions to be met
    await waitFor(() => {
      // Confirm success alert is shown after saving
      expect(window.alert).toHaveBeenCalledWith('Profile saved!');
      // Inputs should be disabled again after save (back to read-only mode)
      expect(nameInput).toBeDisabled();
    });
  });

  // Test the behavior when saving the profile fails
  test('shows alert on save failure', async () => {
    // Mock fetch to resolve profile data initially
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockProfileData,
    });

    // Mock fetch for saving profile to fail with non-ok response
    window.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Save failed' }),
    });

    render(<Profile />);
    // Wait for profile data to load
    await waitFor(() => screen.getByDisplayValue('John Doe'));

    // Enable inputs by clicking Edit
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    // Click Save without changing inputs (or after change, doesn't matter here)
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Wait for save response and error handling
    await waitFor(() => {
      // Expect alert to notify about save failure
      expect(window.alert).toHaveBeenCalledWith('Save failed');
    });
  });
});
