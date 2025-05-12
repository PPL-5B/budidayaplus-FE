import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodSamplingTableColumns from '@/components/food-sampling/FoodSamplingTableColumns';
import { FoodSampling } from '@/types/food-sampling';

const mockUser = {
  id: 1,
  first_name: 'Udin',
  last_name: 'Sedunia',
  phone_number: '08123456789',
};

const mockData: FoodSampling[] = [
  {
    sampling_id: 'abc',
    pond_id: 'pond-1',
    cycle_id: 'cycle-1',
    reporter: mockUser,
    food_quantity: 700,
    target_food_quantity: 800,
    recorded_at: new Date('2023-05-16T12:00:00Z'),
  },
  {
    sampling_id: 'def',
    pond_id: 'pond-2',
    cycle_id: 'cycle-2',
    reporter: mockUser,
    food_quantity: 600,
    target_food_quantity: 800,
    recorded_at: new Date('2023-05-17T12:00:00Z'),
  },
];

describe('FoodSamplingTableColumns', () => {
  test('renders title correctly', () => {
    render(<FoodSamplingTableColumns data={mockData} />);
    expect(screen.getByText(/Riwayat Jumlah Makanan/i)).toBeInTheDocument();
  });

  test('renders with empty data (negative case)', () => {
    render(<FoodSamplingTableColumns data={[]} />);
    expect(screen.getByText(/Belum ada data makanan/i)).toBeInTheDocument();
  });

  test('renders with one item only (edge case)', () => {
    render(<FoodSamplingTableColumns data={[mockData[0]]} />);
    expect(screen.getByText(/Udin Sedunia/i)).toBeInTheDocument();
    expect(screen.getByText(/700/i)).toBeInTheDocument();
  });

  test('formats date correctly using locale', () => {
    render(<FoodSamplingTableColumns data={[mockData[0]]} />);
    expect(screen.getByText(/Selasa, 16 Mei 2023/i)).toBeInTheDocument(); // 'Selasa' is Tuesday in Indonesian
  });
});
