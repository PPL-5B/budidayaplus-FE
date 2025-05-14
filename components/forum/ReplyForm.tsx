'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createReply } from '@/lib/forum/createReply';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle } from 'lucide-react';

const ReplySchema = z.object({
  description: z.string().min(1, 'Deskripsi wajib diisi'),
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
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6 bg-[#EAF0FF] rounded-lg p-6 w-full max-w-[390px] mx-auto"
    >
      <div className="flex justify-center mb-6">
        <h2 className="text-black font-semibold text-[20px] text-center">Balas Forum</h2>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} color="#2254C5" fill="#2254C5" />
          <label htmlFor="description" className="text-[#2254C5] font-medium text-sm">
            Deskripsi
          </label>
        </div>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Masukkan balasan Anda..."
          className="rounded-[12px] bg-white h-24 focus-visible:ring-2 focus-visible:ring-[#2254C5]"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#2254C5] hover:bg-[#1e46a1] text-white font-semibold rounded-md h-11 shadow"
      >
        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
      </Button>
    </form>
  );
};

export default ReplyForm;