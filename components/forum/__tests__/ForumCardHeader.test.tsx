// components/forum/__tests__/ForumCardHeader.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ForumCardHeader from '../ForumCardHeader';

describe('ForumCardHeader', () => {
  it('displays full description if under 60 characters', () => {
    const description = 'Short description';
    const timestamp = new Date('2025-04-21T10:00:00Z');

    render(<ForumCardHeader description={description} timestamp={timestamp} />);

    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('truncates long description with ellipsis', () => {
    const description = 'This is a long description that will be trimmed after 60 characters for display.';
    const timestamp = new Date('2025-04-21T10:00:00Z');

    render(<ForumCardHeader description={description} timestamp={timestamp} />);

    expect(screen.getByText(/This is a long description/)).toBeInTheDocument();
    expect(screen.getByText((content) => content.endsWith('...'))).toBeTruthy();
  });

  it('displays a formatted date string', () => {
    const description = 'Sample';
    const timestamp = new Date('2025-04-21T10:00:00Z');

    render(<ForumCardHeader description={description} timestamp={timestamp} />);

    expect(screen.getByText(`Tanggal: ${timestamp.toLocaleString()}`)).toBeInTheDocument();
  });
});
