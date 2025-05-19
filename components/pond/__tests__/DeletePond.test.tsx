import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeletePond from '@/components/pond/DeletePond';
import { deletePond } from '@/lib/pond';

// Mock the dependencies
jest.mock('@/lib/pond', () => ({
  deletePond: jest.fn()
}));

// Mock the Trash2 icon
jest.mock('lucide-react', () => ({
  Trash2: jest.fn(() => <span data-testid="trash-icon" />)
}));

// Mock the CancelButton and DangerButton components
jest.mock('@/components/ui/cancel-button', () => ({
  __esModule: true,
  default: jest.fn(({ children, onClick }) => (
    <button onClick={onClick} data-testid="cancel-button">
      {children}
    </button>
  ))
}));

jest.mock('@/components/ui/danger-button', () => ({
  __esModule: true,
  default: jest.fn(({ children, onClick, disabled, className }) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={className}
      data-testid="danger-button"
    >
      {children}
    </button>
  ))
}));

// Helper to simulate delayed promise
function delayedResolveTrue() {
  return new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 500);
  });
}

describe('DeletePond Component', () => {
  const mockPondId = 'pond-123';
  const originalWindowLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '', assign: jest.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalWindowLocation,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the delete button correctly', () => {
    render(<DeletePond pondId={mockPondId} />);
    
    const deleteButton = screen.getByRole('button', { name: /hapus/i });
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveClass('bg-red-600');
    expect(deleteButton).toHaveClass('hover:bg-red-700');
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('shows confirmation dialog when delete button is clicked', () => {
    render(<DeletePond pondId={mockPondId} />);
    
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    
    expect(screen.getByText(/apakah anda yakin ingin menghapus kolam/i)).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    expect(screen.getByTestId('danger-button')).toBeInTheDocument();
  });

  it('closes confirmation dialog when cancel is clicked', () => {
    render(<DeletePond pondId={mockPondId} />);
    
    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    
    // Close dialog
    fireEvent.click(screen.getByTestId('cancel-button'));
    
    expect(screen.queryByText(/apakah anda yakin ingin menghapus kolam/i)).not.toBeInTheDocument();
  });

  describe('when confirming deletion', () => {
    it('shows loading state while deleting', async () => {
      (deletePond as jest.Mock).mockImplementation(delayedResolveTrue);
      
      render(<DeletePond pondId={mockPondId} />);
      
      // Open dialog
      fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
      
      // Confirm delete
      fireEvent.click(screen.getByTestId('danger-button'));
      
      expect(screen.getByText(/menghapus.../i)).toBeInTheDocument();
      expect(screen.getByTestId('danger-button')).toBeDisabled();
      
      await waitFor(() => {
        expect(screen.queryByText(/menghapus.../i)).not.toBeInTheDocument();
      });
    });

    it('shows success message and redirects after successful deletion', async () => {
      (deletePond as jest.Mock).mockResolvedValue(true);
      
      render(<DeletePond pondId={mockPondId} />);
      
      // Open dialog
      fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
      
      // Confirm delete
      fireEvent.click(screen.getByTestId('danger-button'));
      
      await waitFor(() => {
        expect(screen.getByText(/kolam berhasil dihapus/i)).toBeInTheDocument();
      });
      
      // Wait for redirect
      await waitFor(() => {
        expect(window.location.href).toBe('/pond');
      }, { timeout: 1500 });
    });

    it('shows error message when deletion fails', async () => {
      (deletePond as jest.Mock).mockResolvedValue(false);
      
      render(<DeletePond pondId={mockPondId} />);
      
      // Open dialog
      fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
      
      // Confirm delete
      fireEvent.click(screen.getByTestId('danger-button'));
      
      await waitFor(() => {
        expect(screen.getByText(/gagal menghapus kolam/i)).toBeInTheDocument();
      });
    });

    it('shows error message when deletion throws an error', async () => {
      (deletePond as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      render(<DeletePond pondId={mockPondId} />);
      
      // Open dialog
      fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
      
      // Confirm delete
      fireEvent.click(screen.getByTestId('danger-button'));
      
      await waitFor(() => {
        expect(screen.getByText(/gagal menghapus kolam/i)).toBeInTheDocument();
      });
    });
  });

  it('has correct styling for confirmation dialog', () => {
    render(<DeletePond pondId={mockPondId} />);
    
    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    
    const overlay = screen.getByRole('dialog');
    expect(overlay).toHaveClass('fixed');
    expect(overlay).toHaveClass('inset-0');
    expect(overlay).toHaveClass('bg-black');
    expect(overlay).toHaveClass('bg-opacity-50');
    
    const dialogContent = overlay.querySelector('div > div');
    expect(dialogContent).toHaveClass('bg-[#EAF0FF]');
    expect(dialogContent).toHaveClass('rounded-lg');
    expect(dialogContent).toHaveClass('shadow-md');
  });
});