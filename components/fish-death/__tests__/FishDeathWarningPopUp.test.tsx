import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishDeathWarningPopup from '@/components/fish-death/FishDeathWarningPopUp';

describe('FishDeathWarningPopup', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the popup with the correct message', () => {
    render(<FishDeathWarningPopup message="Test warning message" onClose={mockOnClose} />);

    // Verifikasi bahwa popup dirender dengan pesan yang benar
    expect(screen.getByTestId('popup-warning')).toBeInTheDocument();
    expect(screen.getByText('Indikator Tidak Sehat!')).toBeInTheDocument();
    expect(screen.getByText('Test warning message')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(<FishDeathWarningPopup message="Test warning message" onClose={mockOnClose} />);

    // Klik tombol "Saya Paham"
    const closeButton = screen.getByRole('button', { name: /saya paham/i });
    fireEvent.click(closeButton);

    // Verifikasi bahwa fungsi onClose dipanggil
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders the close icon correctly', () => {
    render(<FishDeathWarningPopup message="Test warning message" onClose={mockOnClose} />);

    // Verifikasi bahwa ikon close dirender
    const closeIcon = screen.getByTestId('popup-warning').querySelector('svg');
    expect(closeIcon).toBeInTheDocument();
  });
});