'use client';

import { FishDeath } from "@/types/fish-death";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Skull, HeartPulse, UserRound } from "lucide-react";

export const columns: ColumnDef<FishDeath>[] = [
  {
    accessorKey: "recorded_at",
    header: () => (
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <p className="text-sm font-medium">Tanggal</p>
      </div>
    ),
    cell: ({ row }: { row: { original: FishDeath } }) => {
      const date = row.original.recorded_at;
      return <div className="text-sm">{format(new Date(date), "dd-MM-yyyy", { locale: id })}</div>;
    },
  },
  {
    accessorKey: "fish_death_count",
    header: () => (
      <div className="flex items-center gap-2">
        <Skull className="w-4 h-4" />
        <p className="text-sm font-medium">Kematian (ekor)</p>
      </div>
    ),
    cell: ({ row }) => <div className="text-sm">{row.original.fish_death_count}</div>,
  },
  {
    accessorKey: "fish_alive_count",
    header: () => (
      <div className="flex items-center gap-2">
        <HeartPulse className="w-4 h-4" />
        <p className="text-sm font-medium">Masih Hidup (ekor)</p>
      </div>
    ),
    cell: ({ row }) => <div className="text-sm">{row.original.fish_alive_count}</div>,
  },
  {
    accessorKey: "reporter",
    header: () => (
      <div className="flex items-center gap-2">
        <UserRound className="w-4 h-4" />
        <p className="text-sm font-medium">Reporter</p>
      </div>
    ),
    cell: ({ row }: { row: { original: FishDeath } }) => {
      const reporter = row.original.reporter;
      return <div className="text-sm">{reporter.first_name} {reporter.last_name}</div>;
    },
  },
];