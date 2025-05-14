import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishSamplingDashboard from '@/components/fish-sampling/FishSamplingDashboard';
import { useLatestFishSampling } from '@/hooks/useFishSampling';
import { useRouter } from 'next/navigation';

// Mock hooks and dependencies
jest.mock('@/hooks/useFishSampling');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@/components/ui/loading-data', () => ({
  LoadingData: () => <div data-testid="loading-data">Loading...</div>,
}));
jest.mock('@/components/ui/empty-data', () => ({
  EmptyData: () => <div data-testid="empty-data">No data available</div>,
}));

const mockUseLatestFishSampling = useLatestFishSampling as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;

describe('FishSamplingDashboard', () => {
  const pondId = 'pond-1';
  const mockRouter = { back: jest.fn() };

  beforeEach(() => {
    mockUseRouter.mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it('shows loading state when data is undefined', () => {
    mockUseLatestFishSampling.mockReturnValue(undefined);
    render(<FishSamplingDashboard pondId={pondId} />);

    expect(screen.getByTestId('loading-data')).toBeInTheDocument();
  });

  it('shows empty state when data is null', () => {
    mockUseLatestFishSampling.mockReturnValue(null);
    render(<FishSamplingDashboard pondId={pondId} />);

    expect(screen.getByTestId('empty-data')).toBeInTheDocument();
    expect(screen.getByText('Dasbor Ukuran Ikan Terbaru')).toBeInTheDocument();
  });

  it('shows table when data is available', () => {
    mockUseLatestFishSampling.mockReturnValue({
      fish_weight: 0.2,
      fish_length: 20,
    });

    render(<FishSamplingDashboard pondId={pondId} />);

    expect(screen.getByText('Dasbor Ukuran Ikan Terbaru')).toBeInTheDocument();
    expect(screen.getByText('Parameter')).toBeInTheDocument();
    expect(screen.getByText('Nilai Target')).toBeInTheDocument();
    expect(screen.getByText('Nilai Aktual')).toBeInTheDocument();
    expect(screen.getByText('Berat Ikan (kg)')).toBeInTheDocument();
    expect(screen.getByText('0.15')).toBeInTheDocument();
    expect(screen.getByText('0.2')).toBeInTheDocument();
    expect(screen.getByText('Panjang Ikan (cm)')).toBeInTheDocument();
    expect(screen.getByText('17')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('renders N/A when fish_weight and fish_length are null', () => {
    mockUseLatestFishSampling.mockReturnValue({
      fish_weight: null,
      fish_length: null,
    });

    render(<FishSamplingDashboard pondId={pondId} />);
    const naElements = screen.getAllByText('N/A');
    expect(naElements).toHaveLength(2);
  });

  it('navigates back when back button is clicked', () => {
    mockUseLatestFishSampling.mockReturnValue({
      fish_weight: 1,
      fish_length: 2,
    });

    render(<FishSamplingDashboard pondId={pondId} />);
    fireEvent.click(screen.getByText('Lihat Riwayat Ukuran Ikan'));
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('uses correct target values from constants', () => {
    mockUseLatestFishSampling.mockReturnValue({
      fish_weight: 1,
      fish_length: 2,
    });

    render(<FishSamplingDashboard pondId={pondId} />);
    expect(screen.getByText('0.15')).toBeInTheDocument();
    expect(screen.getByText('17')).toBeInTheDocument();
  });
});
