import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FishDeathWarningPopup from '@/components/fish-death/FishDeathWarningPopUp';

describe('FishDeathWarningPopup', () => {
  const message = 'Jumlah kematian melebihi jumlah ikan yang tersedia';
  const mockOnClose = jest.fn();
  const mockOnToggleDetail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders warning popup with message hidden by default', () => {
    render(
      <FishDeathWarningPopup
        message={message}
        onClose={mockOnClose}
        onToggleDetail={mockOnToggleDetail}
        showDetail={false}
      />
    );

    // Komponen utama muncul
    expect(screen.getByTestId('popup-warning')).toBeInTheDocument();

    // Judul dan info muncul
    expect(screen.getByText(/Peringatan!/i)).toBeInTheDocument();
    expect(screen.getByText(/Lihat detail untuk melihat penyebabnya/i)).toBeInTheDocument();

    // Detail pesan tidak muncul
    expect(screen.queryByText(message)).not.toBeInTheDocument();
  });

  test('shows message when showDetail is true', () => {
    render(
      <FishDeathWarningPopup
        message={message}
        onClose={mockOnClose}
        onToggleDetail={mockOnToggleDetail}
        showDetail={true}
      />
    );

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test('calls onClose when "Tutup" button is clicked', () => {
    render(
      <FishDeathWarningPopup
        message={message}
        onClose={mockOnClose}
        onToggleDetail={mockOnToggleDetail}
        showDetail={false}
      />
    );

    const closeBtn = screen.getByTestId('close-button');
    fireEvent.click(closeBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('calls onToggleDetail when "Lihat Detail" button is clicked', () => {
    render(
      <FishDeathWarningPopup
        message={message}
        onClose={mockOnClose}
        onToggleDetail={mockOnToggleDetail}
        showDetail={false}
      />
    );

    const detailBtn = screen.getByTestId('detail-button');
    fireEvent.click(detailBtn);

    expect(mockOnToggleDetail).toHaveBeenCalledTimes(1);
  });
});
