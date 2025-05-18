// components/cycle/__tests__/AddCycle.test.tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import AddCycle, { AddCycleContent } from '@/components/cycle/AddCycle'
import { fetchPonds } from '@/lib/pond'
import { Pond } from '@/types/pond'
import { Profile } from '@/types/profile'

// Mock the fetchPonds async function
jest.mock('@/lib/pond', () => ({
  fetchPonds: jest.fn().mockResolvedValue([]),
}))

// Mock the AddCycleModal component
jest.mock('@/components/cycle/AddCycleModal', () => ({
  __esModule: true,
  default: ({ pondList }: { pondList: Pond[] }) => (
    <div data-testid="add-cycle-modal">
      Modal with {pondList.length} ponds
      {pondList.map(pond => (
        <div key={pond.pond_id}>{pond.name}</div>
      ))}
    </div>
  ),
}))

// Complete mock user data matching Profile type
const mockSupervisorUser: Profile = {
  id: 123,
  role: 'supervisor',
  image_name: 'profile.jpg',
  user: {
    id: 123,
    first_name: 'John',
    last_name: 'Doe',
    phone_number: '1234567890',
  },
}

const mockFarmerUser: Profile = {
  ...mockSupervisorUser,
  role: 'worker',
}

describe('AddCycleContent', () => {
  const mockPonds: Pond[] = [
    {
      pond_id: "1",
      name: 'Pond 1',
      length: 10,
      width: 5,
      depth: 2,
    },
    {
      pond_id: "2",
      name: 'Pond 2',
      length: 15,
      width: 8,
      depth: 3,
    }
  ]

  it('does not render modal when user is farmer', () => {
    render(
      <AddCycleContent 
        user={mockFarmerUser} 
        pondList={mockPonds} 
      />
    )
    
    expect(screen.queryByTestId('add-cycle-modal')).not.toBeInTheDocument()
  })

  it('does not render modal when user is undefined', () => {
    render(<AddCycleContent pondList={mockPonds} />)
    expect(screen.queryByTestId('add-cycle-modal')).not.toBeInTheDocument()
  })
})

describe('AddCycle', () => {
  const mockFetchPonds = fetchPonds as jest.MockedFunction<typeof fetchPonds>

  const fullMockPonds: Pond[] = [
    {
      pond_id: "1",
      name: 'Test Pond 1',
      length: 10,
      width: 5,
      depth: 2,
    },
    {
      pond_id: "2",
      name: 'Test Pond 2',
      length: 15,
      width: 8,
      depth: 3,
    }
  ]

  beforeEach(() => {
    mockFetchPonds.mockClear()
  })

  it('successfully fetches and renders ponds', async () => {
    mockFetchPonds.mockResolvedValue(fullMockPonds)
    
    const props = { className: 'test-class' }
    
    const { container } = render(
      await AddCycle({ user: mockSupervisorUser, ...props })
    )
    
    expect(mockFetchPonds).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('add-cycle-modal')).toBeInTheDocument()
    expect(container.firstChild).toHaveClass('test-class')
  })

  it('handles empty pond list', async () => {
    mockFetchPonds.mockResolvedValue([])
    
    render(await AddCycle({ user: mockSupervisorUser }))
    
    expect(screen.getByTestId('add-cycle-modal')).toBeInTheDocument()
    expect(screen.getByText(/Modal with 0 ponds/)).toBeInTheDocument()
  })
})