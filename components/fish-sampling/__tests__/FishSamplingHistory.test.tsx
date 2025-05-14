import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishSamplingHistory from '@/components/fish-sampling/FishSamplingHistory';
import * as fishSamplingAPI from '@/lib/fish-sampling';

// Mock fetchFishSamplingHistory
jest.mock('@/lib/fish-sampling');
const mockFetchFishSamplingHistory = fishSamplingAPI.fetchFishSamplingHistory as jest.Mock;

describe('FishSamplingHistory', () => {
  const pondId = 'test-pond-id';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    mockFetchFishSamplingHistory.mockImplementation(() => new Promise(() => {})); // never resolves

    render(<FishSamplingHistory pondId={pondId} />);

    expect(screen.getByTestId('loading-data')).toBeInTheDocument();
  });

  it('renders empty state when no data is available', async () => {
    mockFetchFishSamplingHistory.mockResolvedValue({ fish_samplings: [] });

    await act(async () => {
      render(<FishSamplingHistory pondId={pondId} />);
    });

    expect(screen.getByTestId('empty-data')).toBeInTheDocument();
  });

  it('renders sampling history cards when data is available', async () => {
    mockFetchFishSamplingHistory.mockResolvedValue({
      fish_samplings: [
        {
          pond_id: '1',
          sampling_id: '1',
          fish_weight: 3,
          fish_length: 10,
          recorded_at: '2024-10-31T00:00:00Z',
          reporter: {
            first_name: 'Ayu',
            last_name: 'Lestari',
          },
        },
      ],
    });

    await act(async () => {
      render(<FishSamplingHistory pondId={pondId} />);
    });

    expect(screen.getByText(/Ayu Lestari/)).toBeInTheDocument();
    expect(screen.getByText(/Berat Ikan \(kg\):/)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/Panjang Ikan \(cm\):/)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText(/oleh Ayu Lestari/)).toBeInTheDocument();
  });

  it('renders multiple history entries correctly', async () => {
    mockFetchFishSamplingHistory.mockResolvedValue({
      fish_samplings: [
        {
          pond_id: '1',
          sampling_id: '1',
          fish_weight: 2.5,
          fish_length: 12,
          recorded_at: '2024-10-01T00:00:00Z',
          reporter: {
            first_name: 'Budi',
            last_name: 'Santoso',
          },
        },
        {
          pond_id: '1',
          sampling_id: '2',
          fish_weight: 4,
          fish_length: 18,
          recorded_at: '2024-10-02T00:00:00Z',
          reporter: {
            first_name: 'Citra',
            last_name: 'Rahma',
          },
        },
      ],
    });

    await act(async () => {
      render(<FishSamplingHistory pondId={pondId} />);
    });

    expect(screen.getByText(/Budi Santoso/)).toBeInTheDocument();
    expect(screen.getByText(/Citra Rahma/)).toBeInTheDocument();
    expect(screen.getByText('2.5')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('18')).toBeInTheDocument();
  });

  it('handles undefined fish_samplings by setting empty array', async () => {
    mockFetchFishSamplingHistory.mockResolvedValue({ 
      fish_samplings: undefined // or null
    });

    await act(async () => {
      render(<FishSamplingHistory pondId={pondId} />);
    });

    // Verify empty state is rendered
    expect(screen.getByTestId('empty-data')).toBeInTheDocument();
  });
});
