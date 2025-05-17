// __tests__/AddPondQuality.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import AddPondQuality from '@/components/pond-quality/AddPondQuality';
import '@testing-library/jest-dom';

describe('AddPondQuality', () => {
  it('renders Tambahkan Data button', () => {
    render(<AddPondQuality pondId="pond-1" cycleId="cycle-1" />);
    expect(screen.getByText(/Tambahkan Data/i)).toBeInTheDocument();
  });

  it('shows confirmation dialog and handles "Iya" click', () => {
    const dummyPondQuality = {
      water_temperature: 25,
      ph_level: 7,
    } as any;

    render(<AddPondQuality pondId="pond-1" cycleId="cycle-1" pondQuality={dummyPondQuality} />);
    fireEvent.click(screen.getByText(/Tambahkan Data/i));
    expect(screen.getByText(/Timpa Data Jumlah Makanan/i)).toBeInTheDocument();

    const iyaButton = screen.getByText(/Iya/i);
    fireEvent.click(iyaButton); // ini yang men-trigger setIsModalOpen(true)
  });
});
