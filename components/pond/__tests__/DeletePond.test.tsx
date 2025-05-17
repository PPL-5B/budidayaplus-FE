import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeletePond from '@/components/pond/DeletePond';
import { deletePond } from '@/lib/pond';
import { Trash } from 'lucide-react';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('@/lib/pond', () => ({
  deletePond: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  Trash: () => <div data-testid="trash-icon" />,
}));

describe('DeletePond Component', () => {
  const mockPondId = 'pond-123';

  beforeEach(() => {
    jest.clearAllMocks();
    window.location.href = '';
  });

  it('renders delete button with trash icon', () => {
    render(<DeletePond pondId={mockPondId} />);

    const button = screen.getByRole('button', { name: /hapus/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-red-600');
    expect(button).toHaveClass('hover:bg-red-700');
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });

  it('shows confirmation dialog when button is clicked', () => {
    render(<DeletePond pondId={mockPondId} />);
    
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    
    expect(screen.getByText('Apakah Anda yakin ingin menghapus kolam?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /batal/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hapus/i })).toBeInTheDocument();
  });

  it('hides confirmation dialog when cancel is clicked', () => {
    render(<DeletePond pondId={mockPondId} />);
    
    // Open dialog
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    
    // Close dialog
    fireEvent.click(screen.getByRole('button', { name: /batal/i }));
    
    expect(screen.queryByText('Apakah Anda yakin ingin menghapus kolam?')).not.toBeInTheDocument();
  });

  it('shows loading state when deleting', async () => {
    (deletePond as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 1000))
    );
    render(<DeletePond pondId={mockPondId} />);
    
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    
    expect(screen.getByText('Menghapus...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /menghapus.../i })).toBeDisabled();
  });

  it('shows success message and redirects after successful deletion', async () => {
    (deletePond as jest.Mock).mockResolvedValue(true);
    render(<DeletePond pondId={mockPondId} />);
    
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Kolam berhasil dihapus!')).toBeInTheDocument();
      expect(window.location.href).toBe('/pond');
    });
  });

  it('shows error message when deletion fails', async () => {
    (deletePond as jest.Mock).mockResolvedValue(false);
    render(<DeletePond pondId={mockPondId} />);
    
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Gagal menghapus kolam')).toBeInTheDocument();
    });
  });

  it('shows error message when API throws error', async () => {
    (deletePond as jest.Mock).mockRejectedValue(new Error('Network error'));
    render(<DeletePond pondId={mockPondId} />);
    
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Gagal menghapus kolam')).toBeInTheDocument();
    });
  });

  it('forwards additional props to container div', () => {
    const testProps = {
      className: 'custom-class',
      'data-testid': 'delete-pond-container'
    };
    
    const { getByTestId } = render(
      <DeletePond pondId={mockPondId} {...testProps} />
    );
    
    const container = getByTestId('delete-pond-container');
    expect(container).toHaveClass('custom-class');
  });
});