import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFishDeathForm from '@/components/fish-death/FishDeathForm';
import { addFishDeath } from '@/lib/fish-death/addFishDeath';
import { act } from 'react-dom/test-utils';

// Mock dependencies
jest.mock('@/lib/fish-death/addFishDeath', () => ({
  addFishDeath: jest.fn(),
}));

const mockAddFishDeath = addFishDeath as jest.Mock;

describe('AddFishDeathForm', () => {
  const pondId = 'pond-1';
  const cycleId = 'cycle-1';
  const setIsModalOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form correctly', () => {
    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);

    expect(screen.getByText('Tambah Kematian Ikan')).toBeInTheDocument();
    expect(screen.getByLabelText('Jumlah Ikan Mati')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('submits the form with valid data', async () => {
    mockAddFishDeath.mockResolvedValue({ success: true });

    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);

    const input = screen.getByLabelText('Jumlah Ikan Mati');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockAddFishDeath).toHaveBeenCalledWith(pondId, cycleId, 10);
      expect(setIsModalOpen).toHaveBeenCalledWith(false);
    });
  });

  it('shows an error message when the API call fails', async () => {
    mockAddFishDeath.mockRejectedValue({
      response: { data: { detail: 'Error message from server' } },
    });

    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);

    const input = screen.getByLabelText('Jumlah Ikan Mati');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Terjadi kesalahan yang tidak diketahui.')).toBeInTheDocument();
    });
  });

  it('shows a default error message for unknown errors', async () => {
    mockAddFishDeath.mockRejectedValue(new Error('Unknown error'));

    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);

    const input = screen.getByLabelText('Jumlah Ikan Mati');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Terjadi kesalahan saat menyimpan data.')).toBeInTheDocument();
    });
  });

  it('displays validation error when input is invalid', async () => {
    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);

    const input = screen.getByLabelText('Jumlah Ikan Mati');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Terjadi kesalahan saat menyimpan data.')).toBeInTheDocument();
    });
  });

  it('closes the modal when the close button is clicked', () => {
    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);

    const closeButton = screen.getByRole('button', { name: /tutup/i });
    fireEvent.click(closeButton);

    expect(setIsModalOpen).toHaveBeenCalledWith(false);
  });

  it('displays a warning message when there is an error saving data', async () => {
    mockAddFishDeath.mockRejectedValue({
      response: { data: { detail: 'Error message from server' } },
    });

    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);

    const input = screen.getByLabelText('Jumlah Ikan Mati');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      screen.debug()
      expect(screen.getByTestId('popup-warning')).toBeInTheDocument();
    });
  });

  it('sets a warning message when the API response is unsuccessful', async () => {
    mockAddFishDeath.mockResolvedValue({
      success: false,
      message: 'Custom error message from server',
    });

    render(<AddFishDeathForm pondId={pondId} cycleId={cycleId} setIsModalOpen={setIsModalOpen} />);

    const input = screen.getByLabelText('Jumlah Ikan Mati');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Custom error message from server')).toBeInTheDocument();
    });
  });
});