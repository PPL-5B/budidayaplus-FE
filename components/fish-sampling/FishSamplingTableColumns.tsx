'use client';

import { FishSampling } from "@/types/fish-sampling";
import { ColumnDef } from "@tanstack/react-table";
import { format, differenceInDays, min } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Dumbbell, Ruler, UserRound } from "lucide-react";

export const columns: ColumnDef<FishSampling>[] = [
  {
    accessorKey: "recorded_at",
    header: () => (
      <div className="flex gap-2">
        <Calendar />
        <p>Tanggal</p>
      </div>
    ),
    cell: ({ row }: { row: { original: FishSampling } }) => {
      const date = row.original.recorded_at;
      return <div>{format(new Date(date), "dd-MM-yyyy", { locale: id })}</div>;
    },
  },
  {
    accessorKey: "fish_weight",
    header: () => (
      <div className="flex gap-2">
        <Dumbbell />
        <p>Berat (kg)</p>
      </div>
    ),
  },
  {
    accessorKey: "target_fish_weight",
    header: () => (
      <div className="flex gap-2">
        <Dumbbell />
        <p>Target Berat (kg)</p>
      </div>
    ),
    cell: ({ row, table }: { row: { original: FishSampling }; table: { getPrePaginationRowModel: () => { rows: { original: FishSampling }[] } } }) => {
      const fishSamplings = table.getPrePaginationRowModel().rows.map((r) => r.original);
      if (!fishSamplings.length) return <div>-</div>;

      const firstSamplingDate = min(fishSamplings.map((fs) => new Date(fs.recorded_at)));
      const recordedDate = new Date(row.original.recorded_at);
      const daysElapsed = differenceInDays(recordedDate, firstSamplingDate);

      // Pola pertumbuhan harian berat ikan
      const weightGrowthPerDay = 0.001; // Misal 0.001 kg per hari
      const targetWeight = daysElapsed >= 0 ? (daysElapsed * weightGrowthPerDay).toFixed(4) : "-";

      return <div>{targetWeight}</div>;
    },
  },
  {
    accessorKey: "fish_length",
    header: () => (
      <div className="flex gap-2">
        <Ruler />
        <p>Panjang (cm)</p>
      </div>
    ),
  },
  {
    accessorKey: "target_fish_length",
    header: () => (
      <div className="flex gap-2">
        <Ruler />
        <p>Target Panjang (cm)</p>
      </div>
    ),
    cell: ({ row, table }: { row: { original: FishSampling }; table: { getPrePaginationRowModel: () => { rows: { original: FishSampling }[] } } }) => {
      const fishSamplings = table.getPrePaginationRowModel().rows.map((r) => r.original);
      if (!fishSamplings.length) return <div>-</div>;

      const firstSamplingDate = min(fishSamplings.map((fs) => new Date(fs.recorded_at)));
      const recordedDate = new Date(row.original.recorded_at);
      const daysElapsed = differenceInDays(recordedDate, firstSamplingDate);

      // Pola pertumbuhan harian panjang ikan
      const lengthGrowthPerDay = 0.25; // Misal 0.25 cm per hari
      const targetLength = daysElapsed >= 0 ? (daysElapsed * lengthGrowthPerDay).toFixed(1) : "-";

      return <div>{targetLength}</div>;
    },
  },
  {
    accessorKey: "reporter",
    header: () => (
      <div className="flex gap-2">
        <UserRound />
        <p>Reporter</p>
      </div>
    ),
    cell: ({ row }: { row: { original: FishSampling } }) => {
      const reporter = row.original.reporter;
      return <div>{reporter.first_name} {reporter.last_name}</div>;
    },
  },
];