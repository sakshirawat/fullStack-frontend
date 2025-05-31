import React from 'react';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from '../components/ProtectedRoute';
import { MemoryRouter } from 'react-router-dom';

describe('ProtectedRoute', () => {
  // A simple test component to be rendered inside ProtectedRoute for testing
  const TestComponent = () => <div>Protected Content</div>;

  // Clear localStorage after each test to avoid interference between tests
  afterEach(() => {
    localStorage.clear();
  });

  // Test case: When a token exists in localStorage,
  // the ProtectedRoute should render its children (allow access)
  test('renders children when token exists', () => {
    // Set a fake token in localStorage to simulate authenticated user
    localStorage.setItem('token', 'fake-token');

    // Render ProtectedRoute wrapped inside MemoryRouter (required for routing context)
    render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Expect that the protected content (children) is rendered in the document
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  // Test case: When no token exists in localStorage,
  // the ProtectedRoute should redirect to the /signin route
  test('redirects to /signin when token is missing', () => {
    // Remove token from localStorage to simulate unauthenticated user
    localStorage.removeItem('token');

    // Render ProtectedRoute with test component children inside MemoryRouter
    const { container } = render(
      <MemoryRouter>
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Explanation:
    // ProtectedRoute uses <Navigate to="/signin" /> to redirect unauthenticated users.
    // <Navigate /> doesn't render visible content, so children are not rendered.
    // React Testing Library renders <Navigate /> as an empty <div>, resulting in an empty container.
    //
    // So we assert that container.innerHTML is empty, confirming redirect happened
    // (children were not rendered)
    expect(container.innerHTML).toBe('');
  });
});
