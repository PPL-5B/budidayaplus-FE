// __tests__/ViewPondQualityHistory.test.tsx
import { render, screen } from '@testing-library/react';
import ViewPondQualityHistory from '@/components/pond-quality/ViewPondQualityHistory';
import '@testing-library/jest-dom';

describe('ViewPondQualityHistory', () => {
  it('renders the link to pond quality history', () => {
    render(<ViewPondQualityHistory pondId="pond-1" />);
    const link = screen.getByRole('link', { name: /Lihat Riwayat/i });
    expect(link).toHaveAttribute('href', '/pond/pond-1/pond-quality');
  });
});
