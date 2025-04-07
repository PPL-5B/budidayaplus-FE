import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddFishDeath from '@/components/fish-death/AddFishDeath';
import { getLatestFishDeath } from '@/lib/fish-death/addFishDeath';

jest.mock('@/lib/fish-death/addFishDeath', () => ({
  getLatestFishDeath: jest.fn(),
}));

jest.mock('@/components/fish-death/FishDeathForm', () => () => (
  <div data-testid="form-kematian">Form Kematian Ikan</div>
));

describe('AddFishDeath', () => {
  const pondId = 'pond-001';
  const cycleId = 'cycle-001';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('selalu menampilkan tombol Sample', async () => {
    (getLatestFishDeath as jest.Mock).mockResolvedValue(null);

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    expect(await screen.findByText('Sample')).toBeInTheDocument();
  });

  it('membuka dialog konfirmasi jika data sebelumnya ada', async () => {
    (getLatestFishDeath as jest.Mock).mockResolvedValue({ fish_death_count: 5 });

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    const sampleBtn = await screen.findByText('Sample');
    fireEvent.click(sampleBtn);

    expect(await screen.findByText(/Timpa Data Kematian Ikan/i)).toBeInTheDocument();
  });

  it('langsung membuka form jika belum ada data sebelumnya', async () => {
    (getLatestFishDeath as jest.Mock).mockResolvedValue({ fish_death_count: 0 });

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    const sampleBtn = await screen.findByText('Sample');
    fireEvent.click(sampleBtn);

    expect(await screen.findByTestId('form-kematian')).toBeInTheDocument();
  });

  it('fallback ke 0 jika getLatestFishDeath gagal', async () => {
    (getLatestFishDeath as jest.Mock).mockRejectedValue(new Error('Network error'));
  
    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    const sampleBtn = await screen.findByText('Sample');
    fireEvent.click(sampleBtn);
  
    expect(await screen.findByTestId('form-kematian')).toBeInTheDocument();
  });
  

  it('membuka form setelah klik konfirmasi', async () => {
    (getLatestFishDeath as jest.Mock).mockResolvedValue({ fish_death_count: 10 });

    render(<AddFishDeath pondId={pondId} cycleId={cycleId} />);
    const sampleBtn = await screen.findByText('Sample');
    fireEvent.click(sampleBtn);

    const konfirmasiBtn = await screen.findByText('Konfirmasi');
    fireEvent.click(konfirmasiBtn);

    await waitFor(() => {
      expect(screen.getByTestId('form-kematian')).toBeInTheDocument();
    });
  });
});
