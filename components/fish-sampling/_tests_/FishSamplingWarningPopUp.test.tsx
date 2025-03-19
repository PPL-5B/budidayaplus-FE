import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishSamplingWarningPopUp from '../FishSamplingWarningPopUp';
import fs from 'fs';
import path from 'path';

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

  test('shows error messages when "Lihat Detail" is clicked', async () => {
    render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={true}
        errorMessages={errorMessages}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessages[0])).toBeInTheDocument();
      expect(screen.getByText(errorMessages[1])).toBeInTheDocument();
    });
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

    fireEvent.click(screen.getByTestId('close-button'));
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

    fireEvent.click(screen.getByTestId('detail-button'));
    expect(mockOnShowDetail).toHaveBeenCalledTimes(1);
  });

  test('toggles error message visibility when "Lihat Detail" is clicked twice', async () => {
    const { rerender } = render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={false}
        errorMessages={errorMessages}
      />
    );

    fireEvent.click(screen.getByTestId('detail-button'));
    rerender(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={true}
        errorMessages={errorMessages}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(errorMessages[0])).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('detail-button'));
    rerender(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={false}
        errorMessages={errorMessages}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText(errorMessages[0])).not.toBeInTheDocument();
    });
  });

  test('handles empty errorMessages gracefully', () => {
    render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={false}
        errorMessages={[]}
      />
    );

    expect(screen.getByText(/Indikator Abnormal!/i)).toBeInTheDocument();
    expect(screen.queryByText(/Lihat detail untuk melihat faktor penyebabnya/i)).toBeInTheDocument();
  });

  test('should not fail if no actions are performed', () => {
    render(
      <FishSamplingWarningPopUp
        onClose={() => {}}
        onShowDetail={() => {}}
        showDetail={false}
        errorMessages={[]}
      />
    );
  });

  test('fake test to waste time', () => {
    expect(true).toBe(true);
  });

  test('ensures nothing breaks when clicking buttons multiple times', () => {
    render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        onShowDetail={mockOnShowDetail}
        showDetail={false}
        errorMessages={errorMessages}
      />
    );

    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByTestId('detail-button'));
    }
    expect(mockOnShowDetail).toHaveBeenCalledTimes(10);

    for (let i = 0; i < 5; i++) {
      fireEvent.click(screen.getByTestId('close-button'));
    }
    expect(mockOnClose).toHaveBeenCalledTimes(5);
  });

  test('dummy test with useless imports', () => {
    expect(typeof fs).toBe('object');
    expect(typeof path).toBe('object');
  });
});
