import { useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PauseCircle, PlayCircle, Loader2 } from 'lucide-react';

interface ToggleProductStatusModalProps {
  productId: string;
  isActive: boolean;
  onSuccess: () => void;
};

export function ToggleProductStatusModal({ productId, isActive, onSuccess }: ToggleProductStatusModalProps) {
  const [isOpenDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    try {
      setLoading(true);
      const toggleURL = isActive ? "/api/v1/product-soft-delete" : "/api/v1/product-restore";
      const response = await api.post(toggleURL, {
        id: productId
      });
      console.log(response);

      // Revalidate SWR Cache
      onSuccess();

      // Close Modal
      setOpenDialog(false);

      // Success Message
      toast.success(response.data.message);

    } catch (error) {
      toast.error(`Failed to ${isActive ? "deactivate" : "activate"} product!`);
      console.error(error);

    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpenDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="w-full flex justify-start">
          {isActive ? (
            <>
              <PauseCircle />
              Deactivate Product
            </>
          ) : (
            <>
              <PlayCircle />
              Activate Product
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Activate/Deactivate Product</DialogTitle>
          <DialogDescription>
            {isActive 
            ? "Are you want to deactivate? You can reactivate it later."
            : "Are you want to activate?" }
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={loading}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isActive ? "Deactivating..." : "Activating..."}
              </>
            ) : (
              isActive ? "Deactivate" : "Activate"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}