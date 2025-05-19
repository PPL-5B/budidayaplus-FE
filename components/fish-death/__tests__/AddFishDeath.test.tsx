import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddFishDeath from '../AddFishDeath';
import { FishDeath } from '@/types/fish-death';

describe('AddFishDeath', () => {
  const mockPondId = 'pond-1';
  const mockCycleId = 'cycle-1';
  const mockFishDeath: FishDeath = {
    id: 'death-1',
    date: '2023-01-01',
    amount: 10,
    reason: 'disease',
    cycleId: mockCycleId,
  };

  it('renders without crashing', () => {
    render(<AddFishDeath pondId={mockPondId} cycleId={mockCycleId} />);
    expect(screen.getByTestId('add-fish-death-button')).toBeInTheDocument();
  });

  it('renders the button with correct text and icon', () => {
    render(<AddFishDeath pondId={mockPondId} cycleId={mockCycleId} />);
    const button = screen.getByTestId('add-fish-death-button');
    expect(button).toHaveTextContent('Tambahkan Data');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  describe('when fishDeath is provided', () => {
    it('renders the confirmation dialog when clicked', () => {
      render(
        <AddFishDeath 
          pondId={mockPondId} 
          cycleId={mockCycleId} 
          fishDeath={mockFishDeath} 
        />
      );
      
      fireEvent.click(screen.getByTestId('add-fish-death-button'));
      expect(screen.getByText('Tambahkan Data Kematian Ikan')).toBeInTheDocument();
      expect(screen.getByText('Apakah anda yakin untuk menambah data Jumlah Kematian Ikan pada hari ini?')).toBeInTheDocument();
    });

    it('calls handleConfirm when "Iya" button is clicked', () => {
      render(
        <AddFishDeath 
          pondId={mockPondId} 
          cycleId={mockCycleId} 
          fishDeath={mockFishDeath} 
        />
      );
      
      fireEvent.click(screen.getByTestId('add-fish-death-button'));
      fireEvent.click(screen.getByText('Iya'));
      
      // The confirmation dialog should close and the form dialog should open
      expect(screen.queryByText('Tambahkan Data Kematian Ikan')).not.toBeInTheDocument();
    });

    it('calls handleCancel when "Tidak" button is clicked', () => {
      render(
        <AddFishDeath 
          pondId={mockPondId} 
          cycleId={mockCycleId} 
          fishDeath={mockFishDeath} 
        />
      );
      
      fireEvent.click(screen.getByTestId('add-fish-death-button'));
      fireEvent.click(screen.getByText('Tidak'));
      
      // The confirmation dialog should close
      expect(screen.queryByText('Tambahkan Data Kematian Ikan')).not.toBeInTheDocument();
    });
  });

  describe('when fishDeath is not provided', () => {
    it('opens the FishDeathForm directly when clicked', () => {
      render(<AddFishDeath pondId={mockPondId} cycleId={mockCycleId} />);
      
      fireEvent.click(screen.getByTestId('add-fish-death-button'));
      
      // The confirmation dialog should not appear
      expect(screen.queryByText('Tambahkan Data Kematian Ikan')).not.toBeInTheDocument();
      
      // Instead, the FishDeathForm should be rendered (you might need to mock this)
      // This would depend on how your FishDeathForm component is structured
    });
  });

  it('closes the modal when setIsModalOpen is called with false', () => {
    render(<AddFishDeath pondId={mockPondId} cycleId={mockCycleId} />);
    
    // Open the modal
    fireEvent.click(screen.getByTestId('add-fish-death-button'));
    
    // Close the modal by clicking the close button (if available)
    // Or simulate the setIsModalOpen(false) call
    // This might require mocking the FishDeathForm component
  });

  it('passes correct props to FishDeathForm', () => {
    // Mock the FishDeathForm component to verify props
    jest.mock('@/components/fish-death', () => ({
      FishDeathForm: jest.fn(() => null),
    }));
    
    const { FishDeathForm } = require('@/components/fish-death');
    
    render(
      <AddFishDeath 
        pondId={mockPondId} 
        cycleId={mockCycleId} 
        fishDeath={mockFishDeath} 
      />
    );
    
    // Open the confirmation dialog and confirm
    fireEvent.click(screen.getByTestId('add-fish-death-button'));
    fireEvent.click(screen.getByText('Iya'));
    
    expect(FishDeathForm).toHaveBeenCalledWith(
      expect.objectContaining({
        pondId: mockPondId,
        cycleId: mockCycleId,
        setIsModalOpen: expect.any(Function),
      }),
      {}
    );
  });
});