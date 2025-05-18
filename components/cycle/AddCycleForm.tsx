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
import { addDays, format } from 'date-fns'


// ✅ Helper function untuk perubahan tanggal (testable)
export const handleDateChange = (
  selectedDate: Date | undefined,
  onChange: (date: Date) => void,
  setEndDate: (field: 'end_date', value: Date) => void
) => {
  if (!selectedDate) return
  onChange(selectedDate)
  setEndDate('end_date', addDays(selectedDate, 60))
}

// ✅ Helper function untuk formatting data submit (testable)
export const formatCycleData = (data: CycleInput) => ({
  ...data,
  start_date: format(data.start_date, 'yyyy-MM-dd'),
  end_date: format(data.end_date, 'yyyy-MM-dd'),
})

interface AddCycleFormProps extends React.HTMLAttributes<HTMLDivElement> {
  pondList: Pond[]
  setIsModalOpen: (open: boolean) => void
}

const AddCycleForm: React.FC<AddCycleFormProps> = ({ pondList, setIsModalOpen, ...props }) => {
  const [error] = useState<string | null>(null)
  useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    control,
  } = useForm<CycleInput>({
    resolver: zodResolver(CycleInputSchema),
    defaultValues: {
      pond_fish_amount: pondList.map(pond => ({
        pond_id: pond.pond_id,
        fish_amount: 0
      })),
    }
  })

const onSubmit = async (data: CycleInput) => { setIsModalOpen(false); await createCycle(formatCycleData(data)); }

  return (
    <div className="relative bg-[#EAF0FF] p-6 rounded-xl max-w-md mx-auto" {...props}>
      <button
        type="button"
        onClick={() => setIsModalOpen(false)}
        className="absolute top-3 right-3 text-black text-lg font-bold hover:text-gray-600"
        aria-label="Close"
      >
        ×
      </button>

      <h2 className="text-center font-semibold text-lg text-[#2254C5] mb-4">Mulai Siklus</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="start_date"
          control={control}
          render={({ field }) => (
            <div className="w-full">
              <Label htmlFor="start_date" className="text-[#2254C5]">Tanggal Mulai</Label>
              <DatePicker
                id="start_date"
                className="w-full bg-[#E6E6E5] text-black"
                placeholder="Pilih tanggal"
                date={field.value}
                onDateChange={(date) => handleDateChange(date, field.onChange, setValue)}
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm">{errors.start_date.message}</p>
              )}
            </div>
          )}
        />
        <input type="hidden" {...register('end_date')} />

        {pondList.map((pond, index) => (
          <div key={pond.pond_id}>
            <input type="hidden" {...register(`pond_fish_amount.${index}.pond_id`)} value={pond.pond_id} />
            <Label htmlFor={`pond_fish_amount.${index}.pond_id`} className="text-[#2254C5]">
              Jumlah ikan kolam {pond.name}
            </Label>
            <Input
              id={`pond_fish_amount.${index}.pond_id`}
              {...register(`pond_fish_amount.${index}.fish_amount`, {
                valueAsNumber: true,
              })}
              placeholder="Masukkan jumlah ikan"
              type="number"
              className="bg-[#E6E6E5] text-black"
            />
            {errors.pond_fish_amount?.[index]?.fish_amount && (
              <p className="text-red-500 text-sm">
                {errors.pond_fish_amount[index].fish_amount?.message}
              </p>
            )}
          </div>
        ))}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2254C5] hover:bg-[#1e45a8] text-white"
        >
          {isSubmitting ? 'Menyimpan...' : 'Simpan'}
        </Button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  )
}

export default AddCycleForm
