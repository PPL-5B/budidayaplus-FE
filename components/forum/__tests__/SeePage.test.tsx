import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SeePage from '@/components/forum/SeePage';

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href }) => {
    return (
      <a href={href} data-testid="link">
        {children}
      </a>
    );
  };
});

describe('SeePage Component', () => {
  it('renders correctly', () => {
    render(<SeePage />);
    
    // Check if the button text is rendered
    const button = screen.getByRole('button', { name: /Lihat Semua Forum/i });
    expect(button).toBeInTheDocument();
    
    // Check if the button has the correct classes
    expect(button).toHaveClass('bg-blue-500');
    expect(button).toHaveClass('hover:bg-blue-600');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('px-4');
    expect(button).toHaveClass('py-2');
    expect(button).toHaveClass('rounded');
    expect(button).toHaveClass('transition-colors');
    expect(button).toHaveClass('duration-300');
  });

  it('links to the correct page', () => {
    render(<SeePage />);
    
    // Check if the link points to the forum page
    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', '/forum');
  });
});