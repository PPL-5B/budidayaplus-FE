'use client'

import { Pond, PondInput, PondInputSchema } from '@/types/pond'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { objectToFormData } from '@/lib/utils'
import { addOrUpdatePond } from '@/lib/pond'
import { Ruler, Droplet, ImageIcon } from 'lucide-react'

interface PondFormProps {
  pond?: Pond
  setIsModalOpen: (open: boolean) => void
}

const PondForm: React.FC<PondFormProps> = ({ pond, setIsModalOpen }) => {
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
      setIsModalOpen(false)
      window.location.reload()

    } catch (error) {
      setError('Gagal menyimpan kolam')
    }
  }

  useEffect(() => {
    if (width && length && depth) {
      setVolume(width * length * depth)
    }
    return () => setVolume(null)
  }, [width, length, depth])

  return (
    <div className="bg-[#EAF0FF] rounded-md p-6 w-full max-w-sm mx-auto relative">
      <div className="flex justify-center mb-6">
        <h2 className="text-[20px] text-center font-inter font-semibold text-[#2254C5]">
          {pond ? 'Edit Kolam' : 'Tambah Kolam'}
        </h2>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

        {/* Nama Kolam */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Droplet size={20} color="#2254C5" fill="#2254C5" />
            <label htmlFor="pond-name" className="text-[#2254C5] font-medium text-sm">Nama Kolam</label>
          </div>
          <Input
            id="pond-name"
            {...register('name')}
            placeholder="Masukkan nama kolam..."
            className="rounded-[15px] bg-white h-10"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Panjang */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Ruler size={20} color="#2254C5" fill="#2254C5" />
            <label htmlFor="pond-length" className="text-[#2254C5] font-medium text-sm">Panjang (meter)</label>
          </div>
          <Input
            id="pond-length"
            {...register('length', { setValueAs: v => parseFloat(v) })}
            placeholder="Masukkan panjang kolam..."
            className="rounded-[15px] bg-white h-10"
            step={0.01}
          />
          {errors.length && <p className="text-red-500 text-sm">{errors.length.message}</p>}
        </div>

        {/* Lebar */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Ruler size={20} color="#2254C5" fill="#2254C5" />
            <label htmlFor="pond-width" className="text-[#2254C5] font-medium text-sm">Lebar (meter)</label>
          </div>
          <Input
            id="pond-width"
            {...register('width', { setValueAs: v => parseFloat(v) })}
            placeholder="Masukkan lebar kolam..."
            className="rounded-[15px] bg-white h-10"
            step={0.01}
          />
          {errors.width && <p className="text-red-500 text-sm">{errors.width.message}</p>}
        </div>

        {/* Kedalaman */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Ruler size={20} color="#2254C5" fill="#2254C5" />
            <label htmlFor="pond-depth" className="text-[#2254C5] font-medium text-sm">Kedalaman (meter)</label>
          </div>
          <Input
            id="pond-depth"
            {...register('depth', { setValueAs: v => parseFloat(v) })}
            placeholder="Masukkan kedalaman kolam..."
            className="rounded-[15px] bg-white h-10"
            step={0.01}
          />
          {errors.depth && <p className="text-red-500 text-sm">{errors.depth.message}</p>}
        </div>

        {/* Gambar Kolam */}
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
            className="rounded-[15px] bg-white h-10"
          />
          {errors.image && <p className="text-red-500 text-sm">{(errors.image as any)?.message}</p>}
        </div>

        {/* Volume */}
        {volume && (
          <p className="text-center text-sm font-semibold text-[#2254C5]">
            Volume: {volume.toFixed(2)} m<sup>3</sup>
          </p>
        )}

        {/* Tombol Simpan */}
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
    </div>
  )
}

export default PondForm
