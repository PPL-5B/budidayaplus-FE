import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import FoodSamplingForm from '../FoodSamplingForm';
import '@testing-library/jest-dom';
import React from 'react';

describe('FoodSamplingForm Component', () => {
  test('Komponen dapat dirender tanpa error', () => {
    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);
    expect(screen.getByLabelText(/Kuantitas Makanan/i)).toBeInTheDocument();
  });

  test("Menampilkan pop up jika kuantitas makanan lebih dari 1000", async () => {
    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);
  
    const input = screen.getByLabelText(/Kuantitas Makanan/i);
  
    await act(async () => {
      fireEvent.change(input, { target: { value: "1200" } });
    });
  
    const submitButton = screen.getByText(/Simpan/i);
  
    await act(async () => {
      fireEvent.click(submitButton);
    });
  
    expect(screen.getByText(/Indikator Tidak Sehat!/i)).toBeInTheDocument();
  });

  test("Menampilkan teks detail setelah tombol 'Lihat Detail' diklik", async () => {
    render(<FoodSamplingForm setIsModalOpen={() => {}} pondId="1" cycleId="1" />);
  
    const input = screen.getByLabelText("Kuantitas Makanan");
    fireEvent.change(input, { target: { value: "1001" } });
  
    const submitButton = screen.getByText("Simpan");
    fireEvent.click(submitButton);
  
    expect(screen.getByTestId("popup-warning")).toBeInTheDocument();
  
    const detailButton = screen.getByTestId("detail-button");
    fireEvent.click(detailButton);
  
    await waitFor(() => {
      expect(screen.getByText("Maksimal kuantitas makanan adalah 1000!")).toBeInTheDocument();
    });
  });
  
  test('Menutup pop up ketika tombol "Tutup" diklik', async () => {
    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);

    const input = screen.getByLabelText(/Kuantitas Makanan/i);
    fireEvent.change(input, { target: { value: '1200' } });

    const submitButton = screen.getByText(/Simpan/i);
    fireEvent.click(submitButton);

    const closeButton = screen.getByTestId("close-button");
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("popup-warning")).not.toBeInTheDocument();
    });
  });

  test('Popup tidak muncul saat kuantitas makanan kurang dari 1000', async () => {
    render(<FoodSamplingForm pondId="123" cycleId="456" setIsModalOpen={jest.fn()} />);
  
    const input = screen.getByLabelText('Kuantitas Makanan');
    fireEvent.change(input, { target: { value: '500' } });
  
    const submitButton = screen.getByText('Simpan');
    await act(async () => {
      fireEvent.click(submitButton);
    });
  
    expect(screen.queryByTestId('popup-warning')).not.toBeInTheDocument();
  });
});
