"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import { UpdateProductModal } from "@/components/widget/update-product-modal";
import { DeleteProductModal } from "@/components/widget/delete-product-modal";
import { ToggleProductStatusModal } from "@/components/widget/toggle-product-modal";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export const createColumns = (onSuccess: () => void): ColumnDef<Product>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Product ID
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      )
    }
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      )
    }
  },
  {
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Description
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      )
    }
  },
  {
    accessorKey: "stock",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Stock
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      )
    }
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <span className="flex items-center cursor-pointer" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      )
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
      }).format(price);

      return <span>{formatted}</span>
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive") as boolean;

      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>{ isActive ? "Active" : "Inactive" }</span>
      )
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy Product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Product</DropdownMenuItem>
            <div className="flex flex-col items-start">
              {/* Update Product Modal */}
              <UpdateProductModal product={product} onSuccess={onSuccess} />

              {/* Toggle Product Status Modal */}
              <ToggleProductStatusModal productId={product.id} isActive={product.isActive} onSuccess={onSuccess} />

              {/* Delete Product Modal */}
              <DeleteProductModal productId={product.id} onSuccess={onSuccess} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  }
]