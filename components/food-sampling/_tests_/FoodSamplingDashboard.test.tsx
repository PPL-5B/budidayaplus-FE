import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodSamplingDashboard from '@/components/food-sampling/FoodSamplingDashboard';
import { getLatestFoodSampling } from '@/lib/food-sampling/getLatestFoodSampling';

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

  test('renders title and Utensils icon', async () => {
    mockedGetLatestFoodSampling.mockResolvedValueOnce(mockSamplingData);
   
    render(await FoodSamplingDashboard({ pondId: 'pond-123', cycleId: 'cycle-456' }));

    expect(screen.getByText('Dashboard Sampling Pakan Terbaru')).toBeInTheDocument();
   
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('displays no data message when no sampling found', async () => {
    mockedGetLatestFoodSampling.mockResolvedValueOnce(null);
   
    render(await FoodSamplingDashboard({ pondId: 'pond-123', cycleId: 'cycle-456' }));
    expect(screen.getByText('Data belum tersedia, silakan isi data terlebih dahulu.')).toBeInTheDocument();
  });

  test('renders correct data in the table when sampling exists', async () => {
    mockedGetLatestFoodSampling.mockResolvedValueOnce(mockSamplingData);
   
    render(await FoodSamplingDashboard({ pondId: 'pond-123', cycleId: 'cycle-456' }));
    expect(screen.getByText('500 gram')).toBeInTheDocument();
    
    const targetCells = screen.getAllByText('800 gram');
    expect(targetCells[0]).toBeInTheDocument();
  });

  test('applies red text style when food quantity is below target', async () => {
    mockedGetLatestFoodSampling.mockResolvedValueOnce({
      ...mockSamplingData,
      food_quantity: 500,
      target_food_quantity: 800,
    });
   
    render(await FoodSamplingDashboard({ pondId: 'pond-123', cycleId: 'cycle-456' }));
    const actualCell = screen.getByText('500 gram');
    expect(actualCell).toHaveClass('text-red-500');
  });

  test('does not apply red text when food quantity meets target', async () => {
    mockedGetLatestFoodSampling.mockResolvedValueOnce({
      ...mockSamplingData,
      food_quantity: 800,
      target_food_quantity: 800,
    });
   
    render(await FoodSamplingDashboard({ pondId: 'pond-123', cycleId: 'cycle-456' }));
    
    const cells = screen.getAllByText('800 gram');
    const actualCell = cells[0];
    
    expect(actualCell).not.toHaveClass('text-red-500');
  });

  test('calls getLatestFoodSampling with correct parameters', async () => {
    mockedGetLatestFoodSampling.mockResolvedValueOnce(mockSamplingData);
   
    render(await FoodSamplingDashboard({ pondId: 'pond-123', cycleId: 'cycle-456' }));
    expect(mockedGetLatestFoodSampling).toHaveBeenCalledWith('pond-123', 'cycle-456');
  });
});