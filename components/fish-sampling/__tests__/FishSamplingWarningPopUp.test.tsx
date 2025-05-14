import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishSamplingWarningPopUp from '../FishSamplingWarningPopUp';

describe('FishSamplingWarningPopup', () => {
  const mockOnClose = jest.fn();

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
        errorMessages={errorMessages}
      />
    );

    expect(screen.queryByText(errorMessages[0])).not.toBeInTheDocument();
    expect(screen.queryByText(errorMessages[1])).not.toBeInTheDocument();
  });

  test('shows error messages when is clicked', () => {
    render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        errorMessages={errorMessages}
      />
    );

    expect(screen.getByText(errorMessages[0])).toBeInTheDocument();
    expect(screen.getByText(errorMessages[1])).toBeInTheDocument();
  });

  test('calls onClose when "Saya Paham" button is clicked', () => {
    render(
      <FishSamplingWarningPopUp
        onClose={mockOnClose}
        errorMessages={errorMessages}
      />
    );

    fireEvent.click(screen.getByText(/Saya Paham/i));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

});
