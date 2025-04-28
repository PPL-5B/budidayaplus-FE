import { fetchFishDeathHistory, fetchLatestFishDeath } from './index';
import { cookies } from 'next/headers';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

global.fetch = jest.fn();

describe('Fish Death API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchLatestFishDeath returns data when fetch is successful', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: 'mocked-token' }),
    });

    const mockData = { id: '123', amount: 5 };
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchLatestFishDeath('pond1', 'cycle1');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/fish-death/pond1/cycle1/latest/'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mocked-token',
        }),
      })
    );
    expect(result).toEqual(mockData);
  });

  it('fetchLatestFishDeath returns undefined when response is not ok', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: 'token' }),
    });

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Some error' }),
    });

    const result = await fetchLatestFishDeath('pondX', 'cycleY');
    expect(result).toBeUndefined();
  });

  it('fetchLatestFishDeath returns undefined on fetch failure', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: 'token' }),
    });

    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await fetchLatestFishDeath('pondErr', 'cycleErr');
    expect(result).toBeUndefined();
  });

  it('fetchFishDeathHistory returns data when fetch is successful', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: 'token' }),
    });

    const mockResponse = {
      fish_deaths: [{ date: '2024-01-01', amount: 10 }],
      cycle_id: 'cycleA',
    };

    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await fetchFishDeathHistory('pond99');
    expect(result).toEqual(mockResponse);
  });

  it('fetchFishDeathHistory returns fallback on failed fetch', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: 'token' }),
    });

    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const result = await fetchFishDeathHistory('pond42');
    expect(result).toEqual({ fish_deaths: [], cycle_id: '' });
  });

  it('fetchFishDeathHistory returns fallback when response.ok is false', async () => {
    (cookies as jest.Mock).mockReturnValue({
      get: () => ({ value: 'token' }),
    });

    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    const result = await fetchFishDeathHistory('pondFail');
    expect(result).toEqual({ fish_deaths: [], cycle_id: '' });
  });
});
