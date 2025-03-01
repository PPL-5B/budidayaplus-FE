import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import FoodSamplingForm from '../FoodSamplingForm';
import '@testing-library/jest-dom';
import React from 'react';

describe('FoodSamplingForm Component', () => {
  test('Komponen dapat dirender tanpa error', () => {
    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);
    expect(screen.getByLabelText(/Kuantitas Makanan/i)).toBeInTheDocument();
  });

  test('Menampilkan pop up jika kuantitas makanan lebih dari 1000', () => {
    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);

    const input = screen.getByLabelText(/Kuantitas Makanan/i);
    fireEvent.change(input, { target: { value: '1200' } });

    const submitButton = screen.getByText(/Simpan/i);
    fireEvent.click(submitButton);

    expect(screen.getByText(/Indikator Tidak Sehat!/i)).toBeInTheDocument();
  });

  test("Menampilkan teks detail setelah tombol 'Lihat Detail' diklik", async () => {
    render(<FoodSamplingForm setIsModalOpen={() => {}} pondId="1" cycleId="1" />);
  
    const input = screen.getByLabelText("Kuantitas Makanan");
    fireEvent.change(input, { target: { value: "1001" } });
  
    const submitButton = screen.getByText("Simpan");
    fireEvent.click(submitButton);
  
    // Cek apakah pop up muncul
    expect(screen.getByTestId("popup-warning")).toBeInTheDocument();
  
    // Tes tombol "Lihat Detail"
    const detailButton = screen.getByTestId("detail-button");
    fireEvent.click(detailButton);
  
    await waitFor(() => {
      expect(screen.getByText("Maksimal kuantitas makanan adalah 1000!")).toBeInTheDocument();
    });
  });  
});
