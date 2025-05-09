import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import PondCard from '@/components/pond/PondCard'
import { Pond } from '@/types/pond'

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => children
})

// Mock router if needed
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('PondCard Component', () => {
  const mockPond: Pond = {
    pond_id: '123',
    name: 'JAYA',
    depth: 2,
    width: 3,
    length: 5,
  }

  it('renders pond name in uppercase', () => {
    render(<PondCard pond={mockPond} />)
    expect(screen.getByText('Kolam JAYA')).toBeInTheDocument()
  })

  it('renders correct pond volume', () => {
    render(<PondCard pond={mockPond} />)
    expect(screen.getByText('Volume Kolam: 30 m3')).toBeInTheDocument()
  })

  it('renders detail button', () => {
    render(<PondCard pond={mockPond} />)
    expect(screen.getByText('Lihat Detail Kolam')).toBeInTheDocument()
  })

  it('renders info icon', () => {
    render(<PondCard pond={mockPond} />)
    expect(screen.getByTestId('lucide-icon')).toBeInTheDocument()
  })
})
