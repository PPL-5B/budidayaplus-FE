import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodSamplingHistory from '@/components/food-sampling/FoodSamplingHistory';
import { getFoodSamplingHistory } from '@/lib/food-sampling';
import React from 'react';

jest.mock('@/lib/food-sampling');
const mockedGetFoodSamplingHistory = getFoodSamplingHistory as jest.Mock;

const mockHistoryData = {
  food_samplings: [
    {
      sampling_id: '123',
      pond_id: 'pond-123',
      cycle_id: 'cycle-456',
      food_quantity: 500,
      target_food_quantity: 800,
      recorded_at: new Date('2023-05-15T12:00:00Z'),
      reporter: {
        first_name: 'Rani',
        last_name: 'Wijaya',
      },
    },
    {
      sampling_id: '124',
      pond_id: 'pond-123',
      cycle_id: 'cycle-456',
      food_quantity: 700,
      target_food_quantity: 800,
      recorded_at: new Date('2023-05-16T12:00:00Z'),
      reporter: {
        first_name: 'Andi',
        last_name: 'Sutrisno',
      },
    },
  ],
};

describe('FoodSamplingHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders food sampling history (positive case)', async () => {
    mockedGetFoodSamplingHistory.mockResolvedValueOnce(mockHistoryData);
    render(<FoodSamplingHistory pondId="pond-123" />);
    await waitFor(() => {
      expect(screen.getByText(/Riwayat Jumlah Makanan/i)).toBeInTheDocument();
      expect(screen.getByText(/Rani Wijaya/i)).toBeInTheDocument();
      expect(screen.getByText(/Andi Sutrisno/i)).toBeInTheDocument();
    });
  });

  test('displays formatted date and full name correctly (edge case)', async () => {
    mockedGetFoodSamplingHistory.mockResolvedValueOnce(mockHistoryData);
    render(<FoodSamplingHistory pondId="pond-123" />);
    await waitFor(() => {
      expect(screen.getByText(/Senin, 15 Mei 2023/i)).toBeInTheDocument();
      expect(screen.getByText(/Selasa, 16 Mei 2023/i)).toBeInTheDocument();
    });
  });

  test('renders empty data when history is empty (negative case)', async () => {
    mockedGetFoodSamplingHistory.mockResolvedValueOnce({ food_samplings: [] });
    render(<FoodSamplingHistory pondId="pond-123" />);
    await waitFor(() => {
      expect(screen.getByText(/Belum Ada Data/i)).toBeInTheDocument();
    });
  });

  test('renders empty data when food_samplings is undefined (edge case)', async () => {
    mockedGetFoodSamplingHistory.mockResolvedValueOnce({});
    render(<FoodSamplingHistory pondId="pond-123" />);
    await waitFor(() => {
      expect(screen.getByText(/Belum Ada Data/i)).toBeInTheDocument();
    });
  });

  test('renders loading state initially', async () => {
    mockedGetFoodSamplingHistory.mockResolvedValueOnce(mockHistoryData);
    render(<FoodSamplingHistory pondId="pond-123" />);
    expect(screen.getByText(/Memuat Data Anda/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText(/Memuat Data Anda/i)).not.toBeInTheDocument();
    });
  });
});
