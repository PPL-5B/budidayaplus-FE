'use client'

import { toTitleCase } from "@/lib/utils";
import { Profile } from "@/types/profile";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Profile>[] = [
  {
    accessorKey: "user",
    header: "Member",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div >
          {user.first_name} {user.last_name}
        </div>
      )
    },
  },
  {
    header: "Phone Number",
    accessorKey: "user.phone_number",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role
      return (
        <div>
          {toTitleCase(role)}
        </div>
      )
    },
  },
]