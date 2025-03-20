import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFishDeath from '@/components/fish-sampling/AddFishDeath';
import { addFishDeath } from '@/lib/fish-sampling/addFishDeath';

// Mock fungsi addFishDeath
jest.mock('@/lib/fish-sampling/addFishDeath', () => ({
  addFishDeath: jest.fn(),
}));

global.alert = jest.fn();

describe('AddFishDeath Component', () => {
  const pondId = 'pond-123';
  const cycleId = 'cycle-456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    
    expect(screen.getByText(/Data Kematian Ikan/i)).toBeInTheDocument();
  });

  test('opens and closes modal', async () => {
    (addFishDeath as jest.Mock).mockResolvedValue({ success: true });
  
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    
    const openButton = screen.getByText(/Data Kematian Ikan/i);
    fireEvent.click(openButton);
    
    expect(screen.getByText(/Input Kematian Ikan/i)).toBeInTheDocument();
  
    const input = screen.getByPlaceholderText(/Masukkan jumlah ikan mati/i);
    fireEvent.change(input, { target: { value: '10' } });
  
    const submitButton = screen.getByRole('button', { name: /Simpan/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/Input Kematian Ikan/i)).not.toBeInTheDocument();
    });
  });

  test('validates input: cannot submit empty value', async () => {
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
  
    fireEvent.click(screen.getByText(/Data Kematian Ikan/i));

    const submitButton = screen.getByRole('button', { name: /Simpan/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Jumlah kematian ikan harus lebih dari 0.');
    });
  });

  test('validates input: cannot submit zero value', async () => {
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);

    fireEvent.click(screen.getByText(/Data Kematian Ikan/i));

    const input = screen.getByPlaceholderText(/Masukkan jumlah ikan mati/i);
    fireEvent.change(input, { target: { value: '0' } });

    const submitButton = screen.getByRole('button', { name: /Simpan/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Jumlah kematian ikan harus lebih dari 0.');
    });
  });

  test('submits valid input successfully', async () => {
    (addFishDeath as jest.Mock).mockResolvedValue({ success: true });

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);

    fireEvent.click(screen.getByText(/Data Kematian Ikan/i));

    const input = screen.getByPlaceholderText(/Masukkan jumlah ikan mati/i);
    fireEvent.change(input, { target: { value: '10' } });

    const submitButton = screen.getByRole('button', { name: /Simpan/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addFishDeath).toHaveBeenCalledWith(pondId, cycleId, 10);
      expect(global.alert).toHaveBeenCalledWith('Data kematian ikan berhasil disimpan.');
      expect(screen.queryByText(/Input Kematian Ikan/i)).not.toBeInTheDocument(); // Modal tertutup
    });

    expect(input).toHaveValue(null);
  });

  test('handles API failure correctly', async () => {
    (addFishDeath as jest.Mock).mockResolvedValue({ success: false, message: 'Gagal menyimpan' });

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);

    fireEvent.click(screen.getByText(/Data Kematian Ikan/i));

    const input = screen.getByPlaceholderText(/Masukkan jumlah ikan mati/i);
    fireEvent.change(input, { target: { value: '5' } });

    const submitButton = screen.getByRole('button', { name: /Simpan/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addFishDeath).toHaveBeenCalledWith(pondId, cycleId, 5);
      expect(global.alert).toHaveBeenCalledWith('Gagal menyimpan');
    });
  });

  test('displays loading state while submitting', async () => {
    (addFishDeath as jest.Mock).mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    });    

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);

    fireEvent.click(screen.getByText(/Data Kematian Ikan/i));

    const input = screen.getByPlaceholderText(/Masukkan jumlah ikan mati/i);
    fireEvent.change(input, { target: { value: '3' } });

    const submitButton = screen.getByRole('button', { name: /Simpan/i });
    fireEvent.click(submitButton);

    expect(submitButton).toHaveTextContent('Menyimpan...');

    await waitFor(() => {
      expect(submitButton).toHaveTextContent('Simpan');
    });
  });
});