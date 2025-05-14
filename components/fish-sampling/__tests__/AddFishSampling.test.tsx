import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFishSampling from '@/components/fish-sampling/AddFishSampling';

describe('AddFishSampling Component', () => {
  const pondId = 'pond-123';
  const cycleId = 'cycle-456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Tambahkan Data" button when cycleId is provided and no fishSampling', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} />);
    expect(await screen.findByTestId('add-fish-sampling-button')).toBeInTheDocument();
  });

  it('does not render button when cycleId is empty', async () => {
    render(<AddFishSampling pondId={pondId} cycleId="" />);
    await waitFor(() => {
      expect(screen.queryByTestId('add-fish-sampling-button')).not.toBeInTheDocument();
    });
  });

  it('shows confirmation modal when fishSampling exists and button clicked', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} fishSampling={{} as any} />);
    fireEvent.click(screen.getByTestId('add-fish-sampling-button'));

    await waitFor(() => {
      expect(screen.getByText(/timpa data ukuran ikan/i)).toBeInTheDocument();
    });
  });

  it('opens form modal after confirming in confirmation modal', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} fishSampling={{} as any} />);

    fireEvent.click(screen.getByTestId('add-fish-sampling-button'));
    await waitFor(() => {
      expect(screen.getByText(/timpa data ukuran ikan/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/iya/i)); // tombol konfirmasi
    await waitFor(() => {
      expect(screen.getByText(/tambah ukuran ikan/i)).toBeInTheDocument();
    });
  });

  it('directly opens form modal when fishSampling does not exist', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} />);
    fireEvent.click(screen.getByTestId('add-fish-sampling-button'));

    await waitFor(() => {
      expect(screen.getByText(/tambah ukuran ikan/i)).toBeInTheDocument();
    });
  });

  it('closes form modal when close button clicked', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} />);
    fireEvent.click(screen.getByTestId('add-fish-sampling-button'));

    await waitFor(() => {
      expect(screen.getByText(/tambah ukuran ikan/i)).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /tutup/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText(/tambah ukuran ikan/i)).not.toBeInTheDocument();
    });
  });

  it('handles multiple open and close interactions without crashing', async () => {
    render(<AddFishSampling pondId={pondId} cycleId={cycleId} />);
    const button = screen.getByTestId('add-fish-sampling-button');

    for (let i = 0; i < 3; i++) {
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByText(/tambah ukuran ikan/i)).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /tutup/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText(/tambah ukuran ikan/i)).not.toBeInTheDocument();
      });
    }
  });

  it('does not crash when pondId or cycleId are undefined (edge case)', async () => {
    // @ts-expect-error intentional missing props to simulate misuse
    render(<AddFishSampling />);
    // Should render nothing and not throw
    expect(screen.queryByTestId('add-fish-sampling-button')).not.toBeInTheDocument();
  });
});
