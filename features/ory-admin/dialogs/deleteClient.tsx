"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteClient } from "@/features/ory-admin/hooks/useClientsQuery";
import { useDialogStore } from "@/store/dialogStore";
import { toast } from "sonner";

export default function DeleteClientDialog() {
  const { open, closeDialog, props } = useDialogStore();
  const deleteMutation = useDeleteClient();

  const clientId = props?.clientId as string | undefined;

  if (!clientId) return toast.error("Client id not found");
  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this client: <br />
            <span className="font-bold">{clientId}</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => closeDialog()}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              await deleteMutation.mutateAsync(clientId, {
                onSuccess: () => {
                  closeDialog();
                },
              });
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <Spinner /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
