import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishSamplingWarningPopUp from '../FishSamplingWarningPopUp';

describe('FishSamplingWarningPopup', () => {
  const mockOnClose = jest.fn();
  const mockOnShowDetail = jest.fn();

  const errorMessages = [
    "Berat dan panjang ikan harus lebih dari 0",
    "Panjang ikan lebih dari 100 cm"
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal with title and description', () => {
    render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={false}
        errorMessages={errorMessages}
      />
    );

    expect(screen.getByText(/Indikator Abnormal!/i)).toBeInTheDocument();
    expect(screen.getByText(/Lihat detail untuk melihat faktor penyebabnya/i)).toBeInTheDocument();
  });

  test('does not show error messages initially', () => {
    render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={false}
        errorMessages={errorMessages}
      />
    );

    expect(screen.queryByText(errorMessages[0])).not.toBeInTheDocument();
    expect(screen.queryByText(errorMessages[1])).not.toBeInTheDocument();
  });

  test('shows error messages when "Lihat Detail" is clicked', () => {
    render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={true}
        errorMessages={errorMessages}
      />
    );

    expect(screen.getByText(errorMessages[0])).toBeInTheDocument();
    expect(screen.getByText(errorMessages[1])).toBeInTheDocument();
  });

  test('calls onClose when "Tutup" button is clicked', () => {
    render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={false}
        errorMessages={errorMessages}
      />
    );

    fireEvent.click(screen.getByText(/Tutup/i));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onShowDetail when "Lihat Detail" button is clicked', () => {
    render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={false}
        errorMessages={errorMessages}
      />
    );

    fireEvent.click(screen.getByText(/Lihat Detail/i));
    expect(mockOnShowDetail).toHaveBeenCalledTimes(1);
  });

  test('toggles error message visibility when "Lihat Detail" is clicked twice', () => {
    const { rerender } = render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={false}
        errorMessages={errorMessages}
      />
    );

    fireEvent.click(screen.getByText(/Lihat Detail/i));
    rerender(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={true}
        errorMessages={errorMessages}
      />
    );

    expect(screen.getByText(errorMessages[0])).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Lihat Detail/i));
    rerender(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={false}
        errorMessages={errorMessages}
      />
    );

    expect(screen.queryByText(errorMessages[0])).not.toBeInTheDocument();
  });
});
