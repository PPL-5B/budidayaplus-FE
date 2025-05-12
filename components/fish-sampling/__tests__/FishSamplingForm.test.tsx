import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FishSamplingForm from '../FishSamplingForm';
import '@testing-library/jest-dom';
import React from 'react';
import { addFishSampling } from '@/lib/fish-sampling';

jest.mock('@/lib/fish-sampling', () => ({
  addFishSampling: jest.fn(),
}));

describe('FishSamplingForm Component', () => {
  const mockSetIsModalOpen = jest.fn();
  const setup = () =>
    render(
      <FishSamplingForm 
        pondId="pond-1" 
        cycleId="cycle-1" 
        setIsModalOpen={mockSetIsModalOpen} 
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

  test('renders form inputs and submit button', () => {
    setup();
    expect(screen.getByLabelText('Berat Ikan (kg)')).toBeInTheDocument();
    expect(screen.getByLabelText('Panjang Ikan (cm)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  test('shows zod validation error if inputs are 0 or negative', async () => {
    setup();
    fireEvent.change(screen.getByLabelText('Berat Ikan (kg)'), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText('Panjang Ikan (cm)'), { target: { value: '-5' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Berat harus berupa angka positif/i)).toBeInTheDocument();
    expect(await screen.findByText(/Panjang harus berupa angka positif/i)).toBeInTheDocument();
  });

  test('shows warning popup when weight > 10', async () => {
    setup();
    fireEvent.change(screen.getByLabelText('Berat Ikan (kg)'), { target: { value: '11' } });
    fireEvent.change(screen.getByLabelText('Panjang Ikan (cm)'), { target: { value: '20' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Berat ikan lebih dari 10 kg/i)).toBeInTheDocument();
  });

  test('shows warning popup when length > 100', async () => {
    setup();
    fireEvent.change(screen.getByLabelText('Berat Ikan (kg)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Panjang Ikan (cm)'), { target: { value: '120' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Panjang ikan lebih dari 100 cm/i)).toBeInTheDocument();
  });

  test('shows multiple validation errors when both weight > 10 and length > 100', async () => {
    setup();
    fireEvent.change(screen.getByLabelText('Berat Ikan (kg)'), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText('Panjang Ikan (cm)'), { target: { value: '150' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    const errors = await screen.findAllByRole('alert');
    expect(errors).toHaveLength(2);
    expect(errors[0]).toHaveTextContent(/Berat ikan lebih dari 10 kg/i);
    expect(errors[1]).toHaveTextContent(/Panjang ikan lebih dari 100 cm/i);
  });

  test('shows API error message if addFishSampling fails with message', async () => {
    (addFishSampling as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: 'API Gagal',
    });

    setup();
    fireEvent.change(screen.getByLabelText('Berat Ikan (kg)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Panjang Ikan (cm)'), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Gagal menyimpan sample ikan: API Gagal/i)).toBeInTheDocument();
  });

  test('shows generic error message if addFishSampling fails without message', async () => {
    (addFishSampling as jest.Mock).mockResolvedValueOnce({
      success: false,
      // message tidak disertakan
    });

    setup();
    fireEvent.change(screen.getByLabelText('Berat Ikan (kg)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Panjang Ikan (cm)'), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Gagal menyimpan sample ikan/i)).toBeInTheDocument();
  });

  test('shows fallback error if API throws unexpected error', async () => {
    (addFishSampling as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    setup();
    fireEvent.change(screen.getByLabelText('Berat Ikan (kg)'), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText('Panjang Ikan (cm)'), { target: { value: '33' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByText(/Gagal menyimpan sample ikan/i)).toBeInTheDocument();
  });

  test('successfully submits form, resets, closes modal and reloads page', async () => {
    (addFishSampling as jest.Mock).mockResolvedValueOnce({ success: true });

    setup();
    
    const weightInput = screen.getByLabelText('Berat Ikan (kg)') as HTMLInputElement;
    const lengthInput = screen.getByLabelText('Panjang Ikan (cm)') as HTMLInputElement;

    fireEvent.change(weightInput, { target: { value: '5' } });
    fireEvent.change(lengthInput, { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(addFishSampling).toHaveBeenCalledWith(
        'pond-1',
        'cycle-1',
        expect.any(FormData)
      );
      
      // Verify form reset
      expect(weightInput.value).toBe('0');
      expect(lengthInput.value).toBe('0');
      
      // Verify modal closed
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      
      // Verify page reload
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  test('closes modal when X button is clicked', () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /tutup/i }));
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  test('disables submit button when isSubmitting', async () => {
    (addFishSampling as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    );

    setup();
    
    fireEvent.change(screen.getByLabelText('Berat Ikan (kg)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Panjang Ikan (cm)'), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

 test('clears custom errors when popup is closed', async () => {
    (addFishSampling as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: 'API Gagal',
    });

    setup();
    fireEvent.change(screen.getByLabelText('Berat Ikan (kg)'), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText('Panjang Ikan (cm)'), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    const errorMessage = await screen.findByText(/API Gagal/i);

    const closeButtons = screen.getAllByRole('button', { name: /tutup/i });
    fireEvent.click(closeButtons[1]); // close error popup

    await waitFor(() => {
      expect(errorMessage).not.toBeInTheDocument();
    });
  });

});