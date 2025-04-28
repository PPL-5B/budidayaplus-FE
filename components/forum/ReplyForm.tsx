'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createReply } from '@/lib/forum/createReply';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const ReplySchema = z.object({
  description: z.string().min(1, 'Description is required'),
});

type ReplyInput = z.infer<typeof ReplySchema>;

interface ReplyFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
  parentForumId: string;
  onReplyAdded?: () => void;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ setIsModalOpen, parentForumId, onReplyAdded }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ReplyInput>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      description: '',
    },
  });

  const onSubmit = async (data: ReplyInput) => {
    try {
      await createReply({ description: data.description, parent_id: parentForumId });
      setIsModalOpen(false);
      reset();
      if (onReplyAdded) {
        onReplyAdded();
      }
    } catch (error) {
      console.error('Error creating reply:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="description" className="block mb-1">Description</label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter your reply..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Reply'}
      </Button>
    </form>
  );
};

export default ReplyForm; 