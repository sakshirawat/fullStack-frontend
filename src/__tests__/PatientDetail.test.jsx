import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PatientForm from '../pages/PatientDetail';

// Mock the global fetch function so actual network requests are not made during tests
global.fetch = jest.fn();

describe('PatientForm', () => {
  // Reset mocks and spy on window.alert before each test to isolate tests
  beforeEach(() => {
    fetch.mockClear(); // Clear previous fetch mock calls and results
    jest.spyOn(window, 'alert').mockImplementation(() => {}); // Mock window.alert to avoid popup during tests
  });

  // Restore all mocks after each test to clean up any spying/mocking
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test that the form renders all the expected input fields and submit button
  test('renders all input fields', () => {
    render(<PatientForm />);

    // List of input labels we expect to find in the form
    const labels = [
      /First Name/i,
      /Last Name/i,
      /Phone/i,
      /Email/i,
      /Address/i,
      /City/i,
      /State/i,
      /Zipcode/i,
    ];

    // Check that each labeled input is present in the document
    labels.forEach(labelText => {
      expect(screen.getByLabelText(labelText)).toBeInTheDocument();
    });

    // Also check that the submit button is rendered
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  // Test that user input works correctly by simulating typing in an input field
  test('allows user to type in inputs', () => {
    render(<PatientForm />);

    // Get the input for First Name
    const firstNameInput = screen.getByLabelText(/First Name/i);

    // Simulate typing 'John' into the input
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    // Verify the input's value has updated
    expect(firstNameInput.value).toBe('John');
  });

  // Test that the form submits successfully when all fields are filled and submit button is clicked
  test('submits form successfully', async () => {
    // Mock the fetch call to resolve successfully with a JSON response
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    render(<PatientForm />);

    // Fill in each input field with test data by simulating user typing
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Phone/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Address/i), { target: { value: '123 Street' } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: 'Cityville' } });
    fireEvent.change(screen.getByLabelText(/State/i), { target: { value: 'Stateville' } });
    fireEvent.change(screen.getByLabelText(/Zipcode/i), { target: { value: '12345' } });

    // Click the submit button to trigger form submission
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for the fetch call to be made asynchronously
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    // Verify fetch was called with correct URL and POST request including JSON body
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:5000/addPatientDetails',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890',
          email: 'john@example.com',
          address: '123 Street',
          city: 'Cityville',
          state: 'Stateville',
          zipcode: '12345',
        }),
      })
    );

    // Verify that the success alert was shown after successful submission
    expect(window.alert).toHaveBeenCalledWith('Patient details submitted successfully!');
  });

  // Test the form's behavior when the submission fails (e.g., network error)
  test('handles submission failure', async () => {
    // Mock fetch to reject with an error, simulating failure
    fetch.mockRejectedValueOnce(new Error('Failed to submit'));

    render(<PatientForm />);

    // Click the submit button without filling fields (or with default empty fields)
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for fetch to be called
    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Verify that an alert with 'Submission failed' message is shown on error
    expect(window.alert).toHaveBeenCalledWith('Submission failed');
  });
});
