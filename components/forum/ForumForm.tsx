'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ForumSchema, ForumInput } from '@/types/forum/forumSchema';
import { createForum } from '@/lib/forum/createForum';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tag, MessageCircle, Pencil } from 'lucide-react'; 

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
    formState: { errors, isSubmitting },
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
    <div className="bg-[#EAF0FF] rounded-md p-6 w-full max-w-sm mx-auto relative">
      <div className="flex justify-center mb-6">
        <h2 className="text-black font-semibold text-[20px] text-center break-words font-inter">
          Membuat Forum
        </h2>
      </div>


      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        {!isReply && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Pencil size={20} color="#2254C5" fill="#2254C5" />
              <label htmlFor="title" className="text-[#2254C5] font-medium text-sm">Judul</label>
            </div>
            <Input
              id="title"
              {...register('title')}
              placeholder="Masukkan judul forum..."
              className="rounded-[15px] bg-white h-10"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MessageCircle size={20} color="#2254C5" fill="#2254C5" />
            <label htmlFor="description" className="text-[#2254C5] font-medium text-sm">Deskripsi</label>
          </div>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Masukkan deskripsi forum..."
            required
            className="rounded-[15px] bg-white h-20"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}
        </div>

        {/* Tag */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Tag size={20} color="#2254C5" fill="#2254C5" />
            <label htmlFor="tag" className="text-[#2254C5] font-medium text-sm">Tag</label>
          </div>

          {/* Custom select */}
          <div className="relative">
            <select
              id="tag"
              {...register('tag')}
              className="appearance-none rounded-[15px] bg-white w-full h-10 px-3 pr-10 text-sm text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {TAG_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Custom blue arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-3 h-3 fill-[#2254C5]"
                viewBox="0 0 10 6"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0L5 6L10 0H0Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2254C5] hover:bg-[#1e46a1] text-white font-bold text-sm rounded-md h-11 shadow-inner"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default ForumForm;
