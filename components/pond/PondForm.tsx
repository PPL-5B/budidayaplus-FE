'use client'

import { Pond, PondInput, PondInputSchema } from '@/types/pond'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { objectToFormData } from '@/lib/utils'
import { addOrUpdatePond } from '@/lib/pond'
import { Ruler, Droplet, ImageIcon, X } from 'lucide-react'

interface PondFormProps {
  pond?: Pond
  setIsModalOpen: (open: boolean) => void
}

const PondForm: React.FC<PondFormProps> = ({ pond, setIsModalOpen }) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [volume, setVolume] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset
  } = useForm<PondInput>({
    resolver: zodResolver(PondInputSchema),
    defaultValues: pond && {
      name: pond.name,
      length: pond.length,
      width: pond.width,
      depth: pond.depth,
    }
  })

  const width = watch('width')
  const length = watch('length')
  const depth = watch('depth')

  const onSubmit = async (data: PondInput) => {
    try {
      setError(null)

      const imageList = data.image as FileList
      data.image = imageList?.[0] ?? undefined

      const formData = objectToFormData(data)
      const res = await addOrUpdatePond(formData, pond?.pond_id)

      if (!res.success) {
        setError('Gagal menyimpan kolam')
        return
      }

      reset()
      dialogRef.current?.close()
      setIsModalOpen(false)
      window.location.reload()
    } catch (error) {
      setError('Gagal menyimpan kolam')
    }
  }

  useEffect(() => {
    if (width && length && depth) {
      setVolume(width * length * depth)
    } else {
      setVolume(null)
    }
  }, [width, length, depth])

  useEffect(() => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg max-w-sm w-full shadow-lg p-6 bg-[#EAF0FF] backdrop:bg-black/50"
      onClose={() => setIsModalOpen(false)}
    >
      <button
        onClick={() => {
          dialogRef.current?.close()
        }}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        aria-label="Tutup"
      >
        <X size={20} />
      </button>

      <h2 className="text-[20px] text-center font-inter font-semibold text-[#2254C5] mb-6">
        {pond ? 'Edit Kolam' : 'Tambah Kolam'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplet size={20} color="#2254C5" fill="#2254C5" />
            <label htmlFor="pond-name" className="text-[#2254C5] font-medium text-sm">Nama Kolam</label>
          </div>
          <Input
            id="pond-name"
            {...register('name')}
            placeholder="Masukkan nama kolam..."
            className="rounded-[15px] bg-white h-10 border-none"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Ruler size={20} color="#2254C5" fill="#2254C5" />
            <label htmlFor="pond-length" className="text-[#2254C5] font-medium text-sm">Panjang (meter)</label>
          </div>
          <Input
            id="pond-length"
            {...register('length', { setValueAs: v => parseFloat(v) })}
            placeholder="Masukkan panjang kolam..."
            className="rounded-[15px] bg-white h-10 border-none"
            step={0.01}
          />
          {errors.length && <p className="text-red-500 text-sm">{errors.length.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Ruler size={20} color="#2254C5" fill="#2254C5" />
            <label htmlFor="pond-width" className="text-[#2254C5] font-medium text-sm">Lebar (meter)</label>
          </div>
          <Input
            id="pond-width"
            {...register('width', { setValueAs: v => parseFloat(v) })}
            placeholder="Masukkan lebar kolam..."
            className="rounded-[15px] bg-white h-10 border-none"
            step={0.01}
          />
          {errors.width && <p className="text-red-500 text-sm">{errors.width.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Ruler size={20} color="#2254C5" fill="#2254C5" />
            <label htmlFor="pond-depth" className="text-[#2254C5] font-medium text-sm">Kedalaman (meter)</label>
          </div>
          <Input
            id="pond-depth"
            {...register('depth', { setValueAs: v => parseFloat(v) })}
            placeholder="Masukkan kedalaman kolam..."
            className="rounded-[15px] bg-white h-10 border-none"
            step={0.01}
          />
          {errors.depth && <p className="text-red-500 text-sm">{errors.depth.message}</p>}
        </div>

        <div className="hidden">
          <div className="flex items-center gap-2">
            <ImageIcon size={20} color="#2254C5" />
            <label htmlFor="pond-image" className="text-[#2254C5] font-medium text-sm">Foto Kolam</label>
          </div>
          <Input
            id="pond-image"
            type="file"
            accept="image/*"
            {...register('image')}
            className="rounded-[15px] bg-white h-10 border-none"
          />
          {errors.image && <p className="text-red-500 text-sm">{(errors.image as any)?.message}</p>}
        </div>

        {volume !== null && (
          <p className="text-center text-sm font-semibold text-[#2254C5]">
            Volume: {volume.toFixed(2)} m<sup>3</sup>
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2254C5] hover:bg-[#1e46a1] text-white font-bold text-sm rounded-md h-11 shadow-inner"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </Button>

        {error && (
          <p className="w-full text-center text-red-500 text-sm">{error}</p>
        )}
      </form>
    </dialog>
  )
}

export default PondForm
