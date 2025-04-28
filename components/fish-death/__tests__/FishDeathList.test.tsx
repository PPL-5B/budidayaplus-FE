import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishDeathList from '@/components/fish-death/FishDeathList';
import { getLatestFishDeath } from '@/lib/fish-death/addFishDeath';

// Mock API
jest.mock('@/lib/fish-death/addFishDeath', () => ({
  getLatestFishDeath: jest.fn(),
}));

const mockGetLatestFishDeath = getLatestFishDeath as jest.Mock;

describe('FishDeathList', () => {
  const pondId = 'pond-001';
  const cycleId = 'cycle-001';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading text initially', () => {
    render(<FishDeathList pondId={pondId} cycleId={cycleId} />);
    expect(screen.getByText(/Memuat data/i)).toBeInTheDocument();
  });

  it('renders fallback message if no data available', async () => {
    mockGetLatestFishDeath.mockResolvedValue(null);

    render(<FishDeathList pondId={pondId} cycleId={cycleId} />);

    await waitFor(() => {
      expect(screen.getByText(/Tidak ada data kematian ikan/i)).toBeInTheDocument();
    });
  });

  it('renders fish death info when data is available', async () => {
    mockGetLatestFishDeath.mockResolvedValue({
      fish_death_count: 12,
      recorded_at: '2024-04-01T08:00:00Z',
      reporter: {
        first_name: 'Budi',
        last_name: 'Santoso',
      },
    });

    render(<FishDeathList pondId={pondId} cycleId={cycleId} />);

    await waitFor(() => {
      expect(screen.getByTestId('fish-death-date')).toBeInTheDocument();
      expect(screen.getByTestId('fish-death-count')).toHaveTextContent('12');
      expect(screen.getByText(/Budi Santoso/i)).toBeInTheDocument();
      expect(screen.getByText(/Jumlah Kematian Ikan/i)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully and logs error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // suppress error log
  
    (getLatestFishDeath as jest.Mock).mockRejectedValue(new Error('API failed'));
  
    render(<FishDeathList pondId={pondId} cycleId={cycleId} />);
  
    await waitFor(() => {
      expect(screen.getByText(/Tidak ada data kematian ikan/i)).toBeInTheDocument();
    });
  
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ Gagal mengambil data kematian ikan:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });
  
});