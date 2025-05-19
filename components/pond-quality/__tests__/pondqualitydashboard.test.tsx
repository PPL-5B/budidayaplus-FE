/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PondQualityDashboard from '@/components/pond-quality/PondQualityDashboard';
import { getLatestPondDashboard } from '@/lib/pond-quality/getLatestPondDashboard';

// Stub PondAlertPopup to a simple div so we can assert on it:
jest.mock(
  '@/components/pond-quality/PondQualityAlerts',
  () => (props: { alerts: any[] }) => (
    <div data-testid="pond-alert-popup">{props.alerts.length} alerts</div>
  )
);

jest.mock('@/lib/pond-quality/getLatestPondDashboard');

describe('PondQualityDashboard', () => {
  const sampleData = {
    ph_level: 7.0,
    salinity: 25,
    water_temperature: 26,
    water_clarity: 70,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading if no pondId or cycleId', () => {
    render(<PondQualityDashboard pondId="" cycleId={null} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders loading while fetching', () => {
    // never resolves
    (getLatestPondDashboard as jest.Mock).mockReturnValueOnce(new Promise(() => {}));
    render(<PondQualityDashboard pondId="1" cycleId="123" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders dashboard with data and shows alerts for below-target values', async () => {
    (getLatestPondDashboard as jest.Mock).mockResolvedValue(sampleData);
    render(<PondQualityDashboard pondId="1" cycleId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/dashboard kualitas air terbaru/i)).toBeInTheDocument();
    });

    // Check each actual value
    expect(screen.getByText('7.0')).toHaveClass('text-red-500');
    expect(screen.getByText('25')).toHaveClass('text-red-500');
    expect(screen.getByText('26')).toHaveClass('text-red-500');
    expect(screen.getByText('70')).toHaveClass('text-red-500');

    // And the stubbed alert popup shows 4 alerts
    expect(screen.getByTestId('pond-alert-popup')).toHaveTextContent('4 alerts');
  });

  it('renders fallback when data is null', async () => {
    (getLatestPondDashboard as jest.Mock).mockResolvedValue(null);
    render(<PondQualityDashboard pondId="1" cycleId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/data belum tersedia/i)).toBeInTheDocument();
    });
  });

  it('renders fallback when fetch throws an error', async () => {
    const error = new Error('Fetch failed');
    (getLatestPondDashboard as jest.Mock).mockRejectedValue(error);
    render(<PondQualityDashboard pondId="1" cycleId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/data belum tersedia/i)).toBeInTheDocument();
    });
    expect(console.error).toHaveBeenCalledWith('Failed to fetch dashboard data:', error);
  });

  it('does not show alerts and no red class when values meet or exceed targets', async () => {
    const noAlertData = {
      ph_level: 7.5,
      salinity: 30,
      water_temperature: 28,
      water_clarity: 80,
    };
    (getLatestPondDashboard as jest.Mock).mockResolvedValue(noAlertData);
    render(<PondQualityDashboard pondId="1" cycleId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/dashboard kualitas air terbaru/i)).toBeInTheDocument();
    });

    // All values are at or above target → no red class
    expect(screen.getByText('7.5')).not.toHaveClass('text-red-500');
    expect(screen.getByText('30')).not.toHaveClass('text-red-500');
    expect(screen.getByText('28')).not.toHaveClass('text-red-500');
    expect(screen.getByText('80')).not.toHaveClass('text-red-500');

    // And no alert popup rendered
    expect(screen.queryByTestId('pond-alert-popup')).toBeNull();
  });

  it('displays N/A for missing parameters and does not show alerts', async () => {
    const partialData = { ph_level: 7.5 }; // only ph_level present
    (getLatestPondDashboard as jest.Mock).mockResolvedValue(partialData);
    render(<PondQualityDashboard pondId="1" cycleId="123" />);

    await waitFor(() => {
      expect(screen.getByText(/dashboard kualitas air terbaru/i)).toBeInTheDocument();
    });

    // ph_level displays correctly
    expect(screen.getByText('7.5')).toBeInTheDocument();

    // The other three show 'N/A'
    const nas = screen.getAllByText('N/A');
    expect(nas).toHaveLength(3);
    nas.forEach(cell => {
      expect(cell).not.toHaveClass('text-red-500');
    });

    // No alerts
    expect(screen.queryByTestId('pond-alert-popup')).toBeNull();
  });
});
