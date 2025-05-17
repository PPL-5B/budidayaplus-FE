import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishDeathHistory from '@/components/fish-death/FishDeathHistory';
import { fetchFishDeathHistory } from '@/lib/fish-death';

// Mock dependencies
jest.mock('@/lib/fish-death', () => ({
  fetchFishDeathHistory: jest.fn(),
}));

const mockFetchFishDeathHistory = fetchFishDeathHistory as jest.Mock;

describe('FishDeathHistory', () => {
  const pondId = 'pond-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    mockFetchFishDeathHistory.mockResolvedValueOnce({ fish_deaths: [] });

    render(<FishDeathHistory pondId={pondId} />);

    expect(screen.getByText('Memuat Data Anda...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('loading-data')).not.toBeInTheDocument();
    });
  });

  it('renders empty state when no data is available', async () => {
    mockFetchFishDeathHistory.mockResolvedValueOnce({ fish_deaths: [] });

    render(<FishDeathHistory pondId={pondId} />);

    await waitFor(() => {
      expect(screen.getByText('Belum Ada Data!')).toBeInTheDocument();
    });
  });

  it('renders history items when data is available', async () => {
    mockFetchFishDeathHistory.mockResolvedValueOnce({
      fish_deaths: [
        {
          id: '1',
          recorded_at: '2025-05-10T10:00:00Z',
          fish_death_count: 100,
          fish_alive_count: 900,
          reporter: { first_name: 'John', last_name: 'Doe' },
        },
        {
          id: '2',
          recorded_at: '2025-05-09T10:00:00Z',
          fish_death_count: 50,
          fish_alive_count: 950,
          reporter: { first_name: 'Jane', last_name: 'Smith' },
        },
      ],
    });

    render(<FishDeathHistory pondId={pondId} />);

    await waitFor(() => {
      expect(screen.getAllByText('Sabtu, 10 Mei 2025, oleh John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jumlah Ikan Mati:')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('Jumlah Ikan Hidup:')).toBeInTheDocument();
      expect(screen.getByText('900')).toBeInTheDocument();

      expect(screen.getByText('Jumat, 9 Mei 2025, oleh Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('950')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockFetchFishDeathHistory.mockRejectedValueOnce(new Error('Failed to fetch data'));

    render(<FishDeathHistory pondId={pondId} />);

    await waitFor(() => {
      expect(screen.getByTestId('empty-data')).toBeInTheDocument();
    });
  });

  it('renders sorted history items by date', async () => {
    mockFetchFishDeathHistory.mockResolvedValueOnce({
      fish_deaths: [
        {
          id: '1',
          recorded_at: '2025-05-09T10:00:00Z',
          fish_death_count: 50,
          fish_alive_count: 950,
          reporter: { first_name: 'Jane', last_name: 'Smith' },
        },
        {
          id: '2',
          recorded_at: '2025-05-10T10:00:00Z',
          fish_death_count: 100,
          fish_alive_count: 900,
          reporter: { first_name: 'John', last_name: 'Doe' },
        },
      ],
    });

    render(<FishDeathHistory pondId={pondId} />);

    await waitFor(() => {
      const items = screen.getAllByText(/oleh/);
      expect(items[0]).toHaveTextContent('Sabtu, 10 Mei 2025, oleh John Doe');
      expect(items[1]).toHaveTextContent('Jumat, 9 Mei 2025, oleh Jane Smith');
    });
  });
});