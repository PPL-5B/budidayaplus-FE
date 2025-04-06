import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFishDeathForm from '@/components/fish-death/FishDeathForm'; // path sesuai nama file kamu
import { addFishDeath } from '@/lib/fish-death/addFishDeath';

// Mock the API
jest.mock('@/lib/fish-death/addFishDeath', () => ({
  addFishDeath: jest.fn(),
}));

// Mock window reload
Object.defineProperty(window, 'location', {
  value: { reload: jest.fn() },
  writable: true,
});

describe('AddFishDeathForm', () => {
  const pondId = 'pond-1';
  const cycleId = 'cycle-1';
  const setIsModalOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input and submit button', () => {
    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);
    expect(screen.getByLabelText(/Jumlah Ikan Mati/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Simpan/i })).toBeInTheDocument();
  });

  it('submits successfully and resets + closes modal + reloads page', async () => {
    (addFishDeath as jest.Mock).mockResolvedValue({ success: true });

    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);
    fireEvent.change(screen.getByLabelText(/Jumlah Ikan Mati/i), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }));

    await waitFor(() => {
      expect(addFishDeath).toHaveBeenCalledWith(pondId, cycleId, 15);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it('shows warning message if API returns success false with message', async () => {
    (addFishDeath as jest.Mock).mockResolvedValue({
      success: false,
      message: 'Jumlah melebihi stok',
    });

    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);
    fireEvent.change(screen.getByLabelText(/Jumlah Ikan Mati/i), { target: { value: '100' } });
    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }));

    await waitFor(() => {
      expect(screen.getByText(/Jumlah melebihi stok/i)).toBeInTheDocument();
    });
  });

  it('handles error on catch and shows default error message', async () => {
    (addFishDeath as jest.Mock).mockRejectedValue({
      response: { data: { detail: 'Server down' } },
    });

    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);
    fireEvent.change(screen.getByLabelText(/Jumlah Ikan Mati/i), { target: { value: '50' } });
    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }));

    await waitFor(() => {
      expect(screen.getByText(/Server down/i)).toBeInTheDocument();
    });
  });

  it('handles generic catch error with no detail', async () => {
    (addFishDeath as jest.Mock).mockRejectedValue(new Error('Unknown'));

    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);
    fireEvent.change(screen.getByLabelText(/Jumlah Ikan Mati/i), { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }));

    await waitFor(() => {
      expect(screen.getByText(/Terjadi kesalahan saat menyimpan data/i)).toBeInTheDocument();
    });
  });

  it('toggles detail popup visibility', async () => {
    (addFishDeath as jest.Mock).mockResolvedValue({
      success: false,
      message: 'Detail error',
    });

    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);
    fireEvent.change(screen.getByLabelText(/Jumlah Ikan Mati/i), { target: { value: '1' } });
    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }));

    await waitFor(() => {
      expect(screen.getByText(/Detail error/i)).not.toBeVisible(); // initial
    });

    fireEvent.click(screen.getByTestId('detail-button'));
    expect(screen.getByText(/Detail error/i)).toBeVisible();

    fireEvent.click(screen.getByTestId('detail-button'));
    expect(screen.getByText(/Detail error/i)).not.toBeVisible(); // hidden again
  });
});
