import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishDeathDashboard from '@/components/fish-death/FishDeathDashboard';
import { useCycle } from '@/hooks/useCycle';
import { fetchLatestFishDeath } from '@/lib/fish-death/fetchFishDeath';
import { FishDeath } from '@/types/fish-death';

// 🔁 Mock hook & fetch
jest.mock('@/hooks/useCycle');
jest.mock('@/lib/fish-death/fetchFishDeath');

const mockedUseCycle = useCycle as jest.Mock;
const mockedFetchLatestFishDeath = fetchLatestFishDeath as jest.Mock;

const mockFishDeath: FishDeath = {
    id: 'fd-001',
    pond_id: 'pond-1',
    recorded_at: '2024-04-04T00:00:00Z',
    fish_death_count: 25,
    fish_alive_count: 75,
    reporter: {
        id: 1,
        first_name: 'Ani',
        last_name: 'Wijaya',
        phone_number: '08123456789',
    },
    cycle_id: ''
};

const mockCycle = {
  id: 'cycle-1',
  pond_fish_amount: [
    { pond_id: 'pond-1', fish_amount: 100 },
    { pond_id: 'pond-2', fish_amount: 150 },
  ],
};

describe('FishDeathDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders message if cycle is not available', () => {
    mockedUseCycle.mockReturnValue(null);

    render(<FishDeathDashboard pondId="pond-1" />);
    expect(screen.getByText(/Data siklus belum tersedia/i)).toBeInTheDocument();
  });

  it('renders message if pond is not found in cycle', () => {
    mockedUseCycle.mockReturnValue({
      id: 'cycle-1',
      pond_fish_amount: [],
    });

    render(<FishDeathDashboard pondId="pond-1" />);
    expect(screen.getByText(/Kolam tidak ditemukan dalam siklus ini/i)).toBeInTheDocument();
  });

  it('renders message if fish death data is not available', async () => {
    mockedUseCycle.mockReturnValue(mockCycle);
    mockedFetchLatestFishDeath.mockResolvedValue(null);

    render(<FishDeathDashboard pondId="pond-1" />);
    await waitFor(() => {
      expect(screen.getByText(/Data belum tersedia/i)).toBeInTheDocument();
    });
  });

  it('renders table with fish death data correctly', async () => {
    mockedUseCycle.mockReturnValue(mockCycle);
    mockedFetchLatestFishDeath.mockResolvedValue(mockFishDeath);

    render(<FishDeathDashboard pondId="pond-1" />);

    expect(await screen.findByText(/Dashboard Kematian Ikan/i)).toBeInTheDocument();
    expect(screen.getByText(/100 ekor/)).toBeInTheDocument(); // Bibit
    expect(screen.getByText(/25 ekor/)).toBeInTheDocument(); // Mati
    expect(screen.getByText(/75 ekor/)).toBeInTheDocument(); // Bertahan
  });

  it('renders correctly when fish_amount is undefined (fallback to 0)', async () => {
    mockedUseCycle.mockReturnValue({
      id: 'cycle-2',
      pond_fish_amount: [
        { pond_id: 'pond-3', fish_amount: undefined }, // 👈 fish_amount missing
      ],
    });
  
    mockedFetchLatestFishDeath.mockResolvedValue({
      ...mockFishDeath,
      pond_id: 'pond-3',
    });
  
    render(<FishDeathDashboard pondId="pond-3" />);
  
    // ✅ Expect fallback 0 ekor to appear
    expect(await screen.findByText('0 ekor')).toBeInTheDocument(); // Bibit
    expect(screen.getByText('25 ekor')).toBeInTheDocument(); // Mati
    expect(screen.getByText('75 ekor')).toBeInTheDocument(); // Bertahan
  });
});
