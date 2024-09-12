import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AuthProvider, useAuth } from '../context/authcontext';
import LoginLayout from './LoginLayout';

// Create a mock adapter for axios
const mock = new MockAdapter(axios);

describe('LoginLayout', () => {
  beforeEach(() => {
    // Clear local storage before each test
    localStorage.clear();
  });

  test('renders login form and handles login successfully', async () => {
    // Mock successful login response
    mock.onPost('http://localhost:3000/api/auth/login').reply(200, {
      token: 'mocked-token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
      },
    });

    // Render the component with AuthProvider
    render(
      <AuthProvider>
        <LoginLayout />
      </AuthProvider>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: 'password123' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Iniciar sesión/i));

    // Wait for redirection or token storage (depends on actual implementation)
    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('mocked-token');
      expect(localStorage.getItem('user')).toEqual(
        JSON.stringify({
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        })
      );
      // Check if redirection occurred
      expect(window.location.href).toBe('http://localhost/principal');
    });
  });

  test('shows error message on login failure', async () => {
    // Mock login error response
    mock.onPost('http://localhost:3000/api/auth/login').reply(401, {
      message: 'Invalid email or password',
    });

    // Render the component with AuthProvider
    render(
      <AuthProvider>
        <LoginLayout />
      </AuthProvider>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: 'wrongpassword' },
    });

    // Submit the form
    fireEvent.click(screen.getByText(/Iniciar sesión/i));

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Login fallido: Invalid email or password/i)).toBeInTheDocument();
    });
  });
});
