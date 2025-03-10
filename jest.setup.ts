import '@testing-library/jest-dom';

// Mock the console.error to prevent noisy logs during tests
// This is optional but can make your test output cleaner
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  // Ignore specific error messages from tests if needed
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('Warning: ReactDOM.render') || 
     args[0].includes('Failed to fetch dashboard data:'))
  ) {
    return;
  }
  originalConsoleError(...args);
};