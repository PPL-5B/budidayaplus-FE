import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishDeathCard from '@/components/fish-death/FishDeathCard';

jest.mock('next/link', () => {
  return ({ children }: any) => <>{children}</>;
});

jest.mock('@/components/fish-death/AddFishDeath', () => () => (
  <div data-testid="mock-add-fish-death">AddFishDeathMock</div>
));

jest.mock('@/components/fish-death/FishDeathList', () => () => (
  <div data-testid="mock-fish-death-list">FishDeathListMock</div>
));

describe('FishDeathCard', () => {
  const pondId = 'pond-001';
  const cycleId = 'cycle-abc';

  test('renders title correctly', () => {
    render(<FishDeathCard pondId={pondId} />);
    expect(screen.getByText(/Kematian Ikan/i)).toBeInTheDocument();
  });

  test('does not render AddFishDeath or FishDeathList when cycleId is missing', () => {
    render(<FishDeathCard pondId={pondId} />);
    expect(screen.queryByTestId('mock-add-fish-death')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-fish-death-list')).not.toBeInTheDocument();
    expect(screen.queryByText(/Lihat Riwayat/i)).not.toBeInTheDocument();
  });

  test('renders AddFishDeath, Link and FishDeathList when cycleId is present', () => {
    render(<FishDeathCard pondId={pondId} cycleId={cycleId} />);

    expect(screen.getByTestId('mock-add-fish-death')).toBeInTheDocument();
    expect(screen.getByTestId('mock-fish-death-list')).toBeInTheDocument();

    const linkText = screen.getByText(/Lihat Riwayat/i);
    expect(linkText).toBeInTheDocument();
    expect(linkText.closest('a')).toHaveAttribute('href', `/pond/${pondId}/fish-death`);
  });

  test('accepts additional props and applies them', () => {
    render(<FishDeathCard pondId={pondId} cycleId={cycleId} data-testid="fish-death-card-root" />);
    expect(screen.getByTestId('fish-death-card-root')).toBeInTheDocument();
  });
});