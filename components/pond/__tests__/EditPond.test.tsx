import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditPond from '@/components/pond/EditPond';
import { Pond } from '@/types/pond';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('lucide-react', () => ({
  Pencil: () => <div data-testid="pencil-icon" />
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => (
    <div>
      {children}
      {open && <div data-testid="dialog-content">Dialog Content</div>}
    </div>
  ),
  DialogTrigger: ({ children }: any) => children
}));

jest.mock('@/components/pond/PondForm', () => ({
  __esModule: true,
  default: ({ pond }: any) => (
    <div data-testid="pond-form">
      <div>Editing: {pond.name}</div>
      <div>Size: {pond.length}m × {pond.width}m</div>
      <div>Depth: {pond.depth}m</div>
    </div>
  )
}));

describe('EditPond Component', () => {
  const mockPond: Pond = {
    pond_id: '1',
    name: 'Kolam Lele',
    length: 10,
    width: 5,
    depth: 2
  };

  it('renders edit button with pencil icon', () => {
    render(<EditPond pond={mockPond} />);
    
    const button = screen.getByRole('button', { name: /edit/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
    expect(screen.getByTestId('pencil-icon')).toBeInTheDocument();
  });

  it('opens dialog when button is clicked', () => {
    render(<EditPond pond={mockPond} />);
    
    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText(/edit/i));
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('passes correct pond data to PondForm', () => {
    render(<EditPond pond={mockPond} />);
    fireEvent.click(screen.getByText(/edit/i));
    
    expect(screen.getByTestId('pond-form')).toHaveTextContent(
      `Editing: ${mockPond.name}`
    );
    expect(screen.getByTestId('pond-form')).toHaveTextContent(
      `Size: ${mockPond.length}m × ${mockPond.width}m`
    );
    expect(screen.getByTestId('pond-form')).toHaveTextContent(
      `Depth: ${mockPond.depth}m`
    );
  });

  it('forwards additional props to container div', () => {
    const testProps = {
      className: 'custom-class',
      'data-testid': 'edit-pond-container'
    };
    
    const { getByTestId } = render(
      <EditPond pond={mockPond} {...testProps} />
    );
    
    const container = getByTestId('edit-pond-container');
    expect(container).toHaveClass('custom-class');
  });
});