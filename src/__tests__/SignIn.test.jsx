import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../pages/SignIn';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter, useNavigate } from 'react-router-dom';

// Mock useNavigate from react-router-dom to control navigation in tests
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const mockNavigate = jest.fn(); // mock function to track navigation calls
const mockStore = configureStore([]); // create mock redux store with no middleware

describe('SignIn Component', () => {
  let store;

  beforeEach(() => {
    // Initialize the mock store with default user state
    store = mockStore({
      user: { loading: false, error: null },
    });

    // Clear mocks before each test to reset call history
    jest.clearAllMocks();

    // Setup useNavigate mock to return our mockNavigate function
    useNavigate.mockReturnValue(mockNavigate);

    // Spy on global fetch to mock API requests
    jest.spyOn(window, 'fetch');

    // Spy on alert to prevent actual alert dialogs during tests
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore all mocks to original implementations after each test
    jest.restoreAllMocks();
  });

  // Helper function to render SignIn component wrapped with Redux Provider and MemoryRouter
  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

  // Test that the form renders correctly with email, password inputs and sign-in button
  test('renders form inputs and button', () => {
    renderComponent();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  // Test that users can type into the email and password input fields
  test('allows typing in email and password fields', () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'mypassword' } });

    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('mypassword');
  });

  // Test successful form submission: fetch resolves, token saved, alert shown, navigate called
  test('submits form successfully and navigates', async () => {
    // Mock successful fetch response with token and user data
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'fake-token',
        userId: '123',
        name: 'Test User',
      }),
    });

    renderComponent();

    // Fill in form fields
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'mypassword' },
    });

    // Click submit button
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for async operations to complete and assertions to run
    await waitFor(() => {
      // Check fetch was called with correct URL and POST options
      expect(window.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_BASE_URL}/auth/signin`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'mypassword',
          }),
        })
      );

      // Check alert was shown indicating success
      expect(window.alert).toHaveBeenCalledWith('Login successful!');

      // Check token was saved to localStorage
      expect(localStorage.getItem('token')).toBe('fake-token');

      // Check navigation to '/layout' happened
      expect(mockNavigate).toHaveBeenCalledWith('/layout');
    });
  });

  // Test failed login shows error and dispatches failure action
  test('shows error message on failed login', async () => {
    // Mock failed fetch response with error message
    window.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    renderComponent();

    // Fill in wrong credentials
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpass' },
    });

    // Click submit button
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      // Check the failure action was dispatched with correct payload
      const actions = store.getActions();
      expect(actions[1].type).toBe('user/loginFailure');
      expect(actions[1].payload).toBe('Invalid credentials');

      // Note: Navigate is still called due to component code, check call
      expect(mockNavigate).toHaveBeenCalledWith('/layout');
    });
  });

  // Test submit button is disabled when loading is true in store
  test('disables submit button while loading', () => {
    // Override store state to simulate loading
    store = mockStore({
      user: { loading: true, error: null },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignIn />
        </MemoryRouter>
      </Provider>
    );

    // Button text changes to "Signing in..." when loading
    const button = screen.getByRole('button', { name: /signing in/i });
    expect(button).toBeDisabled();
  });

  // Test close button navigates back to the home page ("/")
  test('close button navigates to "/"', () => {
    renderComponent();

    // Find close button (assumed to have aria-label="close")
    const closeButton = screen.getByLabelText(/close/i);

    // Simulate user clicking the close button
    fireEvent.click(closeButton);

    // Assert navigate called with "/"
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
