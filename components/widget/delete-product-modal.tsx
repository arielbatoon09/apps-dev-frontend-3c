import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash, Loader2 } from 'lucide-react';

interface DeleteProductModalProps {
  productId: string;
  onSuccess: () => void;
};

export function DeleteProductModal({ productId, onSuccess }: DeleteProductModalProps) {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);
      const response = await api.post("/api/v1/product-hard-delete", {
        id: productId,
      });
      console.log(response);

      // Revalidate SWR Cache
      onSuccess();

      // Close Modal
      setOpenDialog(false);

      // Success Message
      toast.success(response.data.message);

    } catch (error) {
      toast.error("Failed to delete product!");
      console.error("Failed Deleting Product: ", error);

    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpenDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="w-full flex justify-start">
          <Trash />
          Delete Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the product? <br />This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={loading}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}