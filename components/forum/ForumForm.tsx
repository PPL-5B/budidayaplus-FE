'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForumSchema, ForumInput } from '@/types/forum/forumSchema';
import { createForum } from '@/lib/forum/createForum';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import clsx from 'clsx'; // Untuk conditional classnames

interface ForumFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
  parentForumId?: string;
  onForumAdded?: () => void;
  isReply?: boolean;
}

const TAG_OPTIONS = [
  { value: 'ikan', label: 'Ikan' },
  { value: 'kolam', label: 'Kolam' },
  { value: 'siklus', label: 'Siklus' },
  { value: 'budidayaplus', label: 'BudidayaPlus' },
] as const;

const ForumForm: React.FC<ForumFormProps> = ({ setIsModalOpen, parentForumId, onForumAdded, isReply = false }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ForumInput>({
    resolver: zodResolver(ForumSchema),
    defaultValues: {
      title: '',
      description: '',
      tag: 'ikan',
      parent_id: parentForumId || null,
    },
  });

  const selectedTag = watch('tag');

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
      {!isReply && (
        <div>
          <label className="block mb-1">Title</label>
          <Input
            {...register('title')}
            placeholder="Enter forum title..."
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>
      )}
      <div>
        <label className="block mb-1">Description</label>
        <Textarea
          {...register('description')}
          placeholder="Enter forum description..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
      {!isReply && (
        <div>
          <label className="block mb-1">Tag</label>
          <div className="flex flex-wrap gap-2">
            {TAG_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('tag', option.value)}
                className={clsx(
                  "px-4 py-2 rounded-md border text-sm font-medium",
                  selectedTag === option.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-black border-gray-300 hover:border-blue-400"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
          {errors.tag && (
            <p className="text-red-500 text-sm">{errors.tag.message}</p>
          )}
        </div>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};

export default ForumForm;
