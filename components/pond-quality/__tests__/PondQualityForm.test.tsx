import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PondQualityForm from '../PondQualityForm'
import { addOrUpdatePondQuality } from '@/lib/pond-quality'

jest.mock('@/lib/pond-quality', () => ({
  addOrUpdatePondQuality: jest.fn()
}))
jest.mock('@/lib/utils', () => ({
  objectToFormData: jest.fn((data) => data)
}))

describe('PondQualityForm', () => {
  const mockSetIsModalOpen = jest.fn()
  const defaultProps = {
    setIsModalOpen: mockSetIsModalOpen,
    pondId: 'pond-1',
    cycleId: 'cycle-1'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('submits successfully and closes modal', async () => {
    (addOrUpdatePondQuality as jest.Mock).mockResolvedValue({ success: true })
    // Mock window.location.reload
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
      writable: true
    })

    render(<PondQualityForm {...defaultProps} />)
    fireEvent.change(screen.getByLabelText(/Temperatur/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/pH/i), { target: { value: '7' } })
    fireEvent.change(screen.getByLabelText(/Kejernihan/i), { target: { value: '10' } })
    fireEvent.change(screen.getByLabelText(/Oksigen/i), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText(/Salinitas/i), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/Ammonia/i), { target: { value: '0.1' } })
    fireEvent.change(screen.getByLabelText(/Sirkulasi/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/Phosphate/i), { target: { value: '0.2' } })
    fireEvent.change(screen.getByLabelText(/ORP/i), { target: { value: '300' } })
    fireEvent.change(screen.getByLabelText(/Nitrate/i), { target: { value: '0.3' } })

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(addOrUpdatePondQuality).toHaveBeenCalled()
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false)
      expect(window.location.reload).toHaveBeenCalled()
    })
  })

  it('shows error if API returns success: false', async () => {
    (addOrUpdatePondQuality as jest.Mock).mockResolvedValue({ success: false })

    render(<PondQualityForm {...defaultProps} />)
    fireEvent.change(screen.getByLabelText(/Temperatur/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/pH/i), { target: { value: '7' } })
    fireEvent.change(screen.getByLabelText(/Kejernihan/i), { target: { value: '10' } })
    fireEvent.change(screen.getByLabelText(/Oksigen/i), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText(/Salinitas/i), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/Ammonia/i), { target: { value: '0.1' } })
    fireEvent.change(screen.getByLabelText(/Sirkulasi/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/Phosphate/i), { target: { value: '0.2' } })
    fireEvent.change(screen.getByLabelText(/ORP/i), { target: { value: '300' } })
    fireEvent.change(screen.getByLabelText(/Nitrate/i), { target: { value: '0.3' } })

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText(/Gagal menyimpan kualitas air/i)).toBeInTheDocument()
    expect(mockSetIsModalOpen).not.toHaveBeenCalled()
  })

  it('shows error if API throws', async () => {
    (addOrUpdatePondQuality as jest.Mock).mockRejectedValue(new Error('fail'))

    render(<PondQualityForm {...defaultProps} />)
    fireEvent.change(screen.getByLabelText(/Temperatur/i), { target: { value: '25' } })
    fireEvent.change(screen.getByLabelText(/pH/i), { target: { value: '7' } })
    fireEvent.change(screen.getByLabelText(/Kejernihan/i), { target: { value: '10' } })
    fireEvent.change(screen.getByLabelText(/Oksigen/i), { target: { value: '5' } })
    fireEvent.change(screen.getByLabelText(/Salinitas/i), { target: { value: '1' } })
    fireEvent.change(screen.getByLabelText(/Ammonia/i), { target: { value: '0.1' } })
    fireEvent.change(screen.getByLabelText(/Sirkulasi/i), { target: { value: '2' } })
    fireEvent.change(screen.getByLabelText(/Phosphate/i), { target: { value: '0.2' } })
    fireEvent.change(screen.getByLabelText(/ORP/i), { target: { value: '300' } })
    fireEvent.change(screen.getByLabelText(/Nitrate/i), { target: { value: '0.3' } })

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    expect(await screen.findByText(/Terjadi kesalahan saat menyimpan data/i)).toBeInTheDocument()
    expect(mockSetIsModalOpen).not.toHaveBeenCalled()
  })
})