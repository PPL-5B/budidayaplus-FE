import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { columns } from '@/components/fish-death'; 
import { FishDeath } from '@/types/fish-death';
import User from '@/types/auth/user';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';


const mockUser: User = {
  id: 99,
  first_name: 'Udin',
  last_name: 'Sedunia',
  phone_number: '1234567890',
};


const mockFishDeath: FishDeath = {
    id: '123',
    pond_id: 'pond-456',
    recorded_at: '2023-05-15T12:00:00Z',
    fish_death_count: 25,
    fish_alive_count: 75,
    reporter: mockUser,
    cycle_id: ''
};

const createMockRow = (original: FishDeath): { original: FishDeath } => ({ original });

describe('FishDeathTableColumns', () => {
  test('columns array has correct length', () => {
    expect(columns).toHaveLength(4);
  });

  test('recorded_at column renders header and cell correctly', () => {
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'recorded_at');

    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText: getHeaderText } = render(<HeaderComponent />);
    expect(getHeaderText('Tanggal')).toBeInTheDocument();

    const CellComponent = column?.cell as ({ row }: { row: { original: FishDeath } }) => React.ReactElement;
    const { getByText: getCellText } = render(<CellComponent row={createMockRow(mockFishDeath)} />);
    expect(getCellText(format(new Date(mockFishDeath.recorded_at), 'dd-MM-yyyy', { locale: id }))).toBeInTheDocument();
  });

  test('fish_death_count column renders correctly', () => {
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'fish_death_count');

    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText: getHeaderText } = render(<HeaderComponent />);
    expect(getHeaderText('Kematian (ekor)')).toBeInTheDocument();

    const CellComponent = column?.cell as ({ row }: { row: { original: FishDeath } }) => React.ReactElement;
    const { getByText: getCellText } = render(<CellComponent row={createMockRow(mockFishDeath)} />);
    expect(getCellText('25')).toBeInTheDocument();
  });

  test('fish_alive_count column renders correctly', () => {
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'fish_alive_count');

    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText: getHeaderText } = render(<HeaderComponent />);
    expect(getHeaderText('Masih Hidup (ekor)')).toBeInTheDocument();

    const CellComponent = column?.cell as ({ row }: { row: { original: FishDeath } }) => React.ReactElement;
    const { getByText: getCellText } = render(<CellComponent row={createMockRow(mockFishDeath)} />);
    expect(getCellText('75')).toBeInTheDocument();
  });

  test('reporter column renders full name correctly', () => {
    const column = columns.find(col => 'accessorKey' in col && col.accessorKey === 'reporter');

    const HeaderComponent = column?.header as () => React.ReactElement;
    const { getByText: getHeaderText } = render(<HeaderComponent />);
    expect(getHeaderText('Reporter')).toBeInTheDocument();

    const CellComponent = column?.cell as ({ row }: { row: { original: FishDeath } }) => React.ReactElement;
    const { getByText: getCellText } = render(<CellComponent row={createMockRow(mockFishDeath)} />);
    expect(getCellText('Udin Sedunia')).toBeInTheDocument();
  });

  test('all column headers include icons', () => {
    columns.forEach((col) => {
      const HeaderComponent = col.header as () => React.ReactElement;
      const { container } = render(<HeaderComponent />);
      expect(container.querySelector('svg')).toBeInTheDocument(); 
    });
  });
});