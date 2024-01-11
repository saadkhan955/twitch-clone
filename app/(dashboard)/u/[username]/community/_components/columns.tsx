"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { UnblockButton } from "./unblock-button"

export type blockedUser = {
  id: string
  userId: string
  imgUrl: string
  username: string
  createdAt: string
}

export const columns: ColumnDef<blockedUser>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Username
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-x-4">
        <UserAvatar
          username={row.original.username}
          imgUrl={row.original.imgUrl}
        />
        <span>{row.original.username}</span>
      </div>
    )
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date blocked
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UnblockButton userId={row.original.userId} />
  },
]
