import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFoodSampling from '../AddFoodSampling';
import { FoodSamplingForm } from '@/components/food-sampling';
import { FoodSampling } from '@/types/food-sampling';

// Mock the FoodSamplingForm component
jest.mock('@/components/food-sampling', () => ({
  FoodSamplingForm: jest.fn(() => <div data-testid="food-sampling-form">Mocked Form</div>)
}));

// Mock the dialog components
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }) => (
    <div data-testid="dialog" data-open={open} onClick={() => onOpenChange && onOpenChange(!open)}>
      {children}
    </div>
  ),
  DialogTrigger: ({ asChild, children }) => <div data-testid="dialog-trigger">{children}</div>,
  DialogClose: ({ asChild, children }) => <div data-testid="dialog-close" onClick={(e) => e.stopPropagation()}>{children}</div>,
  DialogFooter: ({ children }) => <div data-testid="dialog-footer">{children}</div>
}));

// Mock the modal component
jest.mock('@/components/ui/modal', () => ({
  Modal: ({ title, className, children }) => (
    <div data-testid="modal" className={className}>
      <h3>{title}</h3>
      {children}
    </div>
  )
}));

// Mock the button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, size, variant, ...rest }) => (
    <button
      onClick={onClick}
      className={className}
      data-size={size}
      data-variant={variant}
      {...rest}
    >
      {children}
    </button>
  )
}));

// Mock icons
jest.mock('react-icons/io', () => ({
  IoIosAdd: () => <div data-testid="add-icon" />
}));

jest.mock('lucide-react', () => ({
  X: () => <div data-testid="x-icon" />
}));

describe('AddFoodSampling Component', () => {
  const defaultProps = {
    pondId: 'pond-123',
    cycleId: 'cycle-456'
  };

  // Mock data with proper types
  const mockFoodSampling: FoodSampling = {
    sampling_id: 'fs-123',
    pond_id: 'pond-123',
    cycle_id: 'cycle-456',
    reporter: {
        id: 123,
        first_name: 'John',
        last_name: 'Doe',
        phone_number: '1234567890',
    },
    food_quantity: 10,
    recorded_at: new Date(),
    target_food_quantity: 12
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When foodSampling is not provided (new data mode)', () => {
    test('renders add button correctly', () => {
      render(<AddFoodSampling {...defaultProps} />);
      
      const addButton = screen.getByText('Tambahkan Data');
      expect(addButton).toBeInTheDocument();
      expect(screen.getByTestId('add-icon')).toBeInTheDocument();
    });

    test('opens the form modal when add button is clicked', async () => {
      render(<AddFoodSampling {...defaultProps} />);
      
      await act(async () => {
        fireEvent.click(screen.getByText('Tambahkan Data'));
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('food-sampling-form')).toBeInTheDocument();
      });
      
      expect(FoodSamplingForm).toHaveBeenCalledWith(
        expect.objectContaining({
          pondId: 'pond-123',
          cycleId: 'cycle-456',
          setIsModalOpen: expect.any(Function)
        }),
        expect.anything()
      );
    });

    test('closes the modal when setIsModalOpen is called with false', async () => {
      render(<AddFoodSampling {...defaultProps} />);
      
      await act(async () => {
        fireEvent.click(screen.getByText('Tambahkan Data'));
      });
      
      const { calls } = (FoodSamplingForm as jest.Mock).mock;
      const setIsModalOpenFn = calls[0][0].setIsModalOpen;
      
      await act(async () => {
        setIsModalOpenFn(false);
      });
      
      await waitFor(() => {
        const dialog = screen.getByTestId('dialog');
        expect(dialog).toHaveAttribute('data-open', 'false');
      });
    });
  });

  describe('When foodSampling is provided (overwrite mode)', () => {
    test('renders the overwrite button correctly', () => {
      render(<AddFoodSampling {...defaultProps} foodSampling={mockFoodSampling} />);
      
      const button = screen.getByTestId('add-fish-sampling-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Tambahkan Data');
    });

    test('shows confirmation dialog when overwrite button is clicked', async () => {
      render(<AddFoodSampling {...defaultProps} foodSampling={mockFoodSampling} />);
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('add-fish-sampling-button'));
      });
      
      expect(screen.getByText('Timpa Data Jumlah Makanan')).toBeInTheDocument();
      expect(screen.getByText('Apakah Anda yakin untuk menimpa data Jumlah Makanan sebelumnya?')).toBeInTheDocument();
      
      expect(screen.getByText('Tidak')).toBeInTheDocument();
      expect(screen.getByText('Iya')).toBeInTheDocument();
    });

    test('opens form dialog when "Iya" button is clicked', async () => {
      render(<AddFoodSampling {...defaultProps} foodSampling={mockFoodSampling} />);
      
      await act(async () => {
        fireEvent.click(screen.getByTestId('add-fish-sampling-button'));
      });
      
      await act(async () => {
        fireEvent.click(screen.getByText('Iya'));
      });
      
      await waitFor(() => {
        expect(screen.getByTestId('food-sampling-form')).toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    test('handles state changes correctly', async () => {
      const { rerender } = render(<AddFoodSampling {...defaultProps} />);
      
      await act(async () => {
        fireEvent.click(screen.getByText('Tambahkan Data'));
      });
      
      rerender(<AddFoodSampling pondId="new-pond" cycleId="new-cycle" />);
      
      expect(screen.getByTestId('food-sampling-form')).toBeInTheDocument();
      
      const { calls } = (FoodSamplingForm as jest.Mock).mock;
      const latestCall = calls[calls.length - 1];
      const setIsModalOpenFn = latestCall[0].setIsModalOpen;
      
      await act(async () => {
        setIsModalOpenFn(false);
      });
      
      await waitFor(() => {
        const dialog = screen.getByTestId('dialog');
        expect(dialog).toHaveAttribute('data-open', 'false');
      });
    });

    test('handles switching between add and overwrite mode', async () => {
      const { rerender } = render(<AddFoodSampling {...defaultProps} />);
      
      expect(screen.getByText('Tambahkan Data')).toBeInTheDocument();
      expect(screen.queryByText('Timpa Data Jumlah Makanan')).not.toBeInTheDocument();
      
      await act(async () => {
        rerender(<AddFoodSampling {...defaultProps} foodSampling={mockFoodSampling} />);
      });
      
      const overwriteButton = screen.getByTestId('add-fish-sampling-button');
      expect(overwriteButton).toBeInTheDocument();
      
      await act(async () => {
        fireEvent.click(overwriteButton);
      });
      
      expect(screen.getByText('Timpa Data Jumlah Makanan')).toBeInTheDocument();
      
      await act(async () => {
        rerender(<AddFoodSampling {...defaultProps} />);
      });
      
      expect(screen.getByText('Tambahkan Data')).toBeInTheDocument();
      expect(screen.queryByText('Timpa Data Jumlah Makanan')).not.toBeInTheDocument();
    });

    test('handles modal open state correctly with different props', async () => {
      const { rerender } = render(<AddFoodSampling {...defaultProps} />);
      
      await act(async () => {
        fireEvent.click(screen.getByText('Tambahkan Data'));
      });
      
      await act(async () => {
        rerender(<AddFoodSampling pondId="different-pond" cycleId="different-cycle" />);
      });
      
      expect(FoodSamplingForm).toHaveBeenCalledWith(
        expect.objectContaining({
          pondId: 'different-pond',
          cycleId: 'different-cycle',
          setIsModalOpen: expect.any(Function)
        }),
        expect.anything()
      );
    });
  });
});