import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddFishDeathForm from '@/components/fish-death/FishDeathForm';
import { addFishDeath } from '@/lib/fish-death/addFishDeath';

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    value: {
      reload: jest.fn(),
    },
    writable: true,
  });
});

jest.mock('@/lib/fish-death/addFishDeath', () => ({
  addFishDeath: jest.fn(),
}));

jest.mock('@/components/fish-death/FishDeathWarningPopUp', () => ({
  __esModule: true,
  default: ({ message, onClose }: any) => (
    <div data-testid="warning-popup">
      {message}
      <button onClick={onClose} data-testid="close-warning">Close Warning</button>
    </div>
  ),
}));

describe('AddFishDeathForm', () => {
  const mockSetIsModalOpen = jest.fn();
  const props = {
    pondId: 'pond1',
    cycleId: 'cycle1',
    setIsModalOpen: mockSetIsModalOpen,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<AddFishDeathForm {...props} />);
    
    expect(screen.getByText('Tambah Kematian Ikan')).toBeInTheDocument();
    expect(screen.getByLabelText('Jumlah Ikan Mati')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('submits the form successfully', async () => {
    (addFishDeath as jest.Mock).mockResolvedValueOnce({ success: true });
    
    render(<AddFishDeathForm {...props} />);
    
    fireEvent.change(screen.getByLabelText('Jumlah Ikan Mati'), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(addFishDeath).toHaveBeenCalledWith(
        'pond1',
        'cycle1',
        5
      );
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it('shows warning message when submission fails with message', async () => {
    (addFishDeath as jest.Mock).mockResolvedValueOnce({ 
      success: false, 
      message: 'Jumlah kematian ikan melebihi batas' 
    });
    
    render(<AddFishDeathForm {...props} />);
    
    fireEvent.change(screen.getByLabelText('Jumlah Ikan Mati'), {
      target: { value: '100' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByText('Jumlah kematian ikan melebihi batas')).toBeInTheDocument();
      expect(mockSetIsModalOpen).not.toHaveBeenCalled();
      expect(window.location.reload).not.toHaveBeenCalled();
    });

    // Test closing the warning
    fireEvent.click(screen.getByTestId('close-warning'));
    await waitFor(() => {
      expect(screen.queryByTestId('warning-popup')).not.toBeInTheDocument();
    });
  });

  it('shows error message when API throws an error with response data', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    const mockError = new Error('API Error');
    Object.defineProperty(mockError, 'response', {
      value: {
        data: {
          detail: 'Kesalahan validasi data'
        }
      },
      configurable: true
    });
    
    (addFishDeath as jest.Mock).mockRejectedValueOnce(mockError);
    
    render(<AddFishDeathForm {...props} />);
    
    fireEvent.change(screen.getByLabelText('Jumlah Ikan Mati'), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByText('Kesalahan validasi data')).toBeInTheDocument();
    });
    
    console.error = originalConsoleError;
  });

  it('shows generic error message when API throws an error without detail', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    const mockError = new Error('API Error');
    (addFishDeath as jest.Mock).mockRejectedValueOnce(mockError);
    
    render(<AddFishDeathForm {...props} />);
    
    fireEvent.change(screen.getByLabelText('Jumlah Ikan Mati'), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByText('Terjadi kesalahan saat menyimpan data.')).toBeInTheDocument();
    });
    
    console.error = originalConsoleError;
  });

  it('shows unknown error message when API throws non-Error object', async () => {
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    (addFishDeath as jest.Mock).mockRejectedValueOnce('Something went wrong');
    
    render(<AddFishDeathForm {...props} />);
    
    fireEvent.change(screen.getByLabelText('Jumlah Ikan Mati'), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByText('Terjadi kesalahan yang tidak diketahui.')).toBeInTheDocument();
    });
    
    console.error = originalConsoleError;
  });

  it('closes the modal when X button is clicked', () => {
    render(<AddFishDeathForm {...props} />);
    
    fireEvent.click(screen.getByLabelText('Tutup'));
    
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  it('validates input fields properly', async () => {
    render(<AddFishDeathForm {...props} />);
    
    // Submit the form with default value (0)
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(addFishDeath).toHaveBeenCalled();
    });
  });

  it('resets form after successful submission', async () => {
    (addFishDeath as jest.Mock).mockResolvedValueOnce({ success: true });
    
    render(<AddFishDeathForm {...props} />);
    
    const input = screen.getByLabelText('Jumlah Ikan Mati');
    
    fireEvent.change(input, { target: { value: '5' } });
    expect(input).toHaveValue(5);
    
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });
  });
});