'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForumSchema, ForumInput } from '@/types/forum';
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
      description: '',
      parent_id: parentForumId || null,
    },
  });

  const onSubmit = async (data: ForumInput) => {
    try {
      await createForum(data);
      setIsModalOpen(false);
      if (onForumAdded) {
        onForumAdded(); // Trigger refresh in parent component
      }
    } catch (error) {
      console.error('Error creating forum:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-1">Description</label>
        <textarea
          {...register('description')}
          className="w-full border rounded p-2"
          placeholder="Enter forum description..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};

export default ForumForm;
