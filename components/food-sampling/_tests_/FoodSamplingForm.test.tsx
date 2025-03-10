import {fireEvent, render, screen, waitFor } from '@testing-library/react';
import FoodSamplingForm from '../FoodSamplingForm';
import '@testing-library/jest-dom';
import React from 'react';
import { addFoodSampling } from '@/lib/food-sampling';

jest.mock('@/lib/food-sampling', () => ({
  addFoodSampling: jest.fn(),
}));

describe('FoodSamplingForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Komponen dapat dirender tanpa error', () => {
    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);
    expect(screen.getByLabelText(/Kuantitas Makanan/i)).toBeInTheDocument();
  });

  test("Menampilkan pop up jika kuantitas makanan lebih dari 1000", async () => {
    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);

    const input = screen.getByLabelText(/Kuantitas Makanan/i);
    fireEvent.change(input, { target: { value: '1200' } });

    const submitButton = screen.getByText(/Simpan/i);
    fireEvent.click(submitButton);

    expect(screen.getByText(/Indikator Tidak Sehat!/i)).toBeInTheDocument();
  });

  test("Menampilkan teks detail setelah tombol 'Lihat Detail' diklik", async () => {
    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);

    const input = screen.getByLabelText(/Kuantitas Makanan/i);
    fireEvent.change(input, { target: { value: '1001' } });

    const submitButton = screen.getByText(/Simpan/i);
    fireEvent.click(submitButton);

    expect(screen.getByTestId('popup-warning')).toBeInTheDocument();

    const detailButton = screen.getByTestId('detail-button');
    fireEvent.click(detailButton);

    await waitFor(() => {
      expect(screen.getByText(/Maksimal kuantitas makanan adalah 1000!/i)).toBeInTheDocument();
    });
  });

  test('Menutup pop up ketika tombol "Tutup" diklik', async () => {
    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);

    const input = screen.getByLabelText(/Kuantitas Makanan/i);
    fireEvent.change(input, { target: { value: '1200' } });

    const submitButton = screen.getByText(/Simpan/i);
    fireEvent.click(submitButton);

    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('popup-warning')).not.toBeInTheDocument();
    });
  });

  test('Popup tidak muncul saat kuantitas makanan kurang dari 1000', async () => {
    render(<FoodSamplingForm pondId="123" cycleId="456" setIsModalOpen={jest.fn()} />);

    const input = screen.getByLabelText(/Kuantitas Makanan/i);
    fireEvent.change(input, { target: { value: '500' } });

    const submitButton = screen.getByText(/Simpan/i);
    fireEvent.click(submitButton);

    expect(screen.queryByTestId('popup-warning')).not.toBeInTheDocument();
  });

  test('Menampilkan error saat gagal menyimpan data', async () => {
    (addFoodSampling as jest.Mock).mockRejectedValueOnce(new Error('Gagal menyimpan'));

    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={jest.fn()} />);

    const input = screen.getByLabelText(/Kuantitas Makanan/i);
    fireEvent.change(input, { target: { value: '500' } });

    const submitButton = screen.getByText(/Simpan/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    });
  });

  test('Form di-reset setelah submit berhasil', async () => {
    (addFoodSampling as jest.Mock).mockResolvedValueOnce({ success: true });

    render(<FoodSamplingForm pondId="123" cycleId="456" setIsModalOpen={jest.fn()} />);

    const input = screen.getByLabelText(/Kuantitas Makanan/i);
    fireEvent.change(input, { target: { value: '500' } });

    fireEvent.click(screen.getByText(/Simpan/i));

    await waitFor(() => {
      expect(input).toHaveValue(0); 
    });
  });

  test('Form tidak dapat di-submit dengan kuantitas makanan yang tidak valid', async () => {
    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={jest.fn()} />);

    const input = screen.getByLabelText(/Kuantitas Makanan/i);
    fireEvent.change(input, { target: { value: '1200' } });

    const submitButton = screen.getByText(/Simpan/i);
    fireEvent.click(submitButton);

    expect(screen.getByText(/Indikator Tidak Sehat!/i)).toBeInTheDocument();
  });

  test('Menampilkan error jika API gagal', async () => {
    (addFoodSampling as jest.Mock).mockRejectedValueOnce(new Error('Gagal menyimpan sample makanan'));

    render(<FoodSamplingForm pondId="123" cycleId="456" setIsModalOpen={jest.fn()} />);

    const input = screen.getByLabelText(/Kuantitas Makanan/i);
    fireEvent.change(input, { target: { value: '500' } });

    fireEvent.click(screen.getByText(/Simpan/i));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    });
  });

  test('Memastikan error message muncul saat API gagal menyimpan data', async () => {
    (addFoodSampling as jest.Mock).mockResolvedValueOnce({ success: false });

    render(<FoodSamplingForm pondId="123" cycleId="456" setIsModalOpen={jest.fn()} />);

    const input = screen.getByLabelText(/Kuantitas Makanan/i);
    fireEvent.change(input, { target: { value: '500' } });

    fireEvent.click(screen.getByText(/Simpan/i));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Gagal menyimpan sample makanan');
    });
  });
});