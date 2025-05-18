import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddPond from '@/components/pond/AddPond';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('react-icons/io', () => ({
  IoIosAdd: () => <div data-testid="add-icon" />,
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div>
      {children}
      {open && <div data-testid="dialog-content">Dialog Content</div>}
    </div>
  ),
  DialogTrigger: ({ children }: any) => children,
}));

jest.mock('@/components/pond/PondForm', () => ({
  __esModule: true,
  default: ({ setIsModalOpen }: any) => (
    <button 
      onClick={() => setIsModalOpen(false)}
      data-testid="close-dialog"
    >
      Close Dialog
    </button>
  ),
}));

describe('AddPond Component', () => {
  it('renders correctly', () => {
    render(<AddPond />);
    
    // Verify button renders with correct text and icon
    const button = screen.getByRole('button', { name: /tambahkan kolam/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-[#2154C5]');
    expect(screen.getByTestId('add-icon')).toBeInTheDocument();
  });

  it('opens dialog when button is clicked', async () => {
    render(<AddPond />);
    
    // Dialog should not be visible initially
    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument();
    
    // Click the button
    fireEvent.click(screen.getByText(/tambahkan kolam/i));
    
    // Dialog should now be visible
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
  });

  it('closes dialog when PondForm triggers close', async () => {
    render(<AddPond />);
    
    // Open dialog
    fireEvent.click(screen.getByText(/tambahkan kolam/i));
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    
    // Close dialog via PondForm
    fireEvent.click(screen.getByTestId('close-dialog'));
    
    // Dialog should be closed
    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument();
  });

  it('has correct styling for the add icon', () => {
    render(<AddPond />);
    
    const iconContainer = screen.getByTestId('add-icon').parentElement;
    expect(iconContainer).toHaveClass('bg-white');
    expect(iconContainer).toHaveClass('rounded-full');
    expect(iconContainer).toHaveClass('-ml-1');
    expect(iconContainer).toHaveClass('mr-3');
  });
});