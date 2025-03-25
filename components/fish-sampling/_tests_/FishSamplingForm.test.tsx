import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FishSamplingForm from '../FishSamplingForm';
import '@testing-library/jest-dom';
import React from 'react';
import { addFishSampling } from '@/lib/fish-sampling';

jest.mock('@/lib/fish-sampling', () => ({
  addFishSampling: jest.fn(),
}));

describe('FishSamplingForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Komponen dapat dirender tanpa error', () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);
    expect(screen.getByLabelText(/Berat Ikan/i)).toBeInTheDocument();
  });

  test('Menampilkan pop-up jika berat atau panjang ikan ≤ 0', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Berat Ikan/i), { target: { value: '0' } });
    fireEvent.change(screen.getByLabelText(/Panjang Ikan/i), { target: { value: '-1' } });

    fireEvent.click(screen.getByText(/Simpan/i));

    expect(await screen.findByText((content) => content.includes("Berat dan panjang ikan harus lebih dari 0"))).toBeInTheDocument();
  });

  test('Menampilkan pop-up jika berat > 10 kg dan panjang > 100 cm', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Berat Ikan/i), { target: { value: '15' } });
    fireEvent.change(screen.getByLabelText(/Panjang Ikan/i), { target: { value: '120' } });

    fireEvent.click(screen.getByText(/Simpan/i));

    expect(await screen.findByText(/Berat dan panjang ikan terlalu besar/i)).toBeInTheDocument();
  });

  test('Menampilkan pop-up jika berat > 10 kg', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Berat Ikan/i), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText(/Panjang Ikan/i), { target: { value: '50' } });

    fireEvent.click(screen.getByText(/Simpan/i));

    expect(await screen.findByText(/Berat ikan lebih dari 10 kg/i)).toBeInTheDocument();
  });

  test('Menampilkan error jika API gagal menyimpan data', async () => {
    (addFishSampling as jest.Mock).mockRejectedValueOnce(new Error('Server rejected request'));

    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Berat Ikan/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Panjang Ikan/i), { target: { value: '50' } });

    fireEvent.click(screen.getByText(/Simpan/i));

    expect(await screen.findByText(/Server rejected request/i)).toBeInTheDocument();
  });

  test('Menutup pop-up ketika tombol "Tutup" diklik', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Berat Ikan/i), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText(/Panjang Ikan/i), { target: { value: '110' } });

    fireEvent.click(screen.getByText(/Simpan/i));

    fireEvent.click(screen.getByText(/Tutup/i));

    await waitFor(() => {
      expect(screen.queryByText(/Berat ikan lebih dari 10 kg/i)).not.toBeInTheDocument();
    });
  });

  test('Menampilkan warning modal jika data mendekati batas maksimal', async () => {
    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);
    
    fireEvent.change(screen.getByLabelText(/Berat Ikan/i), { target: { value: '9.5' } });
    fireEvent.change(screen.getByLabelText(/Panjang Ikan/i), { target: { value: '99' } });

    fireEvent.click(screen.getByText(/Simpan/i));

    expect(await screen.findByText(/Peringatan/i)).toBeInTheDocument();
  });

  test('Menampilkan error default jika API gagal tanpa pesan', async () => {
    (addFishSampling as jest.Mock).mockRejectedValueOnce(new Error());

    render(<FishSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);

    fireEvent.change(screen.getByLabelText(/Berat Ikan/i), { target: { value: '5' } });
    fireEvent.change(screen.getByLabelText(/Panjang Ikan/i), { target: { value: '50' } });

    fireEvent.click(screen.getByText(/Simpan/i));

    expect(await screen.findByText(/Gagal menyimpan sample ikan/i)).toBeInTheDocument();
  });
});
