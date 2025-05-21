'use client'

import { createCycle } from '@/lib/cycle'
import { CycleInput, CycleInputSchema } from '@/types/cycle'
import { Pond } from '@/types/pond'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/datepicker'
import { Input } from "@/components/ui/input"
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { addDays, format, formatDate } from 'date-fns'

interface AddCycleFormProps extends React.HTMLAttributes<HTMLDivElement> {
  pondList: Pond[]
  setIsModalOpen: (open: boolean) => void
}

const AddCycleForm: React.FC<AddCycleFormProps> = ({ pondList, setIsModalOpen, ...props }) => {
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    watch,
    control
  } = useForm<CycleInput>({
    resolver: zodResolver(CycleInputSchema),
  })

  const endDate = watch('end_date') && format(watch('end_date'), 'PPP')

  const onSubmit = async (data: CycleInput) => {
    try {
      setError(null)

      const formattedData = {
        ...data,
        start_date: formatDate(data.start_date, 'yyyy-MM-dd'),
        end_date: formatDate(data.end_date, 'yyyy-MM-dd'),
      };

      const response = await createCycle(formattedData)
      if (!response.success) {
        setError(response.message)
        return
      }

      toast({
        description: 'Siklus berhasil dibuat',
        variant: 'success'
      })
      reset()
      setIsModalOpen(false)

    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div {...props} className="bg-[#EDF2FF]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <Controller
          name='start_date'
          control={control}
          render={({ field }) => (
            <div className='w-full'>
              <Label
                htmlFor="start_date"
                className="block mb-2 font-semibold text-md text-[#000]"
              >
                Tanggal Mulai
              </Label>
              <DatePicker
                id='start_date'
                className='w-full'
                placeholder='Tanggal Mulai'
                date={field.value}
                onDateChange={(date) => {
                  date && field.onChange(date)
                  date && setValue('end_date', addDays(date, 60))
                }}
              />
              {errors.start_date && <p className='text-red-500 text-sm'>{errors.start_date.message}</p>}
            </div>
          )}
        >
        </Controller>
        <input type='hidden' {...register('end_date')} />
        {endDate && <p className='text-sm'> Tanggal selesai: {endDate} </p>}

        {pondList.map((pond, index) => (
          <div key={pond.pond_id}>
            <input type="hidden" {...register(`pond_fish_amount.${index}.pond_id`)} value={pond.pond_id} />
            <Label
                htmlFor={`pond_fish_amount.${index}.pond_id`}
                className="block mb-2 font-semibold text-md text-[#000]"
            >Jumlah ikan kolam {pond.name}</Label>


            <Input
              id={`pond_fish_amount.${index}.pond_id`}
              {...register(`pond_fish_amount.${index}.fish_amount`, {
                valueAsNumber: true,
              })}
              placeholder='Jumlah ikan'
              type='number'
            />
            {errors.pond_fish_amount?.[index]?.fish_amount && <p className='text-red-500 text-sm'>{errors.pond_fish_amount[index].fish_amount.message}</p>}
          </div>
        ))}
        <Button type="submit" disabled={isSubmitting} className="bg-[#2254C5] hover:bg-[#1e46a1] text-white">Simpan</Button>
        {error && <p className='text-red-500'>{error}</p>}
      </form>
    </div >
  )
}

export default AddCycleForm
