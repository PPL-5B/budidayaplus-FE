import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishDeathHistory from '@/components/fish-death/FishDeathHistory';
import { fetchFishDeathHistory } from '@/lib/fish-death/fetchFishDeath';
import { FishDeath } from '@/types/fish-death';

jest.mock('@/lib/fish-death/fetchFishDeath', () => ({
  fetchFishDeathHistory: jest.fn(),
}));

const mockFishDeaths: FishDeath[] = [
  {
      id: '1',
      pond_id: 'pond-1',
      recorded_at: '2024-04-01T10:00:00Z',
      fish_death_count: 12,
      fish_alive_count: 88,
      reporter: {
          id: 1,
          first_name: 'Udin',
          last_name: 'Sedunia',
          phone_number: '08123456789',
      },
      cycle_id: ''
  },
  {
      id: '2',
      pond_id: 'pond-1',
      recorded_at: '2024-03-28T08:00:00Z',
      fish_death_count: 5,
      fish_alive_count: 95,
      reporter: {
          id: 2,
          first_name: 'Ani',
          last_name: 'Wijaya',
          phone_number: '08991234567',
      },
      cycle_id: ''
  },
];

describe('FishDeathHistory', () => {
  beforeEach(() => {
    (fetchFishDeathHistory as jest.Mock).mockResolvedValue({
      fish_deaths: mockFishDeaths,
    });
  });

  it('renders fish death history correctly', async () => {
    render(<FishDeathHistory pondId="pond-1" />);

    // ✅ Title & icon
    expect(await screen.findByText('Riwayat Kematian Ikan')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument(); // SVG icon

    // ✅ Table content
    expect(await screen.findByText('Udin Sedunia')).toBeInTheDocument();
    expect(screen.getByText('Ani Wijaya')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument(); // fish_death_count
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('88')).toBeInTheDocument(); // fish_alive_count
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('01-04-2024')).toBeInTheDocument();
    expect(screen.getByText('28-03-2024')).toBeInTheDocument();
  });
});