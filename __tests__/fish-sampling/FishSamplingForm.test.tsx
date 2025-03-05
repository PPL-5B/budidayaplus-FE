import React from 'react';
import { render, screen, fireEvent, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import FishSamplingForm from '@/components/fish-sampling/FishSamplingForm';
import { addFishSampling } from '@/lib/fish-sampling';

jest.mock('@/lib/fish-sampling'); // Mock addFishSampling function
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

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

    expect(screen.getByPlaceholderText('Berat Ikan(kg)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Panjang Ikan(cm)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /simpan/i })).toBeInTheDocument();
  });

  it('submits form successfully and closes modal on success', async () => {
    mockAddFishSampling.mockResolvedValueOnce({ success: true });
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '1.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      expect(screen.queryByText('Gagal menyimpan sample ikan')).not.toBeInTheDocument();
    });
  });

  it('displays error message on failed submission', async () => {
    mockAddFishSampling.mockResolvedValueOnce({ success: false, message: 'Gagal menyimpan sample ikan' });
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '1.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Gagal menyimpan sample ikan')).toBeInTheDocument();
    });
  });

  it('displays warning message when API returns a warning', async () => {
    mockAddFishSampling.mockResolvedValueOnce({ success: true, warning: 'Data mendekati batas maksimal' });
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '1.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('⚠ Peringatan')).toBeInTheDocument();
      expect(screen.getByText('Data mendekati batas maksimal')).toBeInTheDocument();
    });
  });

  it('displays validation errors for empty input', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/Expected number, received nan/i)).toHaveLength(2);
    });
  });

  it('displays validation errors for negative input', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '-1.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '-20' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Berat harus berupa angka positif')).toBeInTheDocument();
      expect(screen.getByText('Panjang harus berupa angka positif')).toBeInTheDocument();
    });
  });

  it('handles zero as a valid input', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '0' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '0' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Berat harus lebih besar dari 0')).toBeInTheDocument();
      expect(screen.getByText('Panjang harus lebih besar dari 0')).toBeInTheDocument();
    });
  });

  it('displays default error message when API response has no message', async () => {
    mockAddFishSampling.mockResolvedValueOnce({ success: false });
  
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);
  
    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '1.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));
  
    await waitFor(() => {
      expect(screen.getByText('Gagal menyimpan sample ikan')).toBeInTheDocument();
    });
  });
  
  it('displays error when API throws an exception', async () => {
    mockAddFishSampling.mockRejectedValueOnce(new Error('Network Error'));
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '1.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Gagal menyimpan sample ikan')).toBeInTheDocument();
    });
  });

  it('displays error when API request fails (catch block)', async () => {
    mockAddFishSampling.mockRejectedValueOnce(new Error('Network Error'));
  
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);
  
    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '1.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));
  
    await waitFor(() => {
      expect(screen.getByText('Gagal menyimpan sample ikan')).toBeInTheDocument();
    });
  });

  it('removes warning when user acknowledges it', async () => {
    mockAddFishSampling.mockResolvedValueOnce({ success: true, warning: 'Periksa data Anda' });
  
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={mockSetIsModalOpen} />);
  
    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '1.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));
  
    await waitFor(() => {
      expect(screen.getByText('⚠ Peringatan')).toBeInTheDocument();
    });
  
    fireEvent.click(screen.getByRole('button', { name: /oke, saya mengerti/i }));
  
    await waitFor(() => {
      expect(screen.queryByText('⚠ Peringatan')).not.toBeInTheDocument();
    });
  });  
});
