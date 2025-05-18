import { render, screen, waitFor } from '@testing-library/react';
import FishSamplingCard from '@/components/fish-sampling/FishSamplingCard';
import { fetchLatestFishSampling } from '@/lib/fish-sampling';
import { id } from 'date-fns/locale';
import { format } from 'date-fns';

jest.mock('@/lib/fish-sampling', () => ({
  fetchLatestFishSampling: jest.fn(),
}));

describe('FishSamplingCard', () => {
  const pondId = 'test-pond-id';
  const cycleId = 'test-cycle-id';
  const className = 'test-class';
  const props = { pondId, cycleId, className };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Add & Lihat Riwayat buttons when cycleId is provided', async () => {
    (fetchLatestFishSampling as jest.Mock).mockResolvedValue(undefined);

    const ui = await FishSamplingCard(props);
    render(ui);

    expect(await screen.findByTestId('add-fish-sampling-button')).toBeInTheDocument();
    expect(await screen.findByRole('link', { name: /lihat riwayat/i })).toBeInTheDocument();
  });

  it('renders AddFishSampling and FishSamplingList components', async () => {
    (fetchLatestFishSampling as jest.Mock).mockResolvedValue(undefined);
    const ui = await FishSamplingCard(props);
    render(ui);

    await waitFor(() => {
      expect(screen.getByTestId('add-fish-sampling-button')).toBeInTheDocument();
    });
  });

  it('displays fish sampling data correctly if available', async () => {
    const mockDate = new Date('2024-05-01T10:00:00Z');
    const mockData = {
      sampling_id: 'sample-1',
      pond_id: pondId,
      fish_weight: 2.3,
      fish_length: 45,
      reporter: { first_name: 'John', last_name: 'Doe' },
      recorded_at: mockDate,
    };

    (fetchLatestFishSampling as jest.Mock).mockResolvedValue(mockData);
    const ui = await FishSamplingCard(props);
    render(ui);

    await waitFor(() => {
      expect(screen.getByTestId('fish-weight')).toHaveTextContent('2.3');
      expect(screen.getByTestId('fish-length')).toHaveTextContent('45');
      expect(screen.getByTestId('fish-sample-date')).toHaveTextContent(
        format(mockDate, 'EEEE, dd MMMM yyyy', { locale: id })
      );
    });
  });

  it('does not fetch data if cycleId is undefined', async () => {
    const newProps = { pondId, cycleId: undefined, className };
    const ui = await FishSamplingCard(newProps);
    render(ui);

    expect(fetchLatestFishSampling).not.toHaveBeenCalled();
  });

  it('does not render buttons if cycleId is missing', async () => {
    const newProps = { pondId, cycleId: undefined, className };
    const ui = await FishSamplingCard(newProps);
    render(ui);

    expect(screen.queryByTestId('add-fish-sampling-button')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /lihat riwayat/i })).not.toBeInTheDocument();
  });

  it('handles undefined fishSampling gracefully', async () => {
    (fetchLatestFishSampling as jest.Mock).mockResolvedValue(undefined);
    const ui = await FishSamplingCard(props);
    render(ui);

    await waitFor(() => {
      expect(screen.getByTestId('add-fish-sampling-button')).toBeInTheDocument();
      expect(screen.queryByTestId('fish-weight')).not.toBeInTheDocument();
    });
  });

  it('renders safely with minimal props (edge case)', async () => {
    const ui = await FishSamplingCard({ pondId });
    render(ui);

    expect(screen.getByText(/ukuran ikan/i)).toBeInTheDocument();
  });

  it('handles malformed fishSampling data without crashing (corner case)', async () => {
    (fetchLatestFishSampling as jest.Mock).mockResolvedValue({
      sampling_id: null,
      pond_id: null,
      recorded_at: null,
    });
    const ui = await FishSamplingCard(props);
    render(ui);

    await waitFor(() => {
      expect(screen.queryByTestId('fish-weight')).not.toBeInTheDocument();
      expect(screen.queryByTestId('fish-length')).not.toBeInTheDocument();
    });
  });
});
