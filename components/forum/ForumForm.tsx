'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForumSchema, ForumInput } from '@/types/forum/forumSchema';
import { createForum } from '@/lib/forum/createForum';
import { Button } from '@/components/ui/button';

interface ForumFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
  parentForumId?: string;
  onForumAdded?: () => void;
}

const ForumForm: React.FC<ForumFormProps> = ({ setIsModalOpen, parentForumId, onForumAdded }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForumInput>({
    resolver: zodResolver(ForumSchema),
    defaultValues: {
      title: '',
      description: '',
      tag: 'ikan',
      parent_id: parentForumId ?? null,
    },
  });

  const onSubmit = async (data: ForumInput) => {
    try {
      await createForum(data);
      setIsModalOpen(false);
      if (onForumAdded) {
        onForumAdded();
      }
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block mb-1 font-semibold">Title</label>
        <input
          id="title"
          {...register('title')}
          className="w-full border rounded p-2"
          placeholder="Enter forum title..."
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block mb-1 font-semibold">Description</label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full border rounded p-2"
          placeholder="Enter forum description..."
          required
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Tag */}
      <div>
        <label htmlFor="tag" className="block mb-1 font-semibold">Tag</label>
        <select
          id="tag"
          {...register('tag')}
          className="w-full border rounded p-2"
          required
        >
          <option value="ikan">Ikan</option>
          <option value="kolam">Kolam</option>
          <option value="siklus">Siklus</option>
          <option value="budidayaplus">BudidayaPlus</option>
        </select>
        {errors.tag && (
          <p className="text-red-500 text-sm">{errors.tag.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
};

export default ForumForm;
