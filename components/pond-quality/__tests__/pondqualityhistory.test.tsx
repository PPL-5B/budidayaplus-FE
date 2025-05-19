/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PondQualityHistory from '@/components/pond-quality/PondQualityHistory';

jest.mock('@/lib/pond-quality/getPondQualityHistory', () => ({
  getPondQualityHistory: jest.fn(),
}));

import { getPondQualityHistory } from '@/lib/pond-quality/getPondQualityHistory';

describe('PondQualityHistory', () => {
  const sampleHistory = {
    cycle_id: '123',
    pond_qualities: [
      {
        id: '1',
        recorded_at: '2025-05-18T00:00:00Z',
        reporter: { first_name: 'qw', last_name: 's' },
        water_temperature: 25,
        ph_level: 7,
        salinity: 30,
        water_clarity: 60,
        water_circulation: 1,
        dissolved_oxygen: 5,
        orp: 100,
        ammonia: 0.2,
        nitrate: 5,
        phosphate: 0.3,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders fallback if no data', async () => {
    (getPondQualityHistory as jest.Mock).mockResolvedValue({
      cycle_id: '123',
      pond_qualities: [],
    });

    render(<PondQualityHistory pondId="1" />);
    await waitFor(() => {
      expect(screen.getByText(/belum ada data/i)).toBeInTheDocument();
    });
  });

  it('renders history data correctly', async () => {
    (getPondQualityHistory as jest.Mock).mockResolvedValue(sampleHistory);

    render(<PondQualityHistory pondId="1" />);
    await waitFor(() => {
      expect(screen.getByText(/riwayat kualitas kolam/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/oleh qw s/i)).toBeInTheDocument();
    expect(screen.getByText(/25°C/)).toBeInTheDocument();
    expect(screen.getByText(/7/)).toBeInTheDocument();
    expect(screen.getByText(/0.3/)).toBeInTheDocument();
  });
});
