import React from 'react';
import { render, screen } from '@testing-library/react';
import FishSamplingList from '@/components/fish-sampling/FishSamplingList';
import { FishSampling } from '@/types/fish-sampling';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// Mock the format function to make testing easier
jest.mock('date-fns', () => ({
  format: jest.fn(),
  ...jest.requireActual('date-fns'),
}));

describe('FishSamplingList', () => {
  const mockFishSampling: FishSampling = {
      recorded_at: new Date('2023-05-15').toISOString(),
      reporter: {
          first_name: 'John',
          last_name: 'Doe',
          id: 0,
          phone_number: ''
      },
      fish_weight: 5.2,
      fish_length: 30,
      sampling_id: '',
      pond_id: ''
  };

  beforeEach(() => {
    (format as jest.Mock).mockImplementation((date, formatStr, options) => {
      if (options?.locale === id) {
        return 'Senin, 15 Mei 2023'; // Mocked Indonesian date format
      }
      return date.toString();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with fish sampling data', () => {
    render(<FishSamplingList fishSampling={mockFishSampling} />);

    // Check that the formatted date and reporter name are displayed
    expect(screen.getByText(/Senin, 15 Mei 2023, oleh John/i)).toBeInTheDocument();
    
    // Check fish weight is displayed correctly
    expect(screen.getByText(/Berat \(kg\):/i)).toBeInTheDocument();
    expect(screen.getByText(/5.2/i)).toBeInTheDocument();
    
    // Check fish length is displayed correctly
    expect(screen.getByText(/Panjang \(cm\):/i)).toBeInTheDocument();
    expect(screen.getByText(/30/i)).toBeInTheDocument();
  });

  it('renders EmptyData component when fishSampling is undefined', () => {
    render(<FishSamplingList fishSampling={undefined} />);
    
    // Check that the empty state is rendered
    expect(screen.getByTestId('empty-data')).toBeInTheDocument();
  });

  it('passes additional props to the root div element', () => {
    const testId = 'custom-test-id';
    render(<FishSamplingList fishSampling={mockFishSampling} data-testid={testId} />);
    
    const rootElement = screen.getByTestId(testId);
    expect(rootElement).toBeInTheDocument();
  });

  it('has correct data-testid on root element', () => {
    render(<FishSamplingList fishSampling={mockFishSampling} />);
    
    const rootElement = screen.getByTestId('fish-sampling-list');
    expect(rootElement).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(<FishSamplingList fishSampling={mockFishSampling} />);
    
    const container = screen.getByTestId('fish-sampling-list');
    const innerDiv = container.firstChild;
    
    expect(innerDiv).toHaveClass('bg-[#F1F5FF]');
    expect(innerDiv).toHaveClass('text-[#3B3B3B]');
    expect(innerDiv).toHaveClass('p-4');
    expect(innerDiv).toHaveClass('rounded-md');
    expect(innerDiv).toHaveClass('border');
    expect(innerDiv).toHaveClass('border-[#4D4C4C]');
    expect(innerDiv).toHaveClass('mt-4');
    expect(innerDiv).toHaveClass('space-y-2');
    expect(innerDiv).toHaveClass('text-sm');
  });
});