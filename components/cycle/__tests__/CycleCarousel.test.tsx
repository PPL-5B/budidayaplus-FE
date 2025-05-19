import React from 'react';
import { render, screen } from '@testing-library/react';
import { CycleList } from '@/types/cycle';
import CycleCarousel from '../CycleCarousel';

const mockCycle = (id: string): any => ({
  id,
  name: `Cycle ${id}`,
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 86400000).toISOString(),
  supervisor: `user-${id}`,
  pond_fish_amount: 100,
});

const mockCycleList: CycleList = {
  active: [mockCycle('Aktif')],
  past: [mockCycle('Lalu')],
  stopped: [mockCycle('Dihentikan')],
  future: [mockCycle('Mendatang')],
};

describe('CycleCarousel', () => {
  it('should render active cycle cards first', () => {
    render(<CycleCarousel cycleList={mockCycleList} />);

    const allLabels = screen.getAllByText(/Siklus/);
    expect(allLabels[0]).toHaveTextContent('Siklus Aktif');
  });

  it('should render all cycle types', () => {
    render(<CycleCarousel cycleList={mockCycleList} />);

    expect(screen.getByText('Siklus Aktif')).toBeInTheDocument();
    expect(screen.getByText('Siklus Lalu')).toBeInTheDocument();
    expect(screen.getByText('Siklus Dihentikan')).toBeInTheDocument();
    expect(screen.getByText('Siklus Mendatang')).toBeInTheDocument();
  });

  it('should apply correct styles to active cycle cards', () => {
    render(<CycleCarousel cycleList={mockCycleList} />);
    const activeCard = screen.getByText('Siklus Aktif');
    expect(activeCard.closest('div')).toHaveClass('text-primary-300');
  });
});
