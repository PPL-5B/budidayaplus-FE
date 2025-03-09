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
      expect(screen.getByTestId('add-fish-sampling-button')).toBeInTheDocument();
    });
  });

  it('does not render the Add Fish Sampling button if no cycle is available', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={""} />);
    await waitFor(() => {
      expect(screen.queryByTestId('add-fish-sampling-button')).not.toBeInTheDocument();
    });
  });

  it('opens confirmation modal when clicking Add Fish Sampling button if fishSampling exists', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} fishSampling={{} as any} />);
    
    act(() => {
      fireEvent.click(screen.getByTestId('add-fish-sampling-button'));
    });

    await waitFor(() => {
      expect(screen.getByText('Apakah anda yakin untuk menimpa data sampling ikan yang sebelumnya?')).toBeInTheDocument();
    });
  });

  it('opens sampling modal when clicking confirmation button', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} fishSampling={{} as any} />);

    act(() => {
      fireEvent.click(screen.getByTestId('add-fish-sampling-button'));
    });

    await waitFor(() => {
      expect(screen.getByText('Apakah anda yakin untuk menimpa data sampling ikan yang sebelumnya?')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByText('Konfirmasi'));
    });

    await waitFor(() => {
      expect(screen.getByText('Add Fish Sampling')).toBeInTheDocument();
    });
  });

  it('opens modal directly if there is no existing fish sampling', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} />);

    act(() => {
      fireEvent.click(screen.getByTestId('add-fish-sampling-button'));
    });

    await waitFor(() => {
      expect(screen.getByText('Add Fish Sampling')).toBeInTheDocument();
    });
  });

  it('closes modal when clicking close button', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} />);
    
    act(() => {
      fireEvent.click(screen.getByTestId('add-fish-sampling-button'));
    });

    await waitFor(() => {
      expect(screen.getByText('Add Fish Sampling')).toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByRole('button', { name: /close/i })); 
    });

    await waitFor(() => {
      expect(screen.queryByText('Add Fish Sampling')).not.toBeInTheDocument();
    });
  });
});
