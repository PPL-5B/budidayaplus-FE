'use client';

import { FoodSampling } from "@/types/food-sampling";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Package, UserRound, Target } from "lucide-react";

export const columns: ColumnDef<FoodSampling>[] = [
  {
    accessorKey: "recorded_at",
    header: () => (
      <div className="flex gap-2">
        <Calendar />
        <p>Tanggal</p>
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.recorded_at;
      return (
        <div>
          {format(date, "dd-MM-yyyy", { locale: id })}
        </div>
      );
    },
  },
  {
    accessorKey: "food_quantity",
    header: () => (
      <div className="flex gap-2">
        <Package />
        <p>Kuantitas Makanan (gram)</p>
      </div>
    ),
    cell: ({ row }) => {
      const foodQuantity = row.original.food_quantity;
      return <div>{foodQuantity} gram</div>;
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
    cell: ({ row }) => {
      const { first_name, last_name } = row.original.reporter;
      return (
        <div>
          {first_name} {last_name}
        </div>
      );
    },
  },
  {
    accessorKey: "target_food_quantity",
    header: () => (
      <div className="flex gap-2">
        <Target />
        <p>Target Kuantitas Makanan (gram)</p>
      </div>
    ),
    cell: ({ row }) => {
      const targetQuantity = row.original.target_food_quantity;
      return <div>{targetQuantity} gram</div>;
    },
  },
];

