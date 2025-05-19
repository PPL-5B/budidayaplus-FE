// __tests__/WhatsAppContactForm.test.tsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import WhatsAppContactForm from '@/components/contact-us/WhatsAppContactForm'
import { getUser } from '@/lib/auth'

jest.mock('@/lib/auth', () => ({
  getUser: jest.fn(),
}))

window.open = jest.fn()

const mockUser = {
  first_name: 'John',
  last_name: 'Doe',
  phone_number: '08123456789',
}

describe('WhatsAppContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(getUser as jest.Mock).mockResolvedValue(mockUser)
  })

  it('renders form and user data correctly', async () => {
    render(<WhatsAppContactForm />)
    await screen.findByDisplayValue('John Doe')
    expect(screen.getByDisplayValue('08123456789')).toBeInTheDocument()
  })

  it('navigates to /profile when userData is null', async () => {
    (getUser as jest.Mock).mockResolvedValue(null)
    // @ts-ignore
    window.location = { href: '' }

    render(<WhatsAppContactForm />)
    const button = await screen.findByRole('button', { name: /tutup/i })
    fireEvent.click(button)

    expect(window.location.href).toBe('/profile')
  })

  it('navigates to profile with phone number when userData exists', async () => {
    render(<WhatsAppContactForm />)
    const button = await screen.findByRole('button', { name: /tutup/i })
    fireEvent.click(button)

    expect(window.location.href).toBe('/profile/08123456789')
  })


  it('logs error when getUser fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    ;(getUser as jest.Mock).mockRejectedValue(new Error('Failed to fetch'))

    render(<WhatsAppContactForm />)

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to load user data:', expect.any(Error))
    })

    consoleSpy.mockRestore()
  })


  it('shows validation error when message is empty', async () => {
    render(<WhatsAppContactForm />)
    fireEvent.click(await screen.findByText('Submit'))
    expect(await screen.findByText(/harus diisi/i)).toBeInTheDocument()
  })

  it('submits successfully and shows success message', async () => {
    render(<WhatsAppContactForm />)
    fireEvent.change(await screen.findByPlaceholderText(/tulis pesan/i), {
      target: { value: 'Hello' },
    })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() =>
      expect(screen.getByText('Pesan berhasil dikirim!')).toBeInTheDocument()
    )
    expect(window.open).toHaveBeenCalled()
  })

  it('calls setIsSubmitted and setIsModalOpen if provided', async () => {
    const setIsSubmitted = jest.fn()
    const setIsModalOpen = jest.fn()
    render(
      <WhatsAppContactForm
        setIsSubmitted={setIsSubmitted}
        setIsModalOpen={setIsModalOpen}
      />
    )

    fireEvent.change(await screen.findByPlaceholderText(/tulis pesan/i), {
      target: { value: 'Tes' },
    })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(setIsSubmitted).toHaveBeenCalledWith(true)
      expect(setIsModalOpen).toHaveBeenCalledWith(false)
    })
  })

  it('handles API error gracefully', async () => {
    // Simulasi error saat membuka WhatsApp
    window.open = jest.fn(() => {
      throw new Error('Failed')
    })

    render(<WhatsAppContactForm />)

    fireEvent.change(await screen.findByPlaceholderText(/tulis pesan/i), {
      target: { value: 'Tes Error' },
    })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() =>
      expect(
        screen.getByText(/Terjadi kesalahan saat mengirim pesan/i)
      ).toBeInTheDocument()
    )
  })

  it('closes modal and resets success state on X click', async () => {
    const setIsModalOpen = jest.fn()
    render(<WhatsAppContactForm setIsModalOpen={setIsModalOpen} />)
    const closeBtn = await screen.findByRole('button', { name: /tutup/i })
    fireEvent.click(closeBtn)
    expect(setIsModalOpen).toHaveBeenCalledWith(false)
  })
})
