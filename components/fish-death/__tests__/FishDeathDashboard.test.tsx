import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishDeathDashboard from '@/components/fish-death/FishDeathDashboard';
import { useLatestFishDeath } from '@/hooks/useFishDeath';
import { useCycle } from '@/hooks/useCycle';
import { useRouter } from 'next/navigation';

// Mock hooks and dependencies
jest.mock('@/hooks/useFishDeath');
jest.mock('@/hooks/useCycle');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/components/ui/loading-data', () => ({
  LoadingData: () => <div data-testid="loading-data">Loading...</div>,
}));
jest.mock('@/components/ui/empty-data', () => ({
  EmptyData: ({ title }: { title?: string }) => (
    <div data-testid="empty-data">{title ?? 'No data available'}</div>
  ),
}));

const mockUseLatestFishDeath = useLatestFishDeath as jest.Mock;
const mockUseCycle = useCycle as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('FishDeathDashboard', () => {
  const pondId = 'pond-1';
  const mockRouter = { back: jest.fn() };
  const mockCycle = {
    pond_fish_amount: [
      { pond_id: 'pond-1', fish_amount: 1000 },
      { pond_id: 'pond-2', fish_amount: 2000 },
    ],
  };

  beforeEach(() => {
    mockUseRouter.mockReturnValue(mockRouter);
    mockUseCycle.mockReturnValue(mockCycle);
    jest.clearAllMocks();
  });

  it('shows loading state when data is undefined', () => {
    mockUseLatestFishDeath.mockReturnValue(undefined);
    render(<FishDeathDashboard pondId={pondId} />);

    expect(screen.getByTestId('loading-data')).toBeInTheDocument();
  });

  it('shows empty state when data is null', () => {
    mockUseLatestFishDeath.mockReturnValue(null);
    render(<FishDeathDashboard pondId={pondId} />);

    expect(screen.getByTestId('empty-data')).toBeInTheDocument();
    expect(screen.getByText('Dasbor Kematian Ikan Terbaru')).toBeInTheDocument();
  });

  it('shows empty state with message when cycle is not available', () => {
    mockUseCycle.mockReturnValue(null);
    mockUseLatestFishDeath.mockReturnValue(null);

    render(<FishDeathDashboard pondId={pondId} />);

    expect(screen.getByTestId('empty-data')).toBeInTheDocument();
    expect(
      screen.getByText('Data siklus belum tersedia, silakan buat siklus terlebih dahulu.')
    ).toBeInTheDocument();
  });

  it('shows empty state with message when pond is not found in cycle', () => {
    mockUseCycle.mockReturnValue({
      pond_fish_amount: [{ pond_id: 'different-pond', fish_amount: 1000 }],
    });
    mockUseLatestFishDeath.mockReturnValue(null);

    render(<FishDeathDashboard pondId={pondId} />);

    expect(screen.getByTestId('empty-data')).toBeInTheDocument();
    expect(screen.getByText('Kolam tidak ditemukan dalam siklus ini.')).toBeInTheDocument();
  });

  it('shows table when data is available', () => {
    mockUseLatestFishDeath.mockReturnValue({
      fish_death_count: 200,
      fish_alive_count: 800,
    });

    render(<FishDeathDashboard pondId={pondId} />);

    expect(screen.getByText('Dasbor Kematian Ikan Terbaru')).toBeInTheDocument();
    expect(screen.getByText('Parameter')).toBeInTheDocument();
    expect(screen.getByText('Nilai')).toBeInTheDocument();
    expect(screen.getByText('Bibit Ditebar')).toBeInTheDocument();
    expect(screen.getByText('1000 ekor')).toBeInTheDocument();
    expect(screen.getByText('Ikan Mati')).toBeInTheDocument();
    expect(screen.getByText('200 ekor')).toBeInTheDocument();
    expect(screen.getByText('Ikan Bertahan')).toBeInTheDocument();
    expect(screen.getByText('800 ekor')).toBeInTheDocument();
  });

  it('navigates back when back button is clicked', () => {
    mockUseLatestFishDeath.mockReturnValue({
      fish_death_count: 200,
      fish_alive_count: 800,
    });

    render(<FishDeathDashboard pondId={pondId} />);
    fireEvent.click(screen.getByText('Kembali'));
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('handles zero values correctly', () => {
    mockUseLatestFishDeath.mockReturnValue({
      fish_death_count: 0,
      fish_alive_count: 1000,
    });

    const zeroFishCycle = {
      pond_fish_amount: [{ pond_id: 'pond-1', fish_amount: 0 }],
    };
    mockUseCycle.mockReturnValue(zeroFishCycle);

    render(<FishDeathDashboard pondId={pondId} />);

    const zeroElements = screen.getAllByText('0 ekor');
    expect(zeroElements).toHaveLength(2); // Verifikasi jumlah elemen dengan teks "0 ekor"
    expect(zeroElements[0]).toBeInTheDocument(); // Untuk fish_amount
    expect(zeroElements[1]).toBeInTheDocument(); // Untuk fish_death_count
    expect(screen.getByText('1000 ekor')).toBeInTheDocument(); // Untuk fish_alive_count
});

  it('handles null values correctly in fish amount', () => {
    mockUseLatestFishDeath.mockReturnValue({
      fish_death_count: 100,
      fish_alive_count: 900,
    });

    const nullFishCycle = {
      pond_fish_amount: [{ pond_id: 'pond-1', fish_amount: null }],
    };
    mockUseCycle.mockReturnValue(nullFishCycle);

    render(<FishDeathDashboard pondId={pondId} />);

    expect(screen.getByText('0 ekor')).toBeInTheDocument(); // Default value for null fish_amount
  });
});