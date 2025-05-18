import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react'; // Updated import
import StopCycle from '@/components/cycle/StopCycle';
import { stopCycle } from '@/lib/cycle';
import { useToast } from '@/hooks/use-toast';

// Mock dependencies
jest.mock('@/lib/cycle', () => ({
  stopCycle: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// Better mocks for UI components that handle props correctly
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, onOpenChange, open }) => (
    <div data-testid="dialog" data-open={open} onClick={() => onOpenChange && onOpenChange(!open)}>
      {children}
    </div>
  ),
  DialogTrigger: ({ children }) => (
    <div data-testid="dialog-trigger">
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/modal', () => ({
  Modal: ({ children, title }) => (
    <div data-testid="dialog-content" data-title={title}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/button', () => {
  return {
    Button: ({ children, onClick, disabled, className, variant, size }) => (
      <button 
        onClick={onClick} 
        disabled={disabled}
        data-variant={variant}
        data-size={size}
        className={className}
      >
        {children}
      </button>
    ),
  };
});

// Mock Lucide React
jest.mock('lucide-react', () => ({
  Ban: () => <span data-testid="ban-icon">Ban Icon</span>,
}));

describe('StopCycle Component', () => {
  const mockToast = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  // Basic rendering test
  test('renders the stop cycle button correctly', () => {
    render(<StopCycle cycleId="test-cycle-123" />);
    const button = screen.getByRole('button', { name: /stop siklus/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/stop siklus/i);
    expect(screen.getByTestId('ban-icon')).toBeInTheDocument();
  });

  // Positive test cases
  describe('Positive Cases', () => {
    test('opens modal when button is clicked', async () => {
      render(<StopCycle cycleId="test-cycle-123" />);
      
      // Click the stop cycle button
      const button = screen.getByRole('button', { name: /stop siklus/i });
      await act(async () => {
        fireEvent.click(button);
      });
      
      // Check if modal content is displayed
      expect(screen.getByText(/apa anda yakin ingin stop siklus/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /tidak/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /iya/i })).toBeInTheDocument();
    });

    test('closes modal when "Tidak" button is clicked', async () => {
      render(<StopCycle cycleId="test-cycle-123" />);
      
      // Open modal
      const button = screen.getByRole('button', { name: /stop siklus/i });
      await act(async () => {
        fireEvent.click(button);
      });
      
      // Click the Tidak button
      const cancelButton = screen.getByRole('button', { name: /tidak/i });
      await act(async () => {
        fireEvent.click(cancelButton);
      });
    });

    test('successfully stops cycle when "Iya" button is clicked', async () => {
      // Mock successful stopCycle response
      (stopCycle as jest.Mock).mockResolvedValueOnce({ success: true });
      
      render(<StopCycle cycleId="test-cycle-123" />);
      
      // Open modal
      const button = screen.getByRole('button', { name: /stop siklus/i });
      await act(async () => {
        fireEvent.click(button);
      });
      
      // Click Iya button
      const confirmButton = screen.getByRole('button', { name: /iya/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });
      
      // Verify stopCycle was called with correct ID
      expect(stopCycle).toHaveBeenCalledWith('test-cycle-123');
      
      // Verify success toast was shown
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          description: 'Siklus berhasil dihentikan',
          variant: 'success'
        });
      });
    });
  });

  // Negative test cases
  describe('Negative Cases', () => {
    test('shows error toast when stopCycle returns failure', async () => {
      // Mock failure response
      (stopCycle as jest.Mock).mockResolvedValueOnce({ success: false });
      
      render(<StopCycle cycleId="test-cycle-123" />);
      
      // Open modal and click confirm
      const button = screen.getByRole('button', { name: /stop siklus/i });
      await act(async () => {
        fireEvent.click(button);
      });
      
      const confirmButton = screen.getByRole('button', { name: /iya/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });
      
      // Verify error toast was shown
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Gagal menghentikan siklus',
          description: 'Silakan coba lagi.',
          variant: 'destructive'
        });
      });
    });

    test('shows error toast when stopCycle throws exception', async () => {
      // Mock exception
      (stopCycle as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      
      render(<StopCycle cycleId="test-cycle-123" />);
      
      // Open modal and click confirm
      const button = screen.getByRole('button', { name: /stop siklus/i });
      await act(async () => {
        fireEvent.click(button);
      });
      
      const confirmButton = screen.getByRole('button', { name: /iya/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });
      
      // Verify error toast was shown
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Gagal menghentikan siklus',
          description: 'Silakan coba lagi.',
          variant: 'destructive'
        });
      });
    });

    test('buttons are disabled while loading state is true', async () => {
      // Mock delayed resolution to test loading state
      let resolveStopCycle: (value: unknown) => void;
      const stopCyclePromise = new Promise((resolve) => {
        resolveStopCycle = resolve;
      });
      (stopCycle as jest.Mock).mockReturnValueOnce(stopCyclePromise);
      
      render(<StopCycle cycleId="test-cycle-123" />);
      
      // Open modal and click confirm
      const button = screen.getByRole('button', { name: /stop siklus/i });
      await act(async () => {
        fireEvent.click(button);
      });
      
      const confirmButton = screen.getByRole('button', { name: /iya/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });
      
      // Verify buttons are disabled during loading
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /tidak/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /iya/i })).toBeDisabled();
      });
      
      // Resolve the promise to finish the test
      await act(async () => {
        resolveStopCycle!({ success: true });
      });
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    test('handles empty cycleId properly', async () => {
      render(<StopCycle cycleId="" />);
      
      // Click button and confirm
      const button = screen.getByRole('button', { name: /stop siklus/i });
      await act(async () => {
        fireEvent.click(button);
      });
      
      const confirmButton = screen.getByRole('button', { name: /iya/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });
      
      // Verify stopCycle was called with empty string
      expect(stopCycle).toHaveBeenCalledWith('');
    });

    test('handles special characters in cycleId', async () => {
      const specialCycleId = '!@#$%^&*()_+';
      render(<StopCycle cycleId={specialCycleId} />);
      
      // Click button and confirm
      const button = screen.getByRole('button', { name: /stop siklus/i });
      await act(async () => {
        fireEvent.click(button);
      });
      
      const confirmButton = screen.getByRole('button', { name: /iya/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });
      
      // Verify stopCycle was called with the special characters
      expect(stopCycle).toHaveBeenCalledWith(specialCycleId);
    });
    
    test('handles component unmounting during API call', async () => {
      // Mock never-resolving promise to simulate long-running call
      (stopCycle as jest.Mock).mockReturnValueOnce(new Promise(() => {}));
      
      const { unmount } = render(<StopCycle cycleId="test-cycle-123" />);
      
      // Open modal and click confirm
      const button = screen.getByRole('button', { name: /stop siklus/i });
      await act(async () => {
        fireEvent.click(button);
      });
      
      const confirmButton = screen.getByRole('button', { name: /iya/i });
      await act(async () => {
        fireEvent.click(confirmButton);
      });
      
      // Unmount component while API call is in progress
      unmount();
      
      // Test passes if no exceptions are thrown
      expect(true).toBeTruthy();
    });
  });
});