import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishSamplingForm from '@/components/fish-sampling/FishSamplingForm';
import { addFishSampling } from '@/lib/fish-sampling';

jest.mock('@/lib/fish-sampling');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true
});

const mockAddFishSampling = addFishSampling as jest.MockedFunction<
  (pondId: string, cycleId: string, data: FormData) => Promise<{ success: boolean; message?: string; warning?: string }>
>;

describe('FishSamplingForm', () => {
  const mockSetIsModalOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form inputs and submit button', () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    expect(screen.getByPlaceholderText('Berat Ikan (kg)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Panjang Ikan (cm)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /simpan/i })).toBeInTheDocument();
  });

  it('handles different validation error cases correctly', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    const submitButton = screen.getByRole('button', { name: /simpan/i });

    // Case: fish_weight and fish_length are 0
    fireEvent.change(screen.getByPlaceholderText('Berat Ikan (kg)'), { target: { value: '0' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan (cm)'), { target: { value: '0' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Berat dan panjang ikan harus lebih dari 0, harap pastikan data benar.')).toBeInTheDocument();
    });

    // Case: fish_weight > 10, fish_length > 100
    fireEvent.change(screen.getByPlaceholderText('Berat Ikan (kg)'), { target: { value: '11' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan (cm)'), { target: { value: '101' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Berat dan panjang ikan terlalu besar, harap pastikan data benar.')).toBeInTheDocument();
    });

    // Case: fish_weight > 10
    fireEvent.change(screen.getByPlaceholderText('Berat Ikan (kg)'), { target: { value: '11' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan (cm)'), { target: { value: '10' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Berat ikan lebih dari 10 kg, harap pastikan data benar.')).toBeInTheDocument();
    });

    // Case: fish_length > 100
    fireEvent.change(screen.getByPlaceholderText('Berat Ikan (kg)'), { target: { value: '9' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan (cm)'), { target: { value: '101' } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText('Panjang ikan lebih dari 100 cm, harap pastikan data benar.')).toBeInTheDocument();
    });
  });

  it('handles failed submission with error message from API', async () => {
    mockAddFishSampling.mockResolvedValueOnce({ success: false, message: 'Server rejected request' });
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan (kg)'), { target: { value: '3' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan (cm)'), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Server rejected request')).toBeInTheDocument();
    });
  });

  it('handles failed submission with default error message when API response has no message', async () => {
    mockAddFishSampling.mockResolvedValueOnce({ success: false });
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan (kg)'), { target: { value: '3' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan (cm)'), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Gagal menyimpan sample ikan')).toBeInTheDocument();
    });
  });

  it('handles API errors and warnings properly', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    mockAddFishSampling.mockResolvedValueOnce({ success: true, warning: 'Data mendekati batas maksimal' });
    fireEvent.change(screen.getByPlaceholderText('Berat Ikan (kg)'), { target: { value: '9.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan (cm)'), { target: { value: '99' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));
    
    await waitFor(() => {
      expect(screen.getByText('⚠️ Peringatan')).toBeInTheDocument();
      expect(screen.getByText('Data mendekati batas maksimal')).toBeInTheDocument();
    });
  });

  it('handles successful submission and closes modal', async () => {
    mockAddFishSampling.mockResolvedValueOnce({ success: true });
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan (kg)'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan (cm)'), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      expect(mockReload).toHaveBeenCalled();
    });
  });

  it('handles unexpected API errors with default error message', async () => {
    mockAddFishSampling.mockRejectedValueOnce(new Error('Unexpected error'));
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan (kg)'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan (cm)'), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Gagal menyimpan sample ikan')).toBeInTheDocument();
    });
  });

  it('closes error modal when "Perbaiki Input" is clicked', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan (kg)'), { target: { value: '0' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan (cm)'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Berat dan panjang ikan harus lebih dari 0, harap pastikan data benar.')).toBeInTheDocument();
    });

    const fixInputButton = screen.getByText('Perbaiki Input');
    fireEvent.click(fixInputButton);

    await waitFor(() => {
      expect(screen.queryByText('Berat dan panjang ikan harus lebih dari 0, harap pastikan data benar.')).not.toBeInTheDocument();
    });
  });

  it('closes warning modal when "Oke, Saya Mengerti" is clicked', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    mockAddFishSampling.mockResolvedValueOnce({ success: true, warning: 'Data mendekati batas maksimal' });
    fireEvent.change(screen.getByPlaceholderText('Berat Ikan (kg)'), { target: { value: '9.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan (cm)'), { target: { value: '99' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Data mendekati batas maksimal')).toBeInTheDocument();
    });

    const okButton = screen.getByText('Oke, Saya Mengerti');
    fireEvent.click(okButton);

    await waitFor(() => {
      expect(screen.queryByText('Data mendekati batas maksimal')).not.toBeInTheDocument();
    });
  });
});