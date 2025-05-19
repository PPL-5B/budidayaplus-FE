// __tests__/PondQualityList.test.tsx

import { render, screen } from '@testing-library/react';
import PondQualityList from '@/components/pond-quality/PondQualityList';
import { PondQuality } from '@/types/pond-quality';
import '@testing-library/jest-dom';

// Mock EmptyData to simplify testing
jest.mock('@/components/ui/empty-data', () => ({
  EmptyData: () => <div data-testid="empty-data">No data</div>,
}));

describe('PondQualityList', () => {
  const mockPondQuality: PondQuality = {
    id: '1',
    pond: 'pond-1',
    cycle: 'cycle-1',
    image_name: 'test-image.jpg',
    recorded_at: new Date('2024-05-19T10:30:00Z'),
    water_temperature: 28,
    ph_level: 7.5,
    salinity: 30,
    water_clarity: 45,
    water_circulation: 2,
    dissolved_oxygen: 6.5,
    orp: 250,
    ammonia: 0.2,
    nitrate: 10,
    phosphate: 1.2,
    reporter: {
      id: 1,
      first_name: 'Rani',
      last_name: 'Wijaya',
      phone_number: '085156802896'
    },
  };

  it('should render pond quality data correctly', () => {
    render(<PondQualityList pondQuality={mockPondQuality} />);

    expect(screen.getByText(/oleh Rani Wijaya/)).toBeInTheDocument();
    expect(screen.getByText(/28°C/)).toBeInTheDocument();
    expect(screen.getByText(/7.5/)).toBeInTheDocument();
    expect(screen.getByText(/30/)).toBeInTheDocument();
    expect(screen.getByText(/45/)).toBeInTheDocument();
    expect(screen.getByText(/Lancar/)).toBeInTheDocument();
    expect(screen.getByText(/6.5/)).toBeInTheDocument();
    expect(screen.getByText(/250/)).toBeInTheDocument();
    expect(screen.getByText(/0.2/)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText(/1.2/)).toBeInTheDocument();
  });

  it('should render EmptyData if pondQuality is undefined', () => {
    render(<PondQualityList pondQuality={undefined} />);
    expect(screen.getByTestId('empty-data')).toBeInTheDocument();
  });
});
