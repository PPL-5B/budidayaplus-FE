import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishSamplingForm from '../FishSamplingForm';
import { addFishSampling } from '@/lib/fish-sampling';

jest.mock('@/lib/fish-sampling', () => ({
  addFishSampling: jest.fn(),
}));

describe('FishSamplingForm', () => {
  const mockSetIsModalOpen = jest.fn();
  const pondId = 'pond-123';
  const cycleId = 'cycle-456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders form inputs and submit button', () => {
    render(<FishSamplingForm pondId={pondId} cycleId={cycleId} setIsModalOpen={mockSetIsModalOpen} />);

    expect(screen.getByPlaceholderText('Berat Ikan(kg)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Panjang Ikan(cm)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /simpan/i })).toBeInTheDocument();
  });

  test('validates form fields before submission', async () => {
    render(<FishSamplingForm pondId={pondId} cycleId={cycleId} setIsModalOpen={mockSetIsModalOpen} />);
    
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));
    
    expect(await screen.findByText(/harus diisi/i)).toBeInTheDocument();
  });

  test('submits form successfully', async () => {
    (addFishSampling as jest.Mock).mockResolvedValue({ success: true });

    render(<FishSamplingForm pondId={pondId} cycleId={cycleId} setIsModalOpen={mockSetIsModalOpen} />);
    
    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '1.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    await waitFor(() => {
      expect(addFishSampling).toHaveBeenCalledWith(pondId, cycleId, expect.any(FormData));
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });
  });

  test('handles submission failure from API response', async () => {
    (addFishSampling as jest.Mock).mockResolvedValue({ success: false });

    render(<FishSamplingForm pondId={pondId} cycleId={cycleId} setIsModalOpen={mockSetIsModalOpen} />);
    
    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '2.0' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '35' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    expect(await screen.findByText(/gagal menyimpan sample ikan/i)).toBeInTheDocument();
  });

  test('handles error when API call fails', async () => {
    (addFishSampling as jest.Mock).mockRejectedValue(new Error('API Error'));

    render(<FishSamplingForm pondId={pondId} cycleId={cycleId} setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.change(screen.getByPlaceholderText('Berat Ikan(kg)'), { target: { value: '2.5' } });
    fireEvent.change(screen.getByPlaceholderText('Panjang Ikan(cm)'), { target: { value: '42' } });
    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    expect(await screen.findByText(/gagal menyimpan sample ikan/i)).toBeInTheDocument();
  });

  test('all form labels include an icon', () => {
    render(<FishSamplingForm pondId={pondId} cycleId={cycleId} setIsModalOpen={mockSetIsModalOpen} />);
    
    const labels = screen.getAllByText(/berat ikan/i).concat(screen.getAllByText(/panjang ikan/i));
    labels.forEach(label => {
      const icon = label.closest('label')?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });
});
