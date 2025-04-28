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

// Mock window.location.href
delete (window as any).location;
(window as any).location = { href: '' };

describe('ContactForm', () => {
  const mockSetIsSubmitted = jest.fn();
  const mockSetIsModalOpen = jest.fn();
  const mockUser = {
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '1234567890'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (getUser as jest.Mock).mockResolvedValue(mockUser);
  });

  it('renders the form with user data', async () => {
    render(<ContactForm setIsSubmitted={mockSetIsSubmitted} />);
    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockUser.first_name} ${mockUser.last_name}`)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockUser.phone_number)).toBeInTheDocument();
    });
  });

  it('handles user data loading error', async () => {
    (getUser as jest.Mock).mockRejectedValue(new Error('Failed to load user'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<ContactForm />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load user data:',
        expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  });

  it('submits form successfully and closes modal if setIsModalOpen provided', async () => {
    render(<ContactForm setIsSubmitted={mockSetIsSubmitted} setIsModalOpen={mockSetIsModalOpen} />);
    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockUser.first_name} ${mockUser.last_name}`)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Tulis pesan Anda di sini'), {
      target: { value: 'Test message' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      expect(mockSetIsSubmitted).toHaveBeenCalledWith(true);
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });
  });

  it('ensures the form doesn’t submit if the message is empty', async () => {
    render(<ContactForm setIsSubmitted={mockSetIsSubmitted} />);
    fireEvent.change(screen.getByPlaceholderText('Tulis pesan Anda di sini'), {
      target: { value: '' }, // Empty message for testing
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockWindowOpen).not.toHaveBeenCalled(); // Ensure window.open isn't called
    });
  });

  it('handles errors during form submission', async () => {
    // Restore user data
    (getUser as jest.Mock).mockResolvedValue(mockUser);
    
    // Mock window.open to throw an error
    const originalWindowOpen = window.open;
    window.open = jest.fn().mockImplementation(() => {
      throw new Error('Failed to open window');
    });
    
    // Mock console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ContactForm setIsSubmitted={mockSetIsSubmitted} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockUser.first_name} ${mockUser.last_name}`)).toBeInTheDocument();
    });
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Tulis pesan Anda di sini'), {
      target: { value: 'Test message' },
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));
    
    // Check error message and console.error call
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
      expect(consoleSpy).toHaveBeenCalledWith('Gagal mengirim pesan:', expect.any(Error));
    });
    
    // Restore mocks
    window.open = originalWindowOpen;
    consoleSpy.mockRestore();
  });

  it('redirects to profile page when back button is clicked and setIsModalOpen is not provided', async () => {
    // Setup user data
    (getUser as jest.Mock).mockResolvedValue(mockUser);
    
    render(<ContactForm />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockUser.first_name} ${mockUser.last_name}`)).toBeInTheDocument();
    });
    
    // Find and click the back button
    const backButton = screen.getByRole('button', { name: '' }); // The back button doesn't have text
    fireEvent.click(backButton);
    
    // Check that window.location.href was set correctly
    await waitFor(() => {
      expect(window.location.href).toBe(`/profile/${mockUser.phone_number}`);
    });
  });
  it('renders the form with user data', async () => {
    render(<ContactForm setIsSubmitted={mockSetIsSubmitted} />);
    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockUser.first_name} ${mockUser.last_name}`)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockUser.phone_number)).toBeInTheDocument();
    });
  });

  it('submits form successfully and closes modal if setIsModalOpen provided', async () => {
    render(<ContactForm setIsSubmitted={mockSetIsSubmitted} setIsModalOpen={mockSetIsModalOpen} />);
    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockUser.first_name} ${mockUser.last_name}`)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Tulis pesan Anda di sini'), {
      target: { value: 'Test message' },
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockWindowOpen).toHaveBeenCalledTimes(1);
      expect(mockSetIsSubmitted).toHaveBeenCalledWith(true);
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });
  });

  it('redirects to profile page when back button is clicked and setIsModalOpen is not provided', async () => {
    render(<ContactForm />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockUser.first_name} ${mockUser.last_name}`)).toBeInTheDocument();
    });
    
    // Find and click the back button
    const backButton = screen.getByRole('button', { name: '' }); // The back button doesn't have text
    fireEvent.click(backButton);
    
    // Check that window.location.href was set correctly
    await waitFor(() => {
      expect(window.location.href).toBe(`/profile/${mockUser.phone_number}`);
    });
  });

  it('closes the modal and redirects to profile page when back button is clicked and setIsModalOpen is provided', async () => {
    render(<ContactForm setIsModalOpen={mockSetIsModalOpen} setIsSubmitted={mockSetIsSubmitted} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockUser.first_name} ${mockUser.last_name}`)).toBeInTheDocument();
    });

    // Find and click the back button
    const backButton = screen.getByRole('button', { name: '' });
    fireEvent.click(backButton);

    // Check that the modal is closed
    await waitFor(() => {
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });

    // Check that window.location.href is set to profile page
    expect(window.location.href).toBe(`/profile/${mockUser.phone_number}`);
  });

  it('ensures the form doesn’t submit if the message is empty', async () => {
    render(<ContactForm setIsSubmitted={mockSetIsSubmitted} />);
    fireEvent.change(screen.getByPlaceholderText('Tulis pesan Anda di sini'), {
      target: { value: '' }, // Empty message for testing
    });

    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockWindowOpen).not.toHaveBeenCalled(); // Ensure window.open isn't called
    });
  });

  it('handles errors during form submission', async () => {
    // Restore user data
    (getUser as jest.Mock).mockResolvedValue(mockUser);
    
    // Mock window.open to throw an error
    const originalWindowOpen = window.open;
    window.open = jest.fn().mockImplementation(() => {
      throw new Error('Failed to open window');
    });
    
    // Mock console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<ContactForm setIsSubmitted={mockSetIsSubmitted} />);
    
    await waitFor(() => {
      expect(screen.getByDisplayValue(`${mockUser.first_name} ${mockUser.last_name}`)).toBeInTheDocument();
    });
    
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Tulis pesan Anda di sini'), {
      target: { value: 'Test message' },
    });
    
    // Submit the form
    fireEvent.submit(screen.getByRole('button', { name: 'Submit' }));
    
    // Check error message and console.error call
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
      expect(consoleSpy).toHaveBeenCalledWith('Gagal mengirim pesan:', expect.any(Error));
    });
    
    // Restore mocks
    window.open = originalWindowOpen;
    consoleSpy.mockRestore();
  });

 
});
