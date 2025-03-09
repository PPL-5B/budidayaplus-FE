import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import PondQualityDashboard from '@/components/pond-quality/PondQualityDashboard';
import { getLatestPondDashboard } from '@/lib/pond-quality/getLatestPondDashboard';

jest.mock('@/lib/pond-quality/getLatestPondDashboard');
const mockedGetLatestPondDashboard = getLatestPondDashboard as jest.MockedFunction<typeof getLatestPondDashboard>;

describe('PondQualityDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockPondData = {
    ph_level: 7.2,
    salinity: 28,
    water_temperature: 27.5,
    water_clarity: 75
  };

  test('renders loading state initially', async () => {
    mockedGetLatestPondDashboard.mockResolvedValueOnce(mockPondData);
    
    render(<PondQualityDashboard pondId="pond-123" cycleId="cycle-456" />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  test('renders dashboard with data when API call succeeds', async () => {
    mockedGetLatestPondDashboard.mockResolvedValueOnce(mockPondData);
    
    render(<PondQualityDashboard pondId="pond-123" cycleId="cycle-456" />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Dashboard Kualitas Air Today')).toBeInTheDocument();
    
    expect(screen.getByText('ph level')).toBeInTheDocument();
    expect(screen.getByText('salinity')).toBeInTheDocument();
    expect(screen.getByText('water temperature')).toBeInTheDocument();
    expect(screen.getByText('water clarity')).toBeInTheDocument();
    
    const rows = screen.getAllByRole('row');
    
    expect(rows[1]).toHaveTextContent('ph level');
    expect(rows[1]).toHaveTextContent('7.2');
    expect(rows[1]).toHaveTextContent('7.5');
    
    expect(rows[2]).toHaveTextContent('salinity');
    expect(rows[2]).toHaveTextContent('28');
    expect(rows[2]).toHaveTextContent('30');
    
    expect(rows[3]).toHaveTextContent('water temperature');
    expect(rows[3]).toHaveTextContent('27.5');
    expect(rows[3]).toHaveTextContent('28');
    
    expect(rows[4]).toHaveTextContent('water clarity');
    expect(rows[4]).toHaveTextContent('75');
    expect(rows[4]).toHaveTextContent('80');
  });

  test('renders error message when API call fails', async () => {
    mockedGetLatestPondDashboard.mockRejectedValueOnce(new Error('API Error'));
    
    render(<PondQualityDashboard pondId="pond-123" cycleId="cycle-456" />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
    
    expect(screen.queryByText('Dashboard Kualitas Air Today')).not.toBeInTheDocument();
  });

  test('renders error message when API returns no data', async () => {
    mockedGetLatestPondDashboard.mockResolvedValueOnce(null);
    
    render(<PondQualityDashboard pondId="pond-123" cycleId="cycle-456" />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('Failed to load data')).toBeInTheDocument();
  });

  test('does not call API when cycleId is null', async () => {
    render(<PondQualityDashboard pondId="pond-123" cycleId={null} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(mockedGetLatestPondDashboard).not.toHaveBeenCalled();
  });

  test('renders partial data correctly', async () => {
    const partialData = {
      ph_level: 7.2,
      salinity: 28
    };
    
    mockedGetLatestPondDashboard.mockResolvedValueOnce(partialData);
    
    render(<PondQualityDashboard pondId="pond-123" cycleId="cycle-456" />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByRole('table')).toBeInTheDocument();

    expect(screen.getByText('ph level')).toBeInTheDocument();
    expect(screen.getByText('salinity')).toBeInTheDocument();
    expect(screen.getByText('water temperature')).toBeInTheDocument();
    expect(screen.getByText('water clarity')).toBeInTheDocument();
    
    const rows = screen.getAllByRole('row');
    
    expect(rows[1]).toHaveTextContent('ph level');
    expect(rows[1]).toHaveTextContent('7.2');
    
    expect(rows[2]).toHaveTextContent('salinity');
    expect(rows[2]).toHaveTextContent('28');
    
    const naValues = screen.getAllByText('N/A');
    expect(naValues.length).toBe(2);
  });
});