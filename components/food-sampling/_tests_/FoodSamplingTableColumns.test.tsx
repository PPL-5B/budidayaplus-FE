import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { columns } from '../FoodSamplingTableColumns';
import { FoodSampling } from "@/types/food-sampling";
import User from "@/types/auth/user";

// Define a Row type that matches the structure expected by the cell render functions
interface Row {
  original: FoodSampling;
}

const mockUser: User = {
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

// Mock row object as expected by the cell render functions
const createMockRow = (original: FoodSampling): Row => ({
  original
});

describe('FoodSamplingTableColumns', () => {
  test('columns array has correct length', () => {
    expect(columns).toHaveLength(3);
  });

  test('recorded_at column renders date correctly', () => {
    // Find column by checking if the accessorKey property equals 'recorded_at'
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'recorded_at');
    
    // Test header
    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText } = render(<HeaderComponent />);
    expect(getByText('Tanggal')).toBeInTheDocument();

    // Test cell
    const CellComponent = column?.cell as ({ row }: { row: Row }) => React.ReactElement;
    const mockRow = createMockRow(mockFoodSampling);
    const { getByText: getCellText } = render(<CellComponent row={mockRow} />);
    expect(getCellText('15-05-2023')).toBeInTheDocument();
  });

  test('food_quantity column renders correctly', () => {
    // Find column by checking if the accessorKey property equals 'food_quantity'
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'food_quantity');
    
    // Test header
    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText } = render(<HeaderComponent />);
    expect(getByText('Kuantitas Makanan (gram)')).toBeInTheDocument();

    // Test cell
    const CellComponent = column?.cell as ({ row }: { row: Row }) => React.ReactElement;
    const mockRow = createMockRow(mockFoodSampling);
    const { getByText: getCellText } = render(<CellComponent row={mockRow} />);
    expect(getCellText('500 gram')).toBeInTheDocument();
  });

  test('reporter column renders full name correctly', () => {
    // Find column by checking if the accessorKey property equals 'reporter'
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'reporter');
    
    // Test header
    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText } = render(<HeaderComponent />);
    expect(getByText('Reporter')).toBeInTheDocument();

    // Test cell
    const CellComponent = column?.cell as ({ row }: { row: Row }) => React.ReactElement;
    const mockRow = createMockRow(mockFoodSampling);
    const { getByText: getCellText } = render(<CellComponent row={mockRow} />);
    expect(getCellText('udin sedunia')).toBeInTheDocument();
  });

  test('all columns have icons in header', () => {
    columns.forEach(column => {
      const HeaderComponent = column.header as () => React.ReactElement;
      const { container } = render(<HeaderComponent />);
      // Check if there's an SVG element in the header (the Lucide icon)
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
  
  // Icon test
  test('headers include proper icon elements', () => {
    // verifies that SVG icons exist in the headers without relying on data-testid
    columns.forEach(column => {
      if ('accessorKey' in column) {
        const HeaderComponent = column.header as () => React.ReactElement;
        const { container } = render(<HeaderComponent />);
        
        // Verify there's an SVG element (icon)
        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
        
        // verify the header text is present
        let expectedText = '';
        switch (column.accessorKey) {
          case 'recorded_at':
            expectedText = 'Tanggal';
            break;
          case 'food_quantity':
            expectedText = 'Kuantitas Makanan (gram)';
            break;
          case 'reporter':
            expectedText = 'Reporter';
            break;
          case 'target_food_quantity':
            expectedText = 'Target Kuantitas Makanan (gram)';
            break;
        }
        
        if (expectedText) {
          expect(container.textContent).toContain(expectedText);
        }
      }
    });
  });
});