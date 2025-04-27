import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UpdateProfileModal from '@/components/profile/UpdateProfileModal';
import { Profile } from '@/types/profile';

// Mock the dependencies
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }) => (
    <div data-testid="dialog" data-open={open} onClick={() => onOpenChange(!open)}>
      {children}
    </div>
  ),
  DialogTrigger: ({ children, asChild }) => (
    <div data-testid="dialog-trigger" data-aschild={asChild}>
      {children}
    </div>
  )
}));

jest.mock('@/components/ui/dialog-content-no-x', () => ({
  DialogContentNoX: ({ children }) => (
    <div data-testid="dialog-content-no-x">{children}</div>
  )
}));

jest.mock('@/components/profile', () => ({
  UpdateProfileForm: jest.fn(({ profile, setIsModalOpen }) => (
    <div data-testid="update-profile-form">
      <button data-testid="mock-submit" onClick={() => setIsModalOpen(false)}>
        Save
      </button>
      <span>Profile name: {profile.user.first_name} {profile.user.last_name}</span>
    </div>
  ))
}));

jest.mock('@/components/ui/icon-chevron-filled', () => ({
  __esModule: true,
  default: () => <div data-testid="icon-chevron-filled" />
}));

describe('UpdateProfileModal', () => {
  const mockProfile: Profile = {
    id: 1,
    image_name: 'profile1.png',
    role: 'worker',
    user: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '08123456789',
    }
  };

  // Positive test cases
  describe('Positive Tests', () => {
    it('renders the modal with children as trigger', () => {
      render(
        <UpdateProfileModal profile={mockProfile}>
          <button>Open Modal</button>
        </UpdateProfileModal>
      );

      expect(screen.getByText('Open Modal')).toBeInTheDocument();
      expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument();
    });

    it('opens the modal when trigger is clicked', () => {
      render(
        <UpdateProfileModal profile={mockProfile}>
          <button data-testid="trigger-button">Open Modal</button>
        </UpdateProfileModal>
      );

      const triggerButton = screen.getByTestId('trigger-button');
      fireEvent.click(triggerButton);

      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true');
      expect(screen.getByText('Ubah Profil')).toBeInTheDocument();
      expect(screen.getByTestId('update-profile-form')).toBeInTheDocument();
    });

    it('passes profile data to the UpdateProfileForm', () => {
      render(
        <UpdateProfileModal profile={mockProfile}>
          <button data-testid="trigger-button">Open Modal</button>
        </UpdateProfileModal>
      );

      const triggerButton = screen.getByTestId('trigger-button');
      fireEvent.click(triggerButton);

      expect(screen.getByText(`Profile name: ${mockProfile.user.first_name} ${mockProfile.user.last_name}`)).toBeInTheDocument();
    });

    it('closes the modal when back button is clicked', async () => {
      render(
        <UpdateProfileModal profile={mockProfile}>
          <button data-testid="trigger-button">Open Modal</button>
        </UpdateProfileModal>
      );

      // Open modal
      const triggerButton = screen.getByTestId('trigger-button');
      fireEvent.click(triggerButton);
      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true');

      // Click back button
      const backButton = screen.getByRole('button', { name: '' });
      fireEvent.click(backButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false');
      });
    });

    it('closes the modal when form submission is successful', async () => {
      render(
        <UpdateProfileModal profile={mockProfile}>
          <button data-testid="trigger-button">Open Modal</button>
        </UpdateProfileModal>
      );

      // Open modal
      const triggerButton = screen.getByTestId('trigger-button');
      fireEvent.click(triggerButton);
      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true');

      // Submit the form (mock submit button)
      const submitButton = screen.getByTestId('mock-submit');
      fireEvent.click(submitButton);

      // Modal should be closed
      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'false');
      });
    });
  });

  // Edge cases
  describe('Edge Cases', () => {

    it('renders with additional HTML attributes passed to the wrapper div', () => {
      render(
        <UpdateProfileModal 
          profile={mockProfile}
          data-testid="custom-wrapper"
          className="custom-class"
        >
          <button>Open Modal</button>
        </UpdateProfileModal>
      );

      const wrapper = screen.getByTestId('custom-wrapper');
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  // Negative test cases
  describe('Negative Tests', () => {

    it('handles rapid opening and closing of modal', async () => {
      render(
        <UpdateProfileModal profile={mockProfile}>
          <button data-testid="trigger-button">Open Modal</button>
        </UpdateProfileModal>
      );

      const triggerButton = screen.getByTestId('trigger-button');
      
      // Rapidly click to open and close
      fireEvent.click(triggerButton); // Open
      fireEvent.click(screen.getByTestId('dialog')); // Close
      fireEvent.click(triggerButton); // Open again
      
      // Should end up open
      expect(screen.getByTestId('dialog')).toHaveAttribute('data-open', 'true');
      expect(screen.getByText('Ubah Profil')).toBeInTheDocument();
    });

  });

  // Test for specific UI elements
  describe('UI Elements', () => {
    it('renders the correct title in the modal header', () => {
      render(
        <UpdateProfileModal profile={mockProfile}>
          <button data-testid="trigger-button">Open Modal</button>
        </UpdateProfileModal>
      );

      const triggerButton = screen.getByTestId('trigger-button');
      fireEvent.click(triggerButton);

      expect(screen.getByText('Ubah Profil')).toBeInTheDocument();
      expect(screen.getByText('Ubah Profil')).toHaveClass('text-[#2254C5]');
    });

    it('renders the back button with correct styling', () => {
      render(
        <UpdateProfileModal profile={mockProfile}>
          <button data-testid="trigger-button">Open Modal</button>
        </UpdateProfileModal>
      );

      const triggerButton = screen.getByTestId('trigger-button');
      fireEvent.click(triggerButton);

      const backButton = screen.getByRole('button', { name: '' });
      expect(backButton).toHaveClass('absolute left-0 text-[#2254C5]');
      expect(screen.getByTestId('icon-chevron-filled')).toBeInTheDocument();
    });
  });
});