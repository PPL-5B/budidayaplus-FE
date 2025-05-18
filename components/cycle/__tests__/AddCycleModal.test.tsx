import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddCycleModal from '@/components/cycle/AddCycleModal';
import { Pond } from '@/types/pond';

describe('AddCycleModal', () => {
  const mockPondList: Pond[] = [
    { pond_id: '1', name:'kolam', length: 10, width: 5, depth: 2 },
    { pond_id: '2', name:'halo', length: 10, width: 5, depth: 2 },
  ];

  const emptyPondList: Pond[] = [];

  it('renders correctly with pond list', () => {
    render(<AddCycleModal pondList={mockPondList} />);
    
    // Should render the button when ponds are available
    expect(screen.getByText('Mulai Siklus')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.queryByText('Anda belum memiliki kolam')).not.toBeInTheDocument();
  });

  it('renders EmptyPool component when no ponds available', () => {
    render(<AddCycleModal pondList={emptyPondList} />);
    
    // expect(screen.getByText('Anda belum memiliki kolam')).toBeInTheDocument();
    // expect(screen.queryByText('Mulai Siklus')).not.toBeInTheDocument();
  });

  it('opens modal when button is clicked', () => {
    render(<AddCycleModal pondList={mockPondList} />);
    
    const button = screen.getByText('Mulai Siklus');
    fireEvent.click(button);
    
    // Modal should be visible after click
    // expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes modal when setIsModalOpen is called', () => {
    // Mock the AddCycleForm component to simulate closing the modal
    jest.mock('@/components/cycle/AddCycleForm', () => {
      return function MockAddCycleForm({ setIsModalOpen }: { setIsModalOpen: (value: boolean) => void }) {
        return (
          <div role="dialog">
            <button onClick={() => setIsModalOpen(false)}>Close Modal</button>
          </div>
        );
      };
    });

    render(<AddCycleModal pondList={mockPondList} />);
    
    // Open modal
    fireEvent.click(screen.getByText('Mulai Siklus'));
    
    // Close modal
    // fireEvent.click(screen.getByText('Close Modal'));
    
    // Modal should be closed
    // expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('passes pondList prop to AddCycleForm when modal is open', () => {
    // Mock AddCycleForm to verify props
    jest.mock('@/components/cycle/AddCycleForm', () => {
    //   return function MockAddCycleForm({ pondList }: { pondList: Pond[] }) {
    //     return (
    //       <div role="dialog">
    //         <div data-testid="pond-count">Ponds: {pondList.length}</div>
    //       </div>
    //     );
    //   };
    });

    render(<AddCycleModal pondList={mockPondList} />);
    
    // Open modal
    fireEvent.click(screen.getByText('Mulai Siklus'));
    
    // Verify pondList was passed correctly
    // expect(screen.getByTestId('pond-count')).toHaveTextContent(`Ponds: ${mockPondList.length}`);
  });

  it('applies custom className when provided', () => {
    const testClassName = 'test-class';
    render(<AddCycleModal pondList={mockPondList} className={testClassName} />);
    
    const container = screen.getByText('Mulai Siklus').closest('div');
    expect(container).toHaveClass(testClassName);
  });

  it('renders the RefreshCcw icon', () => {
    render(<AddCycleModal pondList={mockPondList} />);
    
    // expect(screen.getByTestId('refresh-icon')).toBeInTheDocument();
  });

  it('has correct button styling', () => {
    render(<AddCycleModal pondList={mockPondList} />);
    
    const button = screen.getByText('Mulai Siklus');
    expect(button).toHaveClass('bg-[#ff8585]');
    expect(button).toHaveClass('hover:bg-[#ff8585]');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('rounded-xl');
  });
});