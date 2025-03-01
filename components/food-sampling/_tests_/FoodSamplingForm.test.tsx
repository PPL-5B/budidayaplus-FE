import { render, screen } from '@testing-library/react';
import FoodSamplingForm from '../FoodSamplingForm';
import '@testing-library/jest-dom';
import React from 'react';

describe('FoodSamplingForm Component', () => {
  test('Komponen dapat dirender tanpa error', () => {
    render(<FoodSamplingForm pondId="1" cycleId="1" setIsModalOpen={() => {}} />);
    expect(screen.getByLabelText(/Kuantitas Makanan/i)).toBeInTheDocument();
  });
});
