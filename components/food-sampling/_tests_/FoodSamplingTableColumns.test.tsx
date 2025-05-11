import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { columns } from '../FoodSamplingTableColumns';
import { FoodSampling } from "@/types/food-sampling";
import User from "@/types/auth/user";

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

const createMockRow = (original: FoodSampling): Row => ({
  original
});

describe('FoodSamplingTableColumns', () => {
  test('columns array has correct length', () => {
    expect(columns).toHaveLength(3);
  });

  test('recorded_at column renders date correctly', () => {
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'recorded_at');
    
    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText } = render(<HeaderComponent />);
    expect(getByText('Tanggal')).toBeInTheDocument();

    const CellComponent = column?.cell as ({ row }: { row: Row }) => React.ReactElement;
    const mockRow = createMockRow(mockFoodSampling);
    const { getByText: getCellText } = render(<CellComponent row={mockRow} />);
    expect(getCellText('15-05-2023')).toBeInTheDocument();
  });

  test('food_quantity column renders correctly', () => {
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'food_quantity');
    
    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText } = render(<HeaderComponent />);
    expect(getByText('Kuantitas Makanan (gram)')).toBeInTheDocument();

    const CellComponent = column?.cell as ({ row }: { row: Row }) => React.ReactElement;
    const mockRow = createMockRow(mockFoodSampling);
    const { getByText: getCellText } = render(<CellComponent row={mockRow} />);
    expect(getCellText('500 gram')).toBeInTheDocument();
  });

  test('reporter column renders full name correctly', () => {
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'reporter');
    
    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText } = render(<HeaderComponent />);
    expect(getByText('Reporter')).toBeInTheDocument();

    const CellComponent = column?.cell as ({ row }: { row: Row }) => React.ReactElement;
    const mockRow = createMockRow(mockFoodSampling);
    const { getByText: getCellText } = render(<CellComponent row={mockRow} />);
    expect(getCellText('udin sedunia')).toBeInTheDocument();
  });

  test('all columns have icons in header', () => {
    columns.forEach(column => {
      const HeaderComponent = column.header as () => React.ReactElement;
      const { container } = render(<HeaderComponent />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });
  
  test('headers include proper icon elements', () => {
    columns.forEach(column => {
      if ('accessorKey' in column) {
        const HeaderComponent = column.header as () => React.ReactElement;
        const { container } = render(<HeaderComponent />);
        
        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
        
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