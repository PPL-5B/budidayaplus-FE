import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForumTag from '../ForumTag';

describe('ForumTag', () => {
  it('renders the tag name as text', () => {
    render(<ForumTag tag="kolam" />);
    expect(screen.getByText('kolam')).toBeInTheDocument();
  });

  it('applies correct style for "kolam"', () => {
    render(<ForumTag tag="kolam" />);
    const tag = screen.getByText('kolam');
    expect(tag).toHaveStyle({ backgroundColor: '#FFD3D3', color: '#C93939' });
    expect(tag).toHaveClass('w-[60px]');
  });

  it('applies correct style for "budidayaplus"', () => {
    render(<ForumTag tag="budidayaplus" />);
    const tag = screen.getByText('budidayaplus');
    expect(tag).toHaveStyle({ backgroundColor: '#FFE4BE', color: '#FF9500' });
    expect(tag).toHaveClass('w-[80px]');
  });

  it('applies default style for unknown tag', () => {
    render(<ForumTag tag="unknownTag" />);
    const tag = screen.getByText('unknownTag');
    expect(tag).toHaveStyle({ backgroundColor: '#E2E8F0', color: '#475569' });
    expect(tag).toHaveClass('w-[40px]');
  });

  it('case-insensitive matching of tag names', () => {
    render(<ForumTag tag="IkAn" />);
    const tag = screen.getByText('IkAn');
    expect(tag).toHaveStyle({ backgroundColor: '#C0FDFF', color: '#2254C5' });
  });
});
