import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PondQualityDashboard from '@/components/pond-quality/PondQualityDashboard';
import { getLatestPondDashboard } from '@/lib/pond-quality/getLatestPondDashboard';

jest.mock('@/lib/pond-quality/getLatestPondDashboard');
const mockedGetLatestPondDashboard = getLatestPondDashboard as jest.MockedFunction<typeof getLatestPondDashboard>;

describe('Additional tests for PondQualityDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not call API and stops loading when pondId is missing', async () => {
    render(<PondQualityDashboard pondId="" cycleId="cycle-123" />);
    
    // Loading should quickly disappear
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    // Ensure API wasn't called
    expect(mockedGetLatestPondDashboard).not.toHaveBeenCalled();
    
    // Component should render nothing or just fail gracefully
    expect(screen.queryByText('Dashboard Kualitas Air Today')).not.toBeInTheDocument();
  });

  test('applies red text class when actual value is below the target', async () => {
    // ph_level = 7.0 is below 7.5 target
    mockedGetLatestPondDashboard.mockResolvedValueOnce({
      ph_level: 7.0, 
      salinity: 28, 
      water_temperature: 27, 
      water_clarity: 75
    });
    
    render(<PondQualityDashboard pondId="pond-123" cycleId="cycle-456" />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // The ph_level cell should have the red class because it's below 7.5
    const phLevelCell = screen.getByText('7.0');
    expect(phLevelCell).toHaveClass('text-red-500', 'font-medium');
    
    // The rest might also be below target, so check e.g. water_temperature if needed
    const tempCell = screen.getByText('27');
    expect(tempCell).toHaveClass('text-red-500', 'font-medium');
  });

  test('does not apply red text class when actual value equals or exceeds the target', async () => {
    // ph_level = 7.5 is exactly the target, salinity = 31 is above the target (30)
    mockedGetLatestPondDashboard.mockResolvedValueOnce({
      ph_level: 7.5, 
      salinity: 31, 
      water_temperature: 29, 
      water_clarity: 80
    });
    
    render(<PondQualityDashboard pondId="pond-123" cycleId="cycle-456" />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    // ph_level cell should NOT have red text because it's exactly at the target
    const phLevelCell = screen.getByText('7.5');
    expect(phLevelCell).not.toHaveClass('text-red-500', 'font-medium');

    // salinity (31) is above 30 target, so also should NOT have red text
    const salinityCell = screen.getByText('31');
    expect(salinityCell).not.toHaveClass('text-red-500', 'font-medium');

    // water_temperature (29) is above 28 target
    const temperatureCell = screen.getByText('29');
    expect(temperatureCell).not.toHaveClass('text-red-500', 'font-medium');

    // water_clarity (80) is exactly at the target
    const clarityCell = screen.getByText('80');
    expect(clarityCell).not.toHaveClass('text-red-500', 'font-medium');
  });
});
