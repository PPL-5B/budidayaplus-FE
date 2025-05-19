import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { getProfile } from '@/lib/profile';
import Cycle from '../Cycle';

// Mock getProfile
jest.mock('@/lib/profile', () => ({
  getProfile: jest.fn(),
}));

// Mock child components
jest.mock('@/components/cycle', () => ({
  AddCycle: ({ user }: any) => <div data-testid="add-cycle">AddCycle for {user?.name}</div>,
  CycleList: ({ user }: any) => <div data-testid="cycle-list">CycleList for {user?.name}</div>,
}));

const mockUser = {
  id: 'user-1',
  name: 'Test User',
  role: 'supervisor',
  email: 'test@example.com',
  phone: '08123456789',
};

describe('Cycle Page', () => {
  it('renders AddCycle and CycleList with user profile', async () => {
    (getProfile as jest.Mock).mockResolvedValueOnce(mockUser);

    render(<Cycle />);

    await waitFor(() => {
      expect(screen.getByTestId('add-cycle')).toHaveTextContent('AddCycle for Test User');
      expect(screen.getByTestId('cycle-list')).toHaveTextContent('CycleList for Test User');
    });
  });
});
