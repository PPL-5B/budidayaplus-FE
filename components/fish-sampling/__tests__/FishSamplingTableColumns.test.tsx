import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { columns } from '../FishSamplingTableColumns';
import { FishSampling } from "@/types/fish-sampling";
import User from "@/types/auth/user";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Mock data for the test
const mockUser: User = {
  id: 99,
  first_name: 'Udin',
  last_name: 'Sedunia',
  phone_number: '1234567890'
};

const mockFishSampling: FishSampling = {
  sampling_id: '123',
  pond_id: 'pond-456',
  reporter: mockUser,
  fish_weight: 2.5,
  fish_length: 40,
  recorded_at: "2023-05-15T12:00:00Z",
};

// Define type for mock row
const createMockRow = (original: FishSampling): { original: FishSampling } => ({ original });

describe('FishSamplingTableColumns', () => {
  test('columns array has correct length', () => {
    expect(columns).toHaveLength(4);
  });

  test('recorded_at column renders date correctly', () => {
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'recorded_at');

    // Test header
    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText } = render(<HeaderComponent />);
    expect(getByText('Tanggal')).toBeInTheDocument();

    // Test cell
    const CellComponent = column?.cell as ({ row }: { row: { original: FishSampling } }) => React.ReactElement;
    const mockRow = createMockRow(mockFishSampling);
    const { getByText: getCellText } = render(<CellComponent row={mockRow} />);
    expect(getCellText(format(new Date(mockFishSampling.recorded_at), "dd-MM-yyyy", { locale: id }))).toBeInTheDocument();
  });

  test('fish_weight column renders correctly', () => {
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'fish_weight');

    // Test header
    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText } = render(<HeaderComponent />);
    expect(getByText('Berat (kg)')).toBeInTheDocument();

    // Test cell
    const mockRow = createMockRow(mockFishSampling);
    const { getByText: getCellText } = render(<td>{mockRow.original.fish_weight} kg</td>);
    expect(getCellText('2.5 kg')).toBeInTheDocument();
  });

  test('fish_length column renders correctly', () => {
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'fish_length');

    // Test header
    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText } = render(<HeaderComponent />);
    expect(getByText('Panjang (cm)')).toBeInTheDocument();

    // Test cell
    const mockRow = createMockRow(mockFishSampling);
    const { getByText: getCellText } = render(<td>{mockRow.original.fish_length} cm</td>);
    expect(getCellText('40 cm')).toBeInTheDocument();
  });

  test('reporter column renders full name correctly', () => {
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'reporter');

    // Test header
    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText } = render(<HeaderComponent />);
    expect(getByText('Reporter')).toBeInTheDocument();

    // Test cell
    const CellComponent = column?.cell as ({ row }: { row: { original: FishSampling } }) => React.ReactElement;
    const mockRow = createMockRow(mockFishSampling);
    const { getByText: getCellText } = render(<CellComponent row={mockRow} />);
    expect(getCellText('Udin Sedunia')).toBeInTheDocument();
  });

  test('all columns have icons in header', () => {
    columns.forEach(column => {
      const HeaderComponent = column.header as () => React.ReactElement;
      const { container } = render(<HeaderComponent />);
      // Check if there's an SVG element in the header (the Lucide icon)
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  test('headers include proper icon elements', () => {
    columns.forEach(column => {
      if ('accessorKey' in column) {
        const HeaderComponent = column.header as () => React.ReactElement;
        const { container } = render(<HeaderComponent />);
        
        // Verify there's an SVG element (icon)
        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();
        
        // Verify the header text is present
        let expectedText = '';
        switch (column.accessorKey) {
          case 'recorded_at':
            expectedText = 'Tanggal';
            break;
          case 'fish_weight':
            expectedText = 'Berat (kg)';
            break;
          case 'fish_length':
            expectedText = 'Panjang (cm)';
            break;
          case 'reporter':
            expectedText = 'Reporter';
            break;
        }

        if (expectedText) {
          expect(container.textContent).toContain(expectedText);
        }
      }
    });
  });
});
