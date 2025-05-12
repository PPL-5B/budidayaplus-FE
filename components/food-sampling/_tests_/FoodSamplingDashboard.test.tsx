import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodSamplingDashboard from '@/components/food-sampling/FoodSamplingDashboard';
import { getLatestFoodSampling } from '@/lib/food-sampling/getLatestFoodSampling';
import React from 'react';

const mockBack = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

jest.mock('@/lib/food-sampling/getLatestFoodSampling');
const mockedGetLatestFoodSampling = getLatestFoodSampling as jest.Mock;

const mockSamplingData = {
  sampling_id: '123',
  pond_id: 'pond-123',
  cycle_id: 'cycle-456',
  food_quantity: 500,
  target_food_quantity: 800,
  recorded_at: new Date('2023-05-15T12:00:00Z'),
};

describe('FoodSamplingDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders table when data is available (positive case)', async () => {
    mockedGetLatestFoodSampling.mockResolvedValueOnce(mockSamplingData);
    render(<FoodSamplingDashboard pondId="pond-123" cycleId="cycle-456" />);
    await waitFor(() => {
      expect(screen.getByText(/Kuantitas/i)).toBeInTheDocument();
      expect(screen.getByText(/800 gram/i)).toBeInTheDocument();
      expect(screen.getByText(/500 gram/i)).toBeInTheDocument();
    });
  });

  test('renders warning class when actual < target (edge case)', async () => {
    mockedGetLatestFoodSampling.mockResolvedValueOnce(mockSamplingData);
    render(<FoodSamplingDashboard pondId="pond-123" cycleId="cycle-456" />);
    const actualCell = await screen.findByText(/500 gram/);
    expect(actualCell).toHaveClass('text-red-600');
  });

  test('renders no warning class when actual >= target (edge case)', async () => {
    mockedGetLatestFoodSampling.mockResolvedValueOnce({
      ...mockSamplingData,
      food_quantity: 900,
      target_food_quantity: 800,
    });
    render(<FoodSamplingDashboard pondId="pond-123" cycleId="cycle-456" />);
    const actualCell = await screen.findByText(/900 gram/);
    expect(actualCell).not.toHaveClass('text-red-600');
  });

  test('back button calls router.back', async () => {
    mockedGetLatestFoodSampling.mockResolvedValueOnce(mockSamplingData);
    render(<FoodSamplingDashboard pondId="pond-123" cycleId="cycle-456" />);
    const backButton = await screen.findByText(/Lihat Riwayat Jumlah Makanan/i);
    fireEvent.click(backButton);
    expect(mockBack).toHaveBeenCalled();
  });

  test('renders empty state when data is undefined (explicit branch coverage)', async () => {
    mockedGetLatestFoodSampling.mockResolvedValueOnce(undefined); // triggers `data ?? null`
    render(<FoodSamplingDashboard pondId="pond-123" cycleId="cycle-456" />);
    await waitFor(() => {
      expect(screen.getByText(/Belum Ada Data/i)).toBeInTheDocument(); // ✅ fix: use correct text from EmptyData
    });
  });
});