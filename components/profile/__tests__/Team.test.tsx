import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import Team from '@/components/profile/Team'
import * as profileApi from '@/lib/profile'
import { Profile } from '@/types/profile'

// ✅ Mock CreateWorkerAccount component
jest.mock('@/components/profile/CreateWorkerAccount', () => ({
  __esModule: true,
  default: () => <button data-testid="create-worker-btn">Tambah Anggota</button>,
}))

// ✅ Mock fetchTeamByUsername
jest.mock('@/lib/profile', () => ({
  __esModule: true,
  fetchTeamByUsername: jest.fn(),
}))

const mockFetchTeam = profileApi.fetchTeamByUsername as jest.Mock<Promise<Profile[]>, [string]>

const mockTeam: Profile[] = [
  {
    id: 1,
    role: 'worker',
    image_name: '',
    user: {
      id: 101,
      first_name: 'Ali',
      last_name: 'Akbar',
      phone_number: '0811111111',
    },
  },
  {
    id: 2,
    role: 'supervisor',
    image_name: '',
    user: {
      id: 102,
      first_name: 'Budi',
      last_name: 'Santoso',
      phone_number: '0822222222',
    },
  },
]

describe('Team component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders team list with name, phone, and role', async () => {
    mockFetchTeam.mockResolvedValueOnce(mockTeam)

    render(<Team username="ali" isUserSelf={true} userRole="supervisor" />)

    await waitFor(() => {
      expect(screen.getByText('Anggota Tim')).toBeInTheDocument()

      expect(screen.getByText('Ali Akbar')).toBeInTheDocument()
      expect(screen.getByText('0811111111')).toBeInTheDocument()
      expect(screen.getByText('Worker')).toBeInTheDocument()

      expect(screen.getByText('Budi Santoso')).toBeInTheDocument()
      expect(screen.getByText('0822222222')).toBeInTheDocument()
      expect(screen.getByText('Supervisor')).toBeInTheDocument()
    })
  })

  it('shows CreateWorkerAccount if isUserSelf and role is supervisor', async () => {
    mockFetchTeam.mockResolvedValueOnce([])

    render(<Team username="any" isUserSelf={true} userRole="supervisor" />)

    await waitFor(() => {
      expect(screen.getByTestId('create-worker-btn')).toBeInTheDocument()
    })
  })

  it('does not show CreateWorkerAccount if not isUserSelf', async () => {
    mockFetchTeam.mockResolvedValueOnce([])

    render(<Team username="any" isUserSelf={false} userRole="supervisor" />)

    await waitFor(() => {
      expect(screen.queryByTestId('create-worker-btn')).not.toBeInTheDocument()
    })
  })

  it('handles edge case: team is empty', async () => {
    mockFetchTeam.mockResolvedValueOnce([])

    render(<Team username="noone" isUserSelf={true} userRole="supervisor" />)

    await waitFor(() => {
      expect(screen.getByText('Anggota Tim')).toBeInTheDocument()
      // Karena tim kosong, tidak ada nama yang muncul
      expect(screen.queryByText(/Ali|Budi|Cici/)).not.toBeInTheDocument()
    })
  })

  it('handles corner case: unknown role', async () => {
    const teamWithUnknownRole: Profile[] = [
      {
        id: 3,
        role: 'admin' as unknown as Profile['role'], // paksa supaya tetap valid
        image_name: '',
        user: {
          id: 103,
          first_name: 'Cici',
          last_name: 'Chen',
          phone_number: '0833333333',
        },
      },
    ]

    mockFetchTeam.mockResolvedValueOnce(teamWithUnknownRole)

    render(<Team username="cici" isUserSelf={true} userRole="supervisor" />)

    await waitFor(() => {
      expect(screen.getByText('Cici Chen')).toBeInTheDocument()
      expect(screen.getByText('0833333333')).toBeInTheDocument()
      expect(screen.getByText('Admin')).toBeInTheDocument() // hasil dari toTitleCase
    })
  })
})
