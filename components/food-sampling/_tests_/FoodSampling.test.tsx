import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FoodSampling } from '@/components/food-sampling';
import { getLatestFoodSampling } from '@/lib/food-sampling';

jest.mock('@/lib/food-sampling', () => ({
  getLatestFoodSampling: jest.fn(),
}));

jest.mock('@/components/food-sampling/AddFoodSampling', () => (props: any) => (
  <div data-testid="add-food-sampling">Mock AddFoodSampling - {props.cycleId}</div>
));

jest.mock('@/components/food-sampling/ViewFoodSamplingHistory', () => (props: any) => (
  <div data-testid="view-food-sampling-history">Mock ViewFoodSamplingHistory - {props.pondId}</div>
));

jest.mock('@/components/food-sampling/FoodSamplingList', () => (props: any) => (
  <div data-testid="food-sampling-list">Mock FoodSamplingList - {props.foodSampling ? 'has data' : 'no data'}</div>
));

describe('FoodSampling Component', () => {
  const mockFoodSampling = { id: 'sample-id', quantity: 1000 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with pondId and cycleId (positive case)', async () => {
    (getLatestFoodSampling as jest.Mock).mockResolvedValueOnce(mockFoodSampling);

    const Component = await FoodSampling({ pondId: 'pond-1', cycleId: 'cycle-1' });
    render(Component);

    expect(await screen.findByText(/Jumlah Makanan/i)).toBeInTheDocument();
    expect(await screen.findByTestId('add-food-sampling')).toHaveTextContent('Mock AddFoodSampling - cycle-1');
    expect(await screen.findByTestId('view-food-sampling-history')).toHaveTextContent('Mock ViewFoodSamplingHistory - pond-1');
    expect(await screen.findByTestId('food-sampling-list')).toHaveTextContent('has data');
  });

  test('renders with pondId only (negative case - no cycleId)', async () => {
    const Component = await FoodSampling({ pondId: 'pond-2' });
    render(Component);

    expect(await screen.findByText(/Jumlah Makanan/i)).toBeInTheDocument();
    expect(screen.queryByTestId('add-food-sampling')).not.toBeInTheDocument();
    expect(screen.queryByTestId('view-food-sampling-history')).not.toBeInTheDocument();
    expect(await screen.findByTestId('food-sampling-list')).toHaveTextContent('no data');
  });

  test('renders with undefined foodSampling (edge case)', async () => {
    (getLatestFoodSampling as jest.Mock).mockResolvedValueOnce(undefined);

    const Component = await FoodSampling({ pondId: 'pond-3', cycleId: 'cycle-3' });
    render(Component);

    expect(await screen.findByTestId('food-sampling-list')).toHaveTextContent('no data');
  });
});
