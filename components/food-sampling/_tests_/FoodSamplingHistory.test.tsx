import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodSamplingHistory from '@/components/food-sampling/FoodSamplingHistory';
import { getFoodSamplingHistory } from '@/lib/food-sampling';
import { ColumnDef } from '@tanstack/react-table';
import { FoodSampling } from '@/types/food-sampling';

// Mock the imported functions and components
jest.mock('@/lib/food-sampling');
jest.mock('@/components/ui/data-table', () => ({
  DataTable: ({ columns, data }: { 
    columns: ColumnDef<FoodSampling>[];
    data: FoodSampling[] 
  }) => (
    <div data-testid="data-table">
      <div data-testid="column-count">{columns.length}</div>
      <div data-testid="row-count">{data.length}</div>
      {data.map((item, index) => (
        <div key={item.sampling_id} data-testid={`row-${index}`}>
          {JSON.stringify(item)}
        </div>
      ))}
    </div>
  )
}));

const mockedGetFoodSamplingHistory = getFoodSamplingHistory as jest.Mock;

// Mock data
const mockHistoryData = {
  food_samplings: [
    {
      sampling_id: '123',
      pond_id: 'pond-123',
      cycle_id: 'cycle-456',
      food_quantity: 500,
      target_food_quantity: 800,
      recorded_at: new Date('2023-05-15T12:00:00Z'),
    },
    {
      sampling_id: '124',
      pond_id: 'pond-123',
      cycle_id: 'cycle-456',
      food_quantity: 700,
      target_food_quantity: 800,
      recorded_at: new Date('2023-05-16T12:00:00Z'),
    }
  ]
};

describe('FoodSamplingHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders title and History icon', async () => {
    mockedGetFoodSamplingHistory.mockResolvedValueOnce(mockHistoryData);
   
    render(await FoodSamplingHistory({ pondId: 'pond-123' }));
   
    expect(screen.getByText('Riwayat Sampling Pakan')).toBeInTheDocument();
   
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('calls getFoodSamplingHistory with correct parameters', async () => {
    mockedGetFoodSamplingHistory.mockResolvedValueOnce(mockHistoryData);
   
    render(await FoodSamplingHistory({ pondId: 'pond-123' }));
   
    expect(mockedGetFoodSamplingHistory).toHaveBeenCalledWith('pond-123');
  });

  test('renders DataTable with correct data', async () => {
    mockedGetFoodSamplingHistory.mockResolvedValueOnce(mockHistoryData);
   
    render(await FoodSamplingHistory({ pondId: 'pond-123' }));
   
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('row-count')).toHaveTextContent('2');
   
    // Check if the first row data is passed correctly to DataTable
    const firstRowElement = screen.getByTestId('row-0');
    expect(firstRowElement).toHaveTextContent('123');
    expect(firstRowElement).toHaveTextContent('500');
    expect(firstRowElement).toHaveTextContent('800');
  });

  test('renders DataTable with empty array when no history', async () => {
    mockedGetFoodSamplingHistory.mockResolvedValueOnce({ food_samplings: [] });
   
    render(await FoodSamplingHistory({ pondId: 'pond-123' }));
   
    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('row-count')).toHaveTextContent('0');
  });

  test('passes columns to DataTable', async () => {
    mockedGetFoodSamplingHistory.mockResolvedValueOnce(mockHistoryData);
   
    render(await FoodSamplingHistory({ pondId: 'pond-123' }));
   
    // This verifies that columns are passed to the DataTable component
    expect(screen.getByTestId('column-count')).toBeInTheDocument();
  });
});