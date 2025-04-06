import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFishDeath from '@/components/fish-death/AddFishDeath';
import { getLatestFishDeath } from '@/lib/fish-death/addFishDeath';

jest.mock('@/lib/fish-death/addFishDeath', () => ({
  getLatestFishDeath: jest.fn(),
}));

const mockGetLatestFishDeath = getLatestFishDeath as jest.Mock;

describe('AddFishDeath (mirip AddFishSampling)', () => {
  const pondId = 'pond-001';
  const cycleId = 'cycle-001';

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock reload
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { reload: jest.fn() },
    });
  });

  it('renders trigger when cycle exists and fishDeathCount = 0', async () => {
    mockGetLatestFishDeath.mockResolvedValue({ fish_death_count: 0 });

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);

    const trigger = await screen.findByRole('button', { name: /Sample/i });
    expect(trigger).toBeInTheDocument();
  });

  it('opens form modal directly when fishDeathCount = 0', async () => {
    mockGetLatestFishDeath.mockResolvedValue({ fish_death_count: 0 });

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);

    const trigger = await screen.findByRole('button', { name: /Sample/i });
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText(/Input Kematian Ikan/i)).toBeInTheDocument();
    });
  });

  it('shows confirmation modal when fishDeathCount > 0', async () => {
    mockGetLatestFishDeath.mockResolvedValue({ fish_death_count: 10 });

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);

    const trigger = await screen.findByRole('button', { name: /Sample/i });
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText(/Timpa Data Kematian Ikan/i)).toBeInTheDocument();
    });
  });

  it('opens form modal after confirmation', async () => {
    mockGetLatestFishDeath.mockResolvedValue({ fish_death_count: 10 });

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);

    const trigger = await screen.findByRole('button', { name: /Sample/i });
    fireEvent.click(trigger);

    const confirmBtn = await screen.findByRole('button', { name: /Konfirmasi/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText(/Input Kematian Ikan/i)).toBeInTheDocument();
    });
  });

  it('fallbacks safely when getLatestFishDeath fails', async () => {
    mockGetLatestFishDeath.mockRejectedValue(new Error('Network Error'));

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);

    const trigger = await screen.findByRole('button', { name: /Sample/i });
    fireEvent.click(trigger);

    await waitFor(() => {
      expect(screen.getByText(/Input Kematian Ikan/i)).toBeInTheDocument();
    });
  });
});
