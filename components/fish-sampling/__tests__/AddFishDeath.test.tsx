import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFishDeath from '@/components/fish-sampling/AddFishDeath';
import { addFishDeath, getLatestFishDeath } from '@/lib/fish-sampling/addFishDeath';

// Mock responses
const mockSuccessResponse = (count: number) => ({
  success: true,
  data: { fish_death_count: count }
});

const mockErrorResponse = (message: string) => ({
  success: false,
  message
});

// Type-safe mock
jest.mock('@/lib/fish-sampling/addFishDeath', () => ({
  addFishDeath: jest.fn<Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }>, [string, string, number]>(),

  getLatestFishDeath: jest.fn<Promise<{
    success: boolean;
    fish_death_count?: number;
    message?: string;
  }>, [string, string]>()
}));

const mockAddFishDeath = addFishDeath as jest.MockedFunction<typeof addFishDeath>;
const mockGetLatestFishDeath = getLatestFishDeath as jest.MockedFunction<typeof getLatestFishDeath>;

describe('AddFishDeath Component', () => {
  const pondId = 'pond-123';
  const cycleId = 'cycle-456';

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetLatestFishDeath.mockResolvedValue({
      success: true,
      fish_death_count: 5
    });
    mockAddFishDeath.mockResolvedValue(mockSuccessResponse(10));
  });

  test('renders loading state initially', async () => {
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    expect(screen.getByTestId('loading-text')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('death-count-value')).toHaveTextContent('5');
    });
  });

  test('opens confirm modal when existing data > 0', async () => {
    mockGetLatestFishDeath.mockResolvedValueOnce({
      success: true,
      fish_death_count: 10
    });
    
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('open-modal-button'));
      expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    });
  });

  test('opens input modal directly when no existing data', async () => {
    mockGetLatestFishDeath.mockResolvedValueOnce({
      success: true,
      fish_death_count: 0
    });
    
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('open-modal-button'));
      expect(screen.getByTestId('input-modal')).toBeInTheDocument();
    });
  });

  test('transitions from confirm to input modal', async () => {
    mockGetLatestFishDeath.mockResolvedValueOnce({
      success: true,
      fish_death_count: 10
    });
    
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('open-modal-button'));
      fireEvent.click(screen.getByTestId('confirm-button'));
      expect(screen.getByTestId('input-modal')).toBeInTheDocument();
    });
  });

  test('validates input - empty, zero, and NaN', async () => {
    mockGetLatestFishDeath.mockResolvedValueOnce({
      success: true,
      fish_death_count: 0
    });
    
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('open-modal-button'));
    });

    // Test empty input
    fireEvent.click(screen.getByTestId('submit-button'));
    expect(await screen.findByTestId('error-message')).toHaveTextContent('Jumlah kematian ikan harus lebih dari 0.');

    // Test zero input
    fireEvent.change(screen.getByTestId('death-count-input'), { target: { value: '0' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    expect(await screen.findByTestId('error-message')).toHaveTextContent('Jumlah kematian ikan harus lebih dari 0.');

    // Test NaN input
    fireEvent.change(screen.getByTestId('death-count-input'), { target: { value: 'abc' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    expect(await screen.findByTestId('error-message')).toHaveTextContent('Jumlah kematian ikan harus lebih dari 0.');
  });

  test('submits valid input successfully', async () => {
    const mockUpdate = jest.fn();
    mockGetLatestFishDeath.mockResolvedValueOnce({
      success: true,
      fish_death_count: 0
    });
    
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} onFishDeathUpdate={mockUpdate} />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('open-modal-button'));
    });

    fireEvent.change(screen.getByTestId('death-count-input'), { target: { value: '10' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    
    await waitFor(() => {
      expect(mockAddFishDeath).toHaveBeenCalledWith(pondId, cycleId, 10);
      expect(mockUpdate).toHaveBeenCalledWith(10);
      expect(screen.queryByTestId('input-modal')).not.toBeInTheDocument();
    });
  });

  test('handles API failure on submit', async () => {
    mockAddFishDeath.mockResolvedValueOnce(mockErrorResponse('API Error'));
    mockGetLatestFishDeath.mockResolvedValueOnce({
      success: true,
      fish_death_count: 0
    });
    
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('open-modal-button'));
    });

    fireEvent.change(screen.getByTestId('death-count-input'), { target: { value: '5' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    
    expect(await screen.findByTestId('error-message')).toHaveTextContent('API Error');
  });

  test('handles initial data fetch error', async () => {
    mockGetLatestFishDeath.mockRejectedValueOnce(new Error('Fetch error'));
    
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('death-count-value')).toHaveTextContent('0');
    });
  });

  test('shows loading state during submission', async () => {
    mockAddFishDeath.mockImplementationOnce(
      () => new Promise(resolve => setTimeout(() => resolve(mockSuccessResponse(10)), 500))
    );
    
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('open-modal-button'));
    });

    fireEvent.change(screen.getByTestId('death-count-input'), { target: { value: '3' } });
    fireEvent.click(screen.getByTestId('submit-button'));
    
    expect(screen.getByTestId('submit-button')).toHaveTextContent('Menyimpan...');
    
    await waitFor(() => {
      expect(screen.getByTestId('submit-button')).toHaveTextContent('Simpan');
    });
  });
});