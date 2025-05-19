import { render, screen, waitFor } from '@testing-library/react';
import FishDeathCard from '@/components/fish-death/FishDeathCard';
import { fetchLatestFishDeath } from '@/lib/fish-death';
import { id } from 'date-fns/locale';
import { format } from 'date-fns';

jest.mock('@/lib/fish-death', () => ({
  fetchLatestFishDeath: jest.fn(),
}));

describe('FishDeathCard', () => {
  const pondId = 'test-pond-id';
  const cycleId = 'test-cycle-id';
  const className = 'test-class';
  const props = { pondId, cycleId, className };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Add & Lihat Riwayat buttons when cycleId is provided', async () => {
    (fetchLatestFishDeath as jest.Mock).mockResolvedValue(undefined);

    const ui = await FishDeathCard(props);
    render(ui);

    expect(await screen.findByTestId('add-fish-death-button')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /lihat riwayat/i })).toBeInTheDocument();
  });

  it('renders AddFishDeath and FishDeathList components', async () => {
    (fetchLatestFishDeath as jest.Mock).mockResolvedValue(undefined);
    const ui = await FishDeathCard(props);
    render(ui);

    await waitFor(() => {
      expect(screen.getByTestId('add-fish-death-button')).toBeInTheDocument();
    });
  });

  it('displays fish death data correctly if available', async () => {
    const mockDate = new Date('2024-05-01T10:00:00Z');
    const mockData = {
      death_id: 'death-1',
      pond_id: pondId,
      death_count: 15,
      cause: 'Penyakit',
      reporter: { first_name: 'John', last_name: 'Doe' },
      recorded_at: mockDate,
    };

    (fetchLatestFishDeath as jest.Mock).mockResolvedValue(mockData);
    const ui = await FishDeathCard(props);
    render(ui);

    await waitFor(() => {
      expect(screen.getByTestId('death-count')).toHaveTextContent('15');
      expect(screen.getByTestId('death-cause')).toHaveTextContent('Penyakit');
      expect(screen.getByTestId('fish-death-date')).toHaveTextContent(
        format(mockDate, 'EEEE, dd MMMM yyyy', { locale: id })
      );
    });
  });

  it('does not fetch data if cycleId is undefined', async () => {
    const newProps = { pondId, cycleId: undefined, className };
    const ui = await FishDeathCard(newProps);
    render(ui);

    expect(fetchLatestFishDeath).not.toHaveBeenCalled();
  });

  it('does not render buttons if cycleId is missing', async () => {
    const newProps = { pondId, cycleId: undefined, className };
    const ui = await FishDeathCard(newProps);
    render(ui);

    expect(screen.queryByTestId('add-fish-death-button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /lihat riwayat/i })).not.toBeInTheDocument();
  });

  it('handles undefined fishDeath gracefully', async () => {
    (fetchLatestFishDeath as jest.Mock).mockResolvedValue(undefined);
    const ui = await FishDeathCard(props);
    render(ui);

    await waitFor(() => {
      expect(screen.getByTestId('add-fish-death-button')).toBeInTheDocument();
      expect(screen.queryByTestId('death-count')).not.toBeInTheDocument();
    });
  });

  it('renders safely with minimal props (edge case)', async () => {
    const ui = await FishDeathCard({ pondId });
    render(ui);

    expect(screen.getByText(/kematian ikan/i)).toBeInTheDocument();
  });

  it('handles malformed fishDeath data without crashing (corner case)', async () => {
    (fetchLatestFishDeath as jest.Mock).mockResolvedValue({
      death_id: null,
      pond_id: null,
      recorded_at: null,
    });
    const ui = await FishDeathCard(props);
    render(ui);

    await waitFor(() => {
      expect(screen.queryByTestId('death-count')).not.toBeInTheDocument();
      expect(screen.queryByTestId('death-cause')).not.toBeInTheDocument();
    });
  });
});