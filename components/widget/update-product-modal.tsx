import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/lib/axios";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Loader2 } from 'lucide-react';

import { toast } from "sonner";
import { Product } from "@/app/admin/product/columns";

const formSchema = z.object({
  name: z.string().min(2, { message: "Product name must be at least 2 characters." }),
  description: z.string().min(2, { message: "Product description must be at least 2 characters." }),
  price: z.number().min(1, { message: "Price must a valid number" }),
  stock: z.number().min(1, { message: "Stock must a valid number" }),
});

interface UpdateProductModalProps {
  product: Product;
  onSuccess: () => void;
} 

export function UpdateProductModal({ product, onSuccess }: UpdateProductModalProps) {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await api.post("/api/v1/product-update", {
        id: product.id,
        ...values
      });
      console.log(response);

      // Revalidate SWR Cache
      onSuccess();

      // Reset Form + Close Modal
      form.reset();
      setOpenDialog(false);

      // Success Message
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Failed to update product!");
      console.error("Failed Updating Product: ", error);

    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpenDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="w-full flex justify-start">
          <Pencil />
          Update Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>
            Modify the fields below and save to update this product.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Product Name Field */}
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Product Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Product Description Field */}
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Product Description</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Product Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Product Stock Field */}
            <FormField control={form.control} name="stock" render={({ field }) => (
              <FormItem>
                <FormLabel>Stocks</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Product Stock" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Product Price Field */}
            <FormField control={form.control} name="price" render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter Product Price" {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <Button type="submit">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Product"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}