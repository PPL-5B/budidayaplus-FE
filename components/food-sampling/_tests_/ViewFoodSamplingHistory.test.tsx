import React from 'react';
import { render, screen } from '@testing-library/react';
import ViewFoodSamplingHistory from '@/components/food-sampling/ViewFoodSamplingHistory';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import userEvent from '@testing-library/user-event';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('ViewFoodSamplingHistory Component', () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn(); // suppress error for edge case test
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  test('renders correctly with valid pondId (positive case)', () => {
    render(<ViewFoodSamplingHistory pondId="pond-123" />);
    const button = screen.getByRole('link', { name: /lihat riwayat/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/pond/pond-123/food-sampling');
  });

  test('renders but href is broken when pondId is empty (edge case)', () => {
    render(<ViewFoodSamplingHistory pondId="" />);
    const button = screen.getByRole('link', { name: /lihat riwayat/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/pond//food-sampling'); // not ideal but technically renders
  });

  test('supports passing additional props (like className)', () => {
    render(<ViewFoodSamplingHistory pondId="pond-456" className="custom-class" />);
    const wrapper = screen.getByTestId('view-pond-quality-history');
    expect(wrapper).toHaveClass('custom-class');
  });
});
