// components/forum/__tests__/ForumCardHeader.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ForumCardHeader from '../ForumCardHeader';

describe('ForumCardHeader', () => {
  it('renders the title if provided', () => {
    const title = 'Short title';
    const timestamp = new Date('2025-04-21T10:00:00Z');

    render(<ForumCardHeader title={title} timestamp={timestamp} />);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('renders "(No Title)" if no title is provided', () => {
    const timestamp = new Date('2025-04-21T10:00:00Z');

    render(<ForumCardHeader timestamp={timestamp} />);

    expect(screen.getByText('(No Title)')).toBeInTheDocument();
  });

  it('renders "(No Title)" if no title is provided', () => {
    const timestamp = new Date('2025-04-21T10:00:00Z');
  
    render(<ForumCardHeader title={undefined} timestamp={timestamp} />);
  
    expect(screen.getByText('(No Title)')).toBeInTheDocument();
  });
  

  it('displays the formatted date correctly', () => {
    const title = 'Sample title';
    const timestamp = new Date('2025-04-21T10:00:00Z');

    render(<ForumCardHeader title={title} timestamp={timestamp} />);

    expect(screen.getByText(`Tanggal: ${timestamp.toLocaleString()}`)).toBeInTheDocument();
  });
});
