import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from '../pages/SignUp';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock the useNavigate hook from react-router-dom to control navigation during tests
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // keep other methods intact
  useNavigate: jest.fn(), // mock useNavigate specifically
}));

describe('Signup Component', () => {
  const mockNavigate = jest.fn(); // mock function to track navigation calls

  beforeEach(() => {
    jest.clearAllMocks(); // clear mocks before each test to reset call history
    useNavigate.mockReturnValue(mockNavigate); // setup useNavigate to return mockNavigate
    jest.spyOn(window, 'fetch'); // spy on global fetch to mock network requests
  });

  afterEach(() => {
    jest.restoreAllMocks(); // restore all spies and mocks after each test
  });

  // Test that all required input fields and the submit button render correctly
  test('renders all input fields and button', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  // Test that user can type into the name, email, and password input fields
  test('allows typing in inputs', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    // Simulate typing text into inputs
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'securepass' } });

    // Assert input values updated correctly
    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(passwordInput.value).toBe('securepass');
  });

  // Test successful form submission: mock fetch returns success,
  // navigation happens to '/signin'
  test('successful form submission shows success message and navigates', async () => {
    // Mock fetch to resolve with success response
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'User created successfully' }),
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Fill in form inputs
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for async submit logic to complete and assertions
    await waitFor(() => {
      // Check fetch called with correct URL and POST options including JSON body
      expect(window.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BASE_URL}/auth/signup`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Jane',
            email: 'jane@example.com',
            password: 'password123',
          }),
        })
      );

      // Assert navigation to '/signin' after successful signup
      expect(mockNavigate).toHaveBeenCalledWith('/signin');
    });
  });

  // Test failed signup: mock fetch returns failure response,
  // error message is displayed, and navigation does NOT happen
  test('shows error message on failed signup', async () => {
    // Mock fetch to resolve with failure response and error message
    window.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Email already exists' }),
    });

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Fill in form inputs
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for the error message to appear in the DOM
    const errorMessage = await screen.findByText(/email already exists/i);

    // Assert error message is displayed
    expect(errorMessage).toBeInTheDocument();

    // Assert navigation did NOT occur on failure
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  // Test that clicking the close button navigates to home page '/'
  test('close button navigates to "/"', () => {
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Find close button by aria-label "close"
    const closeBtn = screen.getByLabelText(/close/i);

    // Simulate click on close button
    fireEvent.click(closeBtn);

    // Assert navigation to home page was called
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  // Test network error during fetch (e.g., no connection)
  test('shows network error on fetch failure', async () => {
    // Mock fetch to reject (simulate network failure)
    window.fetch.mockRejectedValueOnce(new Error('Failed to connect'));

    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );

    // Fill in form inputs
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for network error message to appear
    const errorMessage = await screen.findByText(/network error/i);

    // Assert network error message is shown
    expect(errorMessage).toBeInTheDocument();
  });
});
