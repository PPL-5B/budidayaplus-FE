import React from 'react';
import { render, screen } from '@testing-library/react';
import PondList from '@/components/pond/PondList';
import { Pond } from '@/types/pond';
import '@testing-library/jest-dom';

// Mock PondCard
jest.mock('@/components/pond/PondCard', () => {
  const PondCardMock = ({ pond }: { pond: Pond }) => (
    <div data-testid="pond-card">
      <div>{pond.name}</div>
      <div>{pond.length}m × {pond.width}m × {pond.depth}m</div>
    </div>
  );
  return PondCardMock;
});

describe('PondList Component', () => {
  const mockPonds: Pond[] = [
    {
      pond_id: '1',
      name: 'Kolam Lele',
      length: 10,
      width: 5,
      depth: 2
    },
    {
      pond_id: '2',
      name: 'Kolam Nila',
      length: 15,
      width: 6,
      depth: 1.5
    }
  ];

  it('renders nothing when ponds array is empty', () => {
    const { container } = render(<PondList ponds={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders correct number of PondCards', () => {
    render(<PondList ponds={mockPonds} />);
    const cards = screen.getAllByTestId('pond-card');
    expect(cards).toHaveLength(mockPonds.length);
  });

  it('passes correct pond data to each PondCard', () => {
    render(<PondList ponds={mockPonds} />);
    
    mockPonds.forEach(pond => {
      expect(screen.getByText(pond.name)).toBeInTheDocument();
      expect(screen.getByText(
        `${pond.length}m × ${pond.width}m × ${pond.depth}m`
      )).toBeInTheDocument();
    });
  });

  it('has correct container styling', () => {
    const { container } = render(<PondList ponds={mockPonds} />);
    const listContainer = container.firstChild?.firstChild;
    expect(listContainer).toHaveClass('flex flex-col space-y-4');
  });
});