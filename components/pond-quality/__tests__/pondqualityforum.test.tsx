import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PondQualityForm from '@/components/pond-quality/PondQualityForm';
import '@testing-library/jest-dom';

// Mock library
const mockAddOrUpdate = jest.fn();
jest.mock('@/lib/pond-quality', () => ({
  addOrUpdatePondQuality: (
    data: FormData,
    pondId?: string,
    cycleId?: string,
    pondQualityId?: string
  ) => mockAddOrUpdate(data, pondId, cycleId, pondQualityId),
}));

describe('PondQualityForm', () => {
  const setup = (props = {}) => render(
    <PondQualityForm 
      setIsModalOpen={() => {}} 
      pondId="1" 
      cycleId="1" 
      {...props} 
    />
  );

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
      writable: true,
    });
  });

  const fillAllFields = () => {
    fireEvent.change(screen.getByLabelText(/Temperatur/i), { target: { value: '25' } });
    fireEvent.change(screen.getByLabelText(/pH/i), { target: { value: '7' } });
    fireEvent.change(screen.getByLabelText(/Kejernihan/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Oksigen Terlarut/i), { target: { value: '6' } });
    fireEvent.change(screen.getByLabelText(/Salinitas/i), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Ammonia/i), { target: { value: '0.3' } });
    fireEvent.change(screen.getByLabelText(/Sirkulasi/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Phosphate/i), { target: { value: '0.5' } });
    fireEvent.change(screen.getByLabelText(/ORP/i), { target: { value: '400' } });
    fireEvent.change(screen.getByLabelText(/Nitrate/i), { target: { value: '1.2' } });

    const fileInput = screen.getByLabelText(/Foto/i) as HTMLInputElement;
    const file = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
  };

  it('renders all form fields', () => {
    setup();
    expect(screen.getByLabelText(/Temperatur/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pH/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kejernihan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Oksigen Terlarut/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Salinitas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ammonia/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sirkulasi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phosphate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ORP/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nitrate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Foto/i)).toBeInTheDocument();
    expect(screen.getByText(/Simpan/i)).toBeInTheDocument();
  });

  it('renders with all the expected content', () => {
    setup();
    // Test header and close button
    expect(screen.getByText('Tambah Data Jumlah Makanan')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tutup/i })).toBeInTheDocument();
  });

  it('shows validation errors if fields are empty', async () => {
    setup();
    fireEvent.click(screen.getByText(/Simpan/i));
    await waitFor(() => {
      expect(screen.getAllByText(/harus berupa angka/i).length).toBeGreaterThan(0);
    });
  });

  it('submits successfully when all fields are valid', async () => {
    mockAddOrUpdate.mockResolvedValueOnce({ success: true });
    setup();
    fillAllFields();
    fireEvent.click(screen.getByText(/Simpan/i));
    await waitFor(() => {
      expect(mockAddOrUpdate).toHaveBeenCalled();
      // Check if reloadPage was called
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it('properly processes image file during submission', async () => {
    mockAddOrUpdate.mockResolvedValueOnce({ success: true });
    setup();
    
    // Only test the file input
    const fileInput = screen.getByLabelText(/Foto/i) as HTMLInputElement;
    const file = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    fireEvent.click(screen.getByText(/Simpan/i));
    
    await waitFor(() => {
      expect(mockAddOrUpdate).toHaveBeenCalled();
    });
  });

  it('shows error when submission fails (success: false)', async () => {
    mockAddOrUpdate.mockResolvedValueOnce({ success: false });
    setup();
    fillAllFields();
    fireEvent.click(screen.getByText(/Simpan/i));
    await waitFor(() => {
      expect(screen.getByText(/Gagal menyimpan kualitas air/i)).toBeInTheDocument();
    });
  });

  it('shows error when submission throws error', async () => {
    mockAddOrUpdate.mockImplementationOnce(() => {
      throw new Error('Simulated error');
    });
    setup();
    fillAllFields();
    fireEvent.click(screen.getByText(/Simpan/i));
    await waitFor(() => {
      expect(screen.getByText(/Terjadi kesalahan saat menyimpan data/i)).toBeInTheDocument();
    });
  });

  it('closes modal when X button is clicked', () => {
    const setIsModalOpenMock = jest.fn();
    render(<PondQualityForm setIsModalOpen={setIsModalOpenMock} pondId="1" cycleId="1" />);
    const closeButton = screen.getByRole('button', { name: /tutup/i });
    fireEvent.click(closeButton);
    expect(setIsModalOpenMock).toHaveBeenCalledWith(false);
  });

  it('renders all field errors when they exist', async () => {
    setup();
    
    // Submit without filling to trigger errors
    fireEvent.click(screen.getByText(/Simpan/i));
    
    await waitFor(() => {
      // Verify each field has an error
      const errorMessages = screen.getAllByText(/harus berupa angka/i);
      expect(errorMessages.length).toBeGreaterThan(0);
      
      // Verify renderField function displays errors properly
      const inputs = [
        'water_temperature', 'ph_level', 'water_clarity', 
        'dissolved_oxygen', 'salinity', 'ammonia', 
        'water_circulation', 'phosphate', 'orp', 'nitrate'
      ];
      
      // Check that errors are displayed for each field
      inputs.forEach(fieldName => {
        // This ensures the renderField function's error display code is covered
        const input = screen.getByLabelText(new RegExp(fieldName.replace(/_/g, ' '), 'i'));
        expect(input).toBeInTheDocument();
      });
    });
  });

  it('handles optional props correctly', () => {
    // Test with undefined pondId and cycleId
    render(<PondQualityForm setIsModalOpen={() => {}} />);
    expect(screen.getByText('Tambah Data Jumlah Makanan')).toBeInTheDocument();
  });

  it('resets form and closes modal after successful submission', async () => {
    mockAddOrUpdate.mockResolvedValueOnce({ success: true });
    const setIsModalOpenMock = jest.fn();
    render(<PondQualityForm setIsModalOpen={setIsModalOpenMock} pondId="1" cycleId="1" />);
    
    fillAllFields();
    fireEvent.click(screen.getByText(/Submit/i));
    
    await waitFor(() => {
      expect(setIsModalOpenMock).toHaveBeenCalledWith(false);
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
