// components/forum/__tests__/ForumCardFooter.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForumCardFooter from '../ForumCardFooter';


describe('ForumCardFooter', () => {
  const onViewDetails = jest.fn();
  const onEdit = jest.fn();
  const onDelete = jest.fn();


  afterEach(() => {
    jest.clearAllMocks();
  });


  it('renders view button and avatar', () => {
    render(
      <ForumCardFooter
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        onDelete={onDelete}
        isEditing={false}
        userInitial="J"
        isOwner={false}      />
    );


    expect(screen.getByText('Lihat Unggahan')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
  });


  it('triggers onViewDetails when view button is clicked', () => {
    render(
      <ForumCardFooter
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        onDelete={onDelete}
        isEditing={false}
        userInitial="J"
        isOwner={false}      />
    );


    fireEvent.click(screen.getByText('Lihat Unggahan'));
    expect(onViewDetails).toHaveBeenCalled();
  });


  it('shows edit and delete buttons when not editing', () => {
    render(
      <ForumCardFooter
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        onDelete={onDelete}
        isEditing={false}
        userInitial="A"
        isOwner={false}      />
    );


    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Hapus')).toBeInTheDocument();
  });


  it('does not show edit and delete buttons while editing', () => {
    render(
      <ForumCardFooter
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        onDelete={onDelete}
        isEditing={true}
        userInitial="A"
        isOwner={false}      />
    );


    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Hapus')).not.toBeInTheDocument();
  });
});
