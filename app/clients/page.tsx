"use client";

import { toast } from "sonner";
import { ClientRow } from "./clientRow";
import { Spinner } from "@/components/ui/spinner";
import { useDialogStore } from "@/store/dialogStore";
import { PageError, PageLoader } from "@/components/custom";
import { VirtualList } from "@/components/custom/virtualList";
import { useInfiniteVirtualizer } from "@/hooks/useInfiniteVirtualizer";
import { useClients } from "@/features/ory-admin/hooks/useClientsQuery";

export default function ClientsPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useClients({ pageSize: 100 });
  const { openDialog } = useDialogStore();

  const allClients = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  const { parentRef, rowVirtualizer } = useInfiniteVirtualizer({
    items: allClients,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const onInfoClick = (clientId: string) => {
    if (!clientId) {
      toast.error("Client not found");
      return;
    }
    openDialog("showClientInfo", { clientId });
  };

  const onDeleteClick = (clientId: string) => {
    if (!clientId) {
      toast.error("Client not found");
      return;
    }
    openDialog("deleteClient", { clientId });
  };

  if (isLoading) return PageLoader();
  if (error) return PageError(error);

  return (
    <div className="flex flex-col">
      <VirtualList
        parentRef={parentRef}
        rowVirtualizer={rowVirtualizer}
        items={allClients}
        renderRow={(client) => (
          <ClientRow
            client={client}
            onInfoClick={onInfoClick}
            onDeleteClick={onDeleteClick}
          />
        )}
      />
      {isFetchingNextPage && (
        <div className="text-center py-2 flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
