import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishSamplingDashboard from '@/components/fish-sampling/FishSamplingDashboard';
import { useLatestFishSampling } from '@/hooks/useFishSampling';
import { useRouter } from 'next/navigation';

// Mock the hooks and components
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
  const mockRouter = {
    back: jest.fn(),
  };

  beforeEach(() => {
    mockUseRouter.mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it('renders loading state when data is undefined', () => {
    mockUseLatestFishSampling.mockReturnValue(undefined);

    render(<FishSamplingDashboard pondId="pond-1" />);
    
    expect(screen.getByTestId('loading-data')).toBeInTheDocument();
  });

  it('renders empty state when no sampling data exists', () => {
    mockUseLatestFishSampling.mockReturnValue(null);

    render(<FishSamplingDashboard pondId="pond-1" />);
    
    expect(screen.getByTestId('empty-data')).toBeInTheDocument();
    expect(screen.getByText('Dasbor Ukuran Ikan Terbaru')).toBeInTheDocument();
  });

  it('renders dashboard with latest sampling data', () => {
    const mockSampling = {
      fish_weight: 0.18,
      fish_length: 19,
    };
    mockUseLatestFishSampling.mockReturnValue(mockSampling);

    render(<FishSamplingDashboard pondId="pond-1" />);
    
    // Check header and back button
    expect(screen.getByText('Dasbor Ukuran Ikan Terbaru')).toBeInTheDocument();
    expect(screen.getByText('Lihat Riwayat Ukuran Ikan')).toBeInTheDocument();
    
    // Check table headers
    expect(screen.getByText('Parameter')).toBeInTheDocument();
    expect(screen.getByText('Nilai Target')).toBeInTheDocument();
    expect(screen.getByText('Nilai Aktual')).toBeInTheDocument();
    
    // Check weight row
    expect(screen.getByText('Berat Ikan (kg)')).toBeInTheDocument();
    expect(screen.getByText('0.15')).toBeInTheDocument(); // Target
    expect(screen.getByText('0.18')).toBeInTheDocument(); // Actual
    
    // Check length row
    expect(screen.getByText('Panjang Ikan (cm)')).toBeInTheDocument();
    expect(screen.getByText('17')).toBeInTheDocument(); // Target
    expect(screen.getByText('19')).toBeInTheDocument(); // Actual
  });

  it('renders N/A when sampling data has null values', () => {
    const mockSampling = {
      fish_weight: null,
      fish_length: null,
    };
    mockUseLatestFishSampling.mockReturnValue(mockSampling);

    render(<FishSamplingDashboard pondId="pond-1" />);
    
    expect(screen.getAllByText('N/A')).toHaveLength(2);
  });

  it('navigates back when back button is clicked', () => {
    const mockSampling = {
      fish_weight: 0.18,
      fish_length: 19,
    };
    mockUseLatestFishSampling.mockReturnValue(mockSampling);

    render(<FishSamplingDashboard pondId="pond-1" />);
    
    fireEvent.click(screen.getByText('Lihat Riwayat Ukuran Ikan'));
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('matches target values with the constants', () => {
    const mockSampling = {
      fish_weight: 0.18,
      fish_length: 19,
    };
    mockUseLatestFishSampling.mockReturnValue(mockSampling);

    render(<FishSamplingDashboard pondId="pond-1" />);
    
    // Verify target values from the component's constants
    expect(screen.getByText('0.15')).toBeInTheDocument(); // fish_weight target
    expect(screen.getByText('17')).toBeInTheDocument(); // fish_length target
  });
});