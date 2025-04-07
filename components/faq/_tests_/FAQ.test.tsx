import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FAQ from '../FAQ'; 

jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionItem: ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
      <button>{title}</button>
      <div>{children}</div>
    </div>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  )
}));

describe('FAQ Component', () => {
  test('renders FAQ component and section title', () => {
    render(<FAQ />);
    expect(screen.getByText('Pertanyaan Umum')).toBeInTheDocument();
  });

  test('renders all FAQ items', () => {
    render(<FAQ />);
    expect(screen.getByText('Apa itu BudidayaPlus?')).toBeInTheDocument();
    expect(screen.getByText('Apa saja Fitur Utama BudidayaPlus?')).toBeInTheDocument();
    expect(screen.getByText('Testimoni Pengguna')).toBeInTheDocument();
  });

  test('renders multi-line text properly with whitespace-pre-line', () => {
    render(<FAQ />);
    const answerText = screen.getByText(/BudidayaPlus adalah aplikasi pendamping digital/i);
    expect(answerText).toBeInTheDocument();
    expect(answerText).toHaveClass('whitespace-pre-line');
  });

  test('renders testimonial with quote and author', () => {
    render(<FAQ />);
    expect(screen.getByText(/Berkat BudidayaPlus, hasil panen saya meningkat/i)).toBeInTheDocument();
    expect(screen.getByText(/- Pak Sugeng, Jawa Timur/)).toBeInTheDocument();
  });

  test('renders features list in answer as plain text', () => {
    render(<FAQ />);
    const featureAnswer = screen.getByText(/1. Pantau kondisi kolam dengan mudah/i);
    expect(featureAnswer).toBeInTheDocument();
    expect(featureAnswer.textContent).toMatch(/3\. Kelola pemberian pakan/);
  });

  test('FAQ Card renders with correct className', () => {
    render(<FAQ />);
    const card = screen.getByTestId('card');
    expect(card).toHaveClass('bg-white shadow-md rounded-lg p-6 mt-8');
  });
});