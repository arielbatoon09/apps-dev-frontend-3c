import { columns, Product } from "./columns";
import { DataTable } from "./data-table";

async function getData(): Promise<Product[]> {
  return [
    {
      id: "533f4712-c94c-4441-aab4-4a514a4d72e8",
      name: "Nike Shoes",
      description: "Original Nike Shoes with signature of NBA Player.",
      stock: 123,
      price: 123
    },
    {
      id: "7a23f2d0-4a0c-421a-9ce0-5846aeea34c9",
      name: "Addidas Shoes",
      description: "Original Addidas Shoes with signature of NBA Player.",
      stock: 123,
      price: 123
    },
  ]
}

export default async function ProductAdminPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}