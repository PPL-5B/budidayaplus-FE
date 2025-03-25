import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactForm from '@/components/contact-us/WhatsAppContactForm';
import { getUser } from '@/lib/auth';

// Mock the auth module
jest.mock('@/lib/auth', () => ({
  getUser: jest.fn()
}));

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true
});

describe('ContactForm', () => {
  const mockSetIsSubmitted = jest.fn();
  const mockUser = {
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '1234567890'
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
   
    // Setup default mock for getUser
    (getUser as jest.Mock).mockResolvedValue(mockUser);
  });

  it('renders the form with user data', async () => {
    render(<ContactForm setIsSubmitted={mockSetIsSubmitted} />);
    // Wait for user data to load
    await waitFor(() => {
      const nameInput = screen.getByDisplayValue(`${mockUser.first_name} ${mockUser.last_name}`);
      const phoneInput = screen.getByDisplayValue(mockUser.phone_number);
     
      expect(nameInput).toBeInTheDocument();
      expect(phoneInput).toBeInTheDocument();
    });
  });

  it('submits the form and opens WhatsApp', async () => {
    render(<ContactForm setIsSubmitted={mockSetIsSubmitted} />);
    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockUser.first_name} ${mockUser.last_name}`)).toBeInTheDocument();
    });
    // Find and fill the message textarea
    const messageTextarea = screen.getByPlaceholderText('Tulis pesan Anda di sini');
    fireEvent.change(messageTextarea, { target: { value: 'Test message' } });
    // Submit the form
    const submitButton = screen.getByText('Kirim Pesan');
    fireEvent.click(submitButton);
    // Wait for form submission and check expectations
    await waitFor(() => {
      // Check that window.open was called with the correct WhatsApp URL
      expect(mockWindowOpen).toHaveBeenCalledWith(
        expect.stringContaining('https://wa.me/6281287998495?text='),
        '_blank'
      );
      // Check that setIsSubmitted was called
      expect(mockSetIsSubmitted).toHaveBeenCalledWith(true);
      // Check for success message
      expect(screen.getByText('Terima kasih! Silakan lanjutkan percakapan di WhatsApp.')).toBeInTheDocument();
    });
  });

  it('handles user data loading error', async () => {
    // Mock getUser to throw an error
    (getUser as jest.Mock).mockRejectedValue(new Error('Failed to load user'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<ContactForm />);
    // Wait for error to be logged
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load user data:',
        expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  });

  it('displays error when user data is not available during submission', async () => {
    // Mock getUser to return null
    (getUser as jest.Mock).mockResolvedValue(null);
  
    render(<ContactForm />);
  
    // Wait for the form to render
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Tulis pesan Anda di sini')).toBeInTheDocument();
    });
    
    // Fill in the message
    const messageTextarea = screen.getByPlaceholderText('Tulis pesan Anda di sini');
    fireEvent.change(messageTextarea, { target: { value: 'Test message' } });
  
    // Submit the form
    const submitButton = screen.getByText('Kirim Pesan');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
        expect(screen.getByText('Data pengguna tidak tersedia. Silakan coba lagi nanti')).toBeInTheDocument();
      });
    
    
    expect(mockWindowOpen).not.toHaveBeenCalled();
});

  it('handles message validation error', async () => {
    render(<ContactForm />);
    // Wait for user data to load
    await waitFor(() => {
      const submitButton = screen.getByText('Kirim Pesan');
      fireEvent.click(submitButton);
    });
    // Check for message validation error
    await waitFor(() => {
      expect(screen.getByText('Pesan harus diisi')).toBeInTheDocument();
    });
  });

  it('displays general submission error message', async () => {
    // Mock window.open to throw an error
    mockWindowOpen.mockImplementation(() => {
      throw new Error('Submission error');
    });

    render(<ContactForm />);

    // Wait for user data to load
    await waitFor(() => {
      const messageTextarea = screen.getByPlaceholderText('Tulis pesan Anda di sini');
      fireEvent.change(messageTextarea, { target: { value: 'Test message' } });
    });

    // Submit the form
    const submitButton = screen.getByText('Kirim Pesan');
    fireEvent.click(submitButton);

    // Check for general submission error message
    await waitFor(() => {
      expect(screen.getByText('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.')).toBeInTheDocument();
    });
  });
});