import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PondForm from '@/components/pond/PondForm'
import { addOrUpdatePond } from '@/lib/pond'

jest.mock('@/lib/pond', () => ({
  addOrUpdatePond: jest.fn()
}))

describe('PondForm', () => {
  const mockSetIsModalOpen = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all input fields and the submit button', () => {
    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />)

    expect(screen.getByLabelText(/nama kolam/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/panjang/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/lebar/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/kedalaman/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /simpan/i })).toBeInTheDocument()
  })

  it('calculates and displays volume when dimensions are filled', () => {
    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />)

    fireEvent.change(screen.getByLabelText(/panjang/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/lebar/i), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/kedalaman/i), { target: { value: '4' } })

    expect(screen.getByText(/volume: 24.00 m/i)).toBeInTheDocument()
  })

  it('submits form and calls addOrUpdatePond successfully', async () => {
    (addOrUpdatePond as jest.Mock).mockResolvedValue({ success: true })

    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />)

    fireEvent.change(screen.getByLabelText(/nama kolam/i), { target: { value: 'Kolam A' } })
    fireEvent.change(screen.getByLabelText(/panjang/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/lebar/i), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/kedalaman/i), { target: { value: '4' } })

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }))

    await waitFor(() => {
      expect(addOrUpdatePond).toHaveBeenCalled()
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false)
    })
  })

  it('displays error message when API returns success: false', async () => {
    (addOrUpdatePond as jest.Mock).mockResolvedValue({ success: false })

    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />)

    fireEvent.change(screen.getByLabelText(/nama kolam/i), { target: { value: 'Kolam B' } })
    fireEvent.change(screen.getByLabelText(/panjang/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/lebar/i), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/kedalaman/i), { target: { value: '4' } })

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }))

    await waitFor(() => {
      expect(screen.getByText(/gagal menyimpan kolam/i)).toBeInTheDocument()
    })
  })

  it('renders with defaultValues when pond is provided (edit mode)', () => {
    const mockPond = {
      pond_id: 'pond-123',
      name: 'Kolam Uji',
      length: 5,
      width: 4,
      depth: 3
    }

    render(<PondForm pond={mockPond} setIsModalOpen={mockSetIsModalOpen} />)

    expect(screen.getByDisplayValue('Kolam Uji')).toBeInTheDocument()
    expect(screen.getByDisplayValue('5')).toBeInTheDocument()
    expect(screen.getByDisplayValue('4')).toBeInTheDocument()
    expect(screen.getByDisplayValue('3')).toBeInTheDocument()
  })


  it('displays error message when API throws an exception', async () => {
    (addOrUpdatePond as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />)

    fireEvent.change(screen.getByLabelText(/nama kolam/i), { target: { value: 'Kolam C' } })
    fireEvent.change(screen.getByLabelText(/panjang/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/lebar/i), { target: { value: '3' } })
    fireEvent.change(screen.getByLabelText(/kedalaman/i), { target: { value: '4' } })

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }))

    await waitFor(() => {
      expect(screen.getByText(/gagal menyimpan kolam/i)).toBeInTheDocument()
    })
  })

  it('submits with pond_id when editing an existing pond', async () => {
    const mockPond = {
      pond_id: 'pond-123',
      name: 'Kolam Lama',
      length: 1,
      width: 1,
      depth: 1,
    }

    ;(addOrUpdatePond as jest.Mock).mockResolvedValue({ success: true })

    render(<PondForm pond={mockPond} setIsModalOpen={mockSetIsModalOpen} />)

    fireEvent.change(screen.getByLabelText(/nama kolam/i), { target: { value: 'Kolam Baru' } })
    fireEvent.change(screen.getByLabelText(/panjang/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/lebar/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/kedalaman/i), { target: { value: '2' } })

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }))

    await waitFor(() => {
      expect(addOrUpdatePond).toHaveBeenCalled()
      expect((addOrUpdatePond as jest.Mock).mock.calls[0][1]).toBe('pond-123')
    })
  })

})
