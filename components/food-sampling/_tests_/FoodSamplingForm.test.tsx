import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FoodSamplingForm from '@/components/food-sampling/FoodSamplingForm';
import { addFoodSampling } from '@/lib/food-sampling';

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    value: {
      reload: jest.fn(),
    },
    writable: true,
  });
});

jest.mock('@/lib/food-sampling', () => ({
  addFoodSampling: jest.fn(),
}));

jest.mock('@/components/food-sampling/FoodSamplingWarningPopUp', () => ({
  __esModule: true,
  default: ({ onClose, onShowDetail, showDetail }: any) => (
    <div data-testid="warning-popup">
      Warning Popup
      <button onClick={onClose}>Close Popup</button>
      <button onClick={onShowDetail}>Show Details</button>
      {showDetail && <div>Detail Content</div>}
    </div>
  ),
}));

describe('FoodSamplingForm', () => {
  const mockSetIsModalOpen = jest.fn();
  const props = {
    pondId: 'pond1',
    cycleId: 'cycle1',
    setIsModalOpen: mockSetIsModalOpen,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_FOOD_QUANTITY_THRESHOLD = '1000';
  });

  it('renders the form correctly', () => {
    render(<FoodSamplingForm {...props} />);
    
    expect(screen.getByText('Tambah Data Jumlah Makanan')).toBeInTheDocument();
    expect(screen.getByLabelText('Kuantitas Makanan')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('submits the form successfully', async () => {
    (addFoodSampling as jest.Mock).mockResolvedValueOnce({ success: true });
    
    render(<FoodSamplingForm {...props} />);
    
    fireEvent.change(screen.getByLabelText('Kuantitas Makanan'), {
      target: { value: '500' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(addFoodSampling).toHaveBeenCalledWith(
        { food_quantity: 500 },
        'pond1',
        'cycle1'
      );
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });
  });

  it('shows error message when submission fails', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    
    (addFoodSampling as jest.Mock).mockResolvedValueOnce({ success: false });
    
    render(<FoodSamplingForm {...props} />);
    
    fireEvent.change(screen.getByLabelText('Kuantitas Makanan'), {
      target: { value: '500' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByText('Gagal menyimpan sample makanan')).toBeInTheDocument();
    });
    
    console.error = originalError;
  });

  it('shows error message when API throws an error', async () => {
    const originalError = console.error;
    console.error = jest.fn();
    
    (addFoodSampling as jest.Mock).mockRejectedValueOnce(new Error('API Error'));
    
    render(<FoodSamplingForm {...props} />);
    
    fireEvent.change(screen.getByLabelText('Kuantitas Makanan'), {
      target: { value: '500' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(screen.getByText('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.')).toBeInTheDocument();
    });
    
    console.error = originalError;
  });

  it('shows warning popup when food quantity exceeds threshold', async () => {
    render(<FoodSamplingForm {...props} />);
    
    fireEvent.change(screen.getByLabelText('Kuantitas Makanan'), {
      target: { value: '1001' },
    });
    
    await waitFor(() => {
      expect(screen.getByTestId('warning-popup')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Close Popup'));
    expect(screen.queryByTestId('warning-popup')).not.toBeInTheDocument();
  });

  it('prevents submission when food quantity exceeds threshold', async () => {
    render(<FoodSamplingForm {...props} />);
    
    fireEvent.change(screen.getByLabelText('Kuantitas Makanan'), {
      target: { value: '1001' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(addFoodSampling).not.toHaveBeenCalled();
      expect(screen.getByTestId('warning-popup')).toBeInTheDocument();
    });
  });

  it('closes the modal when X button is clicked', () => {
    render(<FoodSamplingForm {...props} />);
    
    fireEvent.click(screen.getByLabelText('Tutup'));
    
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });


});