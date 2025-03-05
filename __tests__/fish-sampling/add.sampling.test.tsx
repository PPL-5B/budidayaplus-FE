import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFishSampling from '@/components/fish-sampling/AddFishSampling';

jest.mock('@/lib/cycle');

describe('AddFishSampling', () => {
  const pondId = 'test-pond-id';
  const cycleId = 'test-cycle-id';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Add Fish Sampling button if cycle is available', async () => {

    render(<AddFishSampling pondId={pondId} cycleId={cycleId} />);

    await waitFor(() => {
      expect(screen.getByText('Sample')).toBeInTheDocument();
    });
  });

  it('does not render the Add Fish Sampling button if no cycle is available', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={""} />);

    await waitFor(() => {
      expect(screen.queryByText('Sample')).not.toBeInTheDocument();
    });
  });

  it('opens modal with FishSamplingForm when Add Fish Sampling button is clicked', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} />);

    await waitFor(() => {
      const addButton = screen.getByTestId('add-fish-sampling-button');
      expect(addButton).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-fish-sampling-button'));
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('closes modal when setIsModalOpen is false', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} />);

    await waitFor(() => {
      const addButton = screen.getByText('Sample');
      expect(addButton).toBeInTheDocument();
    });

    // Open modal
    act(() => {
      fireEvent.click(screen.getByText('Sample'));
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Simulate modal close
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /close/i })); // Assuming there's a close button
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
