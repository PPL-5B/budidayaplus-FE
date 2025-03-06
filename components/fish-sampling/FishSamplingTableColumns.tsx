'use client'

import { FishSampling } from "@/types/fish-sampling";
import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Dumbbell, Ruler, UserRound } from "lucide-react";

export const columns: ColumnDef<FishSampling>[] = [
  {
    accessorKey: "recorded_at",
    header: () => {
      return (
        <div className="flex gap-2">
          <Calendar />
          <p>Tanggal</p>
        </div>
      )
    },
    cell: ({ row }) => {
      const date = row.original.recorded_at
      return (
        <div >
          {formatDate(date, "dd-MM-yyyy", { locale: id })}
        </div>
      )
    },
  },
  {
    accessorKey: "fish_weight",
    header: () => {
      return (
        <div className="flex gap-2">
          <Dumbbell />
          <p>Berat (kg)</p>
        </div>
      )
    },
  },
  {
    accessorKey: "fish_length",
    header: () => {
      return (
        <div className="flex gap-2">
          <Ruler />
          <p>Panjang (cm)</p>
        </div>
      )
    },
  },
  {
    accessorKey: "reporter",
    header: () => {
      return (
        <div className="flex gap-2">
          <UserRound />
          <p>Reporter</p>
        </div>
      )
    },
    cell: ({ row }) => {
      const reporter = row.original.reporter
      return (
        <div >
          {reporter.first_name} {reporter.last_name}
        </div>
      )
    },
  },
]