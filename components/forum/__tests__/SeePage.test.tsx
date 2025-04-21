import React from 'react';
import { render, screen } from '@testing-library/react';
import SeePage from '@/components/forum/SeePage';
import '@testing-library/jest-dom';

// Mock Link
const MockLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} data-testid="link">{children}</a>
);
MockLink.displayName = 'MockLink';

jest.mock('next/link', () => ({
  __esModule: true,
  default: MockLink,
}));

describe('SeePage', () => {
  it('renders button with correct text and styling', () => {
    render(<SeePage />);
    const button = screen.getByRole('button', { name: /check our forum/i });

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-500');
    expect(button).toHaveTextContent('Check our Forum');
  });

  it('wraps the button in a link with correct href', () => {
    render(<SeePage />);
    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', '/forum');
    expect(link.firstChild).toHaveTextContent('Check our Forum');
  });
});
