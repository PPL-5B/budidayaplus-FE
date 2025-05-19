import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { getCycleList } from '@/lib/cycle'
import { Profile } from '@/types/profile'
import { CycleList as CycleListType } from '@/types/cycle'
import CycleList from '../CycleList'

// Mock getCycleList
jest.mock('@/lib/cycle', () => ({
  getCycleList: jest.fn()
}))

const mockCycle = (id: string): any => ({
  id,
  name: `Cycle ${id}`,
  start_date: new Date(),
  end_date: new Date(Date.now() + 86400000),
  supervisor: `user-${id}`,
  pond_fish_amount: 100,
});

const mockCycleList: CycleListType = {
  active: [mockCycle('1')],
  past: [mockCycle('2')],
  stopped: [],
  future: [],
};

const mockUser: Profile = {
    id: 0,
    user: {
        id: 0,
        first_name: 'a',
        last_name: 'b',
        phone_number: '08123456789'
    },
    image_name: '',
    role: 'worker'
}

describe('CycleList component', () => {
  it('renders CycleCarousel with fetched cycleList', async () => {
    // mock return value
    (getCycleList as jest.Mock).mockResolvedValueOnce(mockCycleList)

    render(<CycleList user={mockUser} />)

    await waitFor(() => {
      expect(screen.getByText('Siklus Aktif')).toBeInTheDocument()
      expect(screen.getByText('Siklus Lalu')).toBeInTheDocument()
    })
  })
})
