"use client"

import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";

import { createColumns, Product } from "./columns";
import { DataTable } from "./data-table";
import { AddProductModal } from "@/components/widget/add-product-modal";

export default function ProductAdminPage() {
  // Fetch Data
  const { data: response, mutate } = useSWR("/api/v1/product-list", fetcher);
  const data: Product[] = response?.data || [];
  console.log(data);

  return (
    <div className="container mx-auto py-10">
      <AddProductModal onSuccess={mutate} />
      <DataTable columns={createColumns(mutate)} data={data} />
    </div>
  )
}