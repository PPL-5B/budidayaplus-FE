import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFishDeath from '@/components/fish-death/AddFishDeath';

describe('AddFishDeath Component', () => {
  const pondId = 'pond-123';
  const cycleId = 'cycle-456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "Tambahkan Data" button when cycleId is provided and no fishDeath', async () => {
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    expect(await screen.findByTestId('add-fish-death-button')).toBeInTheDocument();
  });

  it('does not render button when cycleId is empty', async () => {
    render(<AddFishDeath pondId={pondId} cycleId="" />);
    await waitFor(() => {
      expect(screen.queryByTestId('add-fish-death-button')).not.toBeInTheDocument();
    });
  });

  it('shows confirmation modal when fishDeath exists and button clicked', async () => {
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} fishDeath={{} as any} />);
    fireEvent.click(screen.getByTestId('add-fish-death-button'));

    await waitFor(() => {
      expect(screen.getByText(/timpa data kematian ikan/i)).toBeInTheDocument();
    });
  });

  it('opens form modal after confirming in confirmation modal', async () => {
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} fishDeath={{} as any} />);

    fireEvent.click(screen.getByTestId('add-fish-death-button'));
    await waitFor(() => {
      expect(screen.getByText(/timpa data kematian ikan/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/iya/i)); // tombol konfirmasi
    await waitFor(() => {
      // Asumsi bahwa FishDeathForm memiliki judul atau teks yang serupa
      expect(screen.getByTestId('fish-death-form')).toBeInTheDocument();
    });
  });

  it('directly opens form modal when fishDeath does not exist', async () => {
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    fireEvent.click(screen.getByTestId('add-fish-death-button'));

    await waitFor(() => {
      // Asumsi bahwa FishDeathForm memiliki judul atau teks yang serupa
      expect(screen.getByTestId('fish-death-form')).toBeInTheDocument();
    });
  });

  it('closes form modal when close button clicked', async () => {
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    fireEvent.click(screen.getByTestId('add-fish-death-button'));

    await waitFor(() => {
      expect(screen.getByTestId('fish-death-form')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /tutup/i });
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('fish-death-form')).not.toBeInTheDocument();
    });
  });

  it('handles multiple open and close interactions without crashing', async () => {
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    const button = screen.getByTestId('add-fish-death-button');

    for (let i = 0; i < 3; i++) {
      fireEvent.click(button);
      await waitFor(() => {
        expect(screen.getByTestId('fish-death-form')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /tutup/i });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('fish-death-form')).not.toBeInTheDocument();
      });
    }
  });

  it('does not crash when pondId or cycleId are undefined (edge case)', async () => {
    // @ts-expect-error intentional missing props to simulate misuse
    render(<AddFishDeath />);
    // Should render nothing and not throw
    expect(screen.queryByTestId('add-fish-death-button')).not.toBeInTheDocument();
  });
});