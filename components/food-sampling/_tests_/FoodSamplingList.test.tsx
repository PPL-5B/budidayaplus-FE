import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodSamplingList from '../FoodSamplingList';
import { FoodSampling } from '@/types/food-sampling';
import { formatDate } from 'date-fns';
import { id } from 'date-fns/locale';

const mockUser = {
  id: 99,
  first_name: 'udin',
  last_name: 'sedunia',
  phone_number: '1234567890'
};

const mockFoodSampling: FoodSampling = {
  sampling_id: '123',
  pond_id: 'pond-456',
  cycle_id: 'cycle-789',
  reporter: mockUser,
  food_quantity: 500,
  recorded_at: new Date('2023-05-15T12:00:00Z'),
  target_food_quantity: 800
};

const mockHighQuantityFoodSampling: FoodSampling = {
  ...mockFoodSampling,
  food_quantity: 1200 // Above the threshold of 1000
};

describe('FoodSamplingList Component', () => {
  test('renders with food sampling data correctly', () => {
    render(<FoodSamplingList foodSampling={mockFoodSampling} />);
    
    // Check if the component is rendered
    expect(screen.getByTestId('food-sampling-list')).toBeInTheDocument();
    
    // Check reporter name
    expect(screen.getByText('udin sedunia')).toBeInTheDocument();
    
    // Check date formatting
    const expectedDate = formatDate(mockFoodSampling.recorded_at, 'EEEE, dd MMMM yyyy', { locale: id });
    expect(screen.getByTestId('fish-sample-date')).toHaveTextContent(expectedDate);
    
    // Check food quantity
    expect(screen.getByText('500 gr')).toBeInTheDocument();
    
    // Food quantity should not have red text for values under threshold
    const quantityElement = screen.getByText('500 gr');
    expect(quantityElement).not.toHaveClass('text-red-500');
    expect(quantityElement).toHaveClass('text-neutral-600');
  });
  
  test('displays warning color for food quantity above threshold', () => {
    render(<FoodSamplingList foodSampling={mockHighQuantityFoodSampling} />);
    
    // Check if high quantity is displayed
    expect(screen.getByText('1200 gr')).toBeInTheDocument();
    
    // Food quantity should have red text for values over threshold
    const quantityElement = screen.getByText('1200 gr');
    expect(quantityElement).toHaveClass('text-red-500');
    expect(quantityElement).not.toHaveClass('text-neutral-600');
  });
  
  test('displays no data message when foodSampling is undefined', () => {
    render(<FoodSamplingList foodSampling={undefined} />);
    
    // Check if no data message is displayed
    expect(screen.getByText('Tidak ada data sampling makanan')).toBeInTheDocument();
    
    // Verify that other elements don't exist
    expect(screen.queryByTestId('fish-sample-date')).not.toBeInTheDocument();
    expect(screen.queryByText(/gr$/)).not.toBeInTheDocument();
  });
  
  test('passes extra HTML attributes correctly', () => {
    render(<FoodSamplingList foodSampling={mockFoodSampling} className="test-class" data-custom="custom-attr" />);
    
    // Check if custom props are passed
    const container = screen.getByTestId('food-sampling-list');
    expect(container).toHaveClass('test-class');
    expect(container).toHaveAttribute('data-custom', 'custom-attr');
  });
  
  test('renders with the Package icon for food quantity', () => {
    render(<FoodSamplingList foodSampling={mockFoodSampling} />);
    
    // Check if text next to icon is rendered
    expect(screen.getByText('Kuantitas (gram)')).toBeInTheDocument();
    
    // check for the container that should include the icon
    const containerWithIcon = screen.getByText('Kuantitas (gram)').parentElement;
    expect(containerWithIcon).toHaveClass('flex');
    expect(containerWithIcon).toHaveClass('gap-1');
    expect(containerWithIcon).toHaveClass('items-center');
  });
});