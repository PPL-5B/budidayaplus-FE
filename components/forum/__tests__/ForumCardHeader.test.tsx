import React from 'react';
import { render, screen } from '@testing-library/react';
import ForumCardHeader from '../ForumCardHeader';
import '@testing-library/jest-dom';

describe('ForumCardHeader', () => {
  it('renders the title if provided and short enough', () => {
    const title = 'Short';
    const timestamp = new Date('2025-04-21T10:00:00Z');

    render(<ForumCardHeader title={title} timestamp={timestamp} />);

    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('renders "(No Title)" if no title is provided', () => {
    const timestamp = new Date('2025-04-21T10:00:00Z');

    render(<ForumCardHeader timestamp={timestamp} />);

    expect(screen.getByText('(No Title)')).toBeInTheDocument();
  });

  it('displays the formatted date correctly', () => {
    const title = 'Sample';
    const timestamp = new Date('2025-04-21T10:00:00Z');

    render(<ForumCardHeader title={title} timestamp={timestamp} />);

    expect(screen.getByText(`Tanggal: ${timestamp.toLocaleString()}`)).toBeInTheDocument();
  });

  it('truncates the title if it exceeds 10 characters', () => {
    const longTitle = 'This is a very long forum title';
    const timestamp = new Date('2025-04-21T10:00:00Z');

    render(<ForumCardHeader title={longTitle} timestamp={timestamp} />);

    // Title harus dipotong di 10 karakter + ...
    const expectedTitle = longTitle.slice(0, 10) + '...';
    expect(screen.getByText(expectedTitle)).toBeInTheDocument();
  });
});
