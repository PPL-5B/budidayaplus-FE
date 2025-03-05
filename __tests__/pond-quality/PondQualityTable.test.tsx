import { render, screen } from '@testing-library/react';
import PondQualityTable from '@/components/pond-quality/PondQualityTable';

test('menampilkan tabel kualitas air dengan kolom yang sesuai', () => {
  render(<PondQualityTable data={[
    { parameter: 'pH', value: 6.5, standard: '7' },
    { parameter: 'Suhu', value: 27.5, standard: '27.0' },
    { parameter: 'Salinitas', value: 30, standard: '28' },

  ]} />);

  expect(screen.getByText('pH')).toBeInTheDocument();
  expect(screen.getByText('Suhu')).toBeInTheDocument();
  expect(screen.getByText('Salinitas')).toBeInTheDocument();
});
