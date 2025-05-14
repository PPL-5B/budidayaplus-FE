import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FoodSamplingWarningPopup from '@/components/food-sampling/FoodSamplingWarningPopUp';

describe('FoodSamplingWarningPopup', () => {
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders popup with correct content (positive case)', () => {
    render(<FoodSamplingWarningPopup onClose={onCloseMock} />);

    // Check wrapper
    expect(screen.getByTestId('popup-warning')).toBeInTheDocument();

    // Check icon (lucide icon is svg, not critical to test specific shape)
    expect(screen.getByRole('heading', { name: /indikator tidak sehat/i })).toBeInTheDocument();

    // Check description
    expect(screen.getByText(/maksimal kuantitas makanan 1000/i)).toBeInTheDocument();

    // Check button
    expect(screen.getByRole('button', { name: /saya paham/i })).toBeInTheDocument();
  });

  test('calls onClose when button is clicked (interaction)', () => {
    render(<FoodSamplingWarningPopup onClose={onCloseMock} />);
    const closeButton = screen.getByRole('button', { name: /saya paham/i });
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('edge case: renders even when onClose is a no-op', () => {
    render(<FoodSamplingWarningPopup onClose={() => {}} />);
    expect(screen.getByTestId('popup-warning')).toBeVisible();
  });
});
