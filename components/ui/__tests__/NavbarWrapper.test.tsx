import { render, screen } from '@testing-library/react';
import NavbarWrapper from '@/components/ui/NavbarWrapper';
import { usePathname } from 'next/navigation';

// 1. Mock semua dependency
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('../navbar', () => () => (
  <div data-testid="mock-navbar">Mock Navbar</div>
));

describe('NavbarWrapper', () => {
  // 2. Reset mock sebelum tiap test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 3. Test Case 1: Render null di route login/register
  it('should return null on auth routes', () => {
    (usePathname as jest.Mock).mockReturnValue('/auth/login');
    const { container } = render(<NavbarWrapper />);
    expect(container.firstChild).toBeNull();
  });

  // 4. Test Case 2: Render navbar di non-auth routes
  it('should render navbar on non-auth routes', () => {
    (usePathname as jest.Mock).mockReturnValue('/home');
    render(<NavbarWrapper />);
    expect(screen.getByTestId('mock-navbar')).toBeInTheDocument();
  });

  // 5. Test Case 3: Handle nested auth routes (e.g., /auth/login)
  it('should hide navbar on nested auth routes', () => {
    (usePathname as jest.Mock).mockReturnValue('/auth/register');
    const { container } = render(<NavbarWrapper />);
    expect(container.firstChild).toBeNull();
  });

  // 6. Test Case 4: Render navbar dengan container biru
  it('should apply correct styling to navbar container', () => {
    (usePathname as jest.Mock).mockReturnValue('/pond');
    render(<NavbarWrapper />);
    const container = screen.getByTestId('mock-navbar').parentElement;
    expect(container).toHaveClass('fixed');
    expect(container).toHaveClass('bg-[#2154C5]');
  });
});