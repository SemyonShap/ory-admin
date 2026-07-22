"use client";

import { Spinner } from "@/components/ui/spinner";
import { RelationshipRow } from "./relationshipRow";
import { PageError, PageLoader } from "@/components/custom";
import { VirtualList } from "@/components/custom/virtualList";
import { useDialogStore } from "@/store/dialogStore";
import { useInfiniteVirtualizer } from "@/hooks/useInfiniteVirtualizer";
import { useRelationships } from "@/features/ory-admin/hooks/useRelationshipsQuery";
import { Relationship } from "@ory/client-fetch";

export default function RelationshipsPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useRelationships({ pageSize: 100 });
  const { openDialog } = useDialogStore();

  const allRelationships = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  const { parentRef, rowVirtualizer } = useInfiniteVirtualizer({
    items: allRelationships,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const onInfoClick = (rel: Relationship) => {
    openDialog("showRelashionshipInfo", { relationship: rel });
  };

  const onDeleteClick = (rel: Relationship) => {
    openDialog("deleteRelationship", { relationship: rel });
  };

  if (isLoading) return PageLoader();
  if (error) return PageError(error);

  return (
    <div>
      <div className="flex items-center border-b gap-4 p-2 ">
        <div className="flex-1">Namespace</div>
        <div className="flex-1">Object</div>
        <div className="flex-1">Relation</div>
        <div className="flex-1">Subject</div>
        <div className="w-10" />
      </div>
      <VirtualList
        parentRef={parentRef}
        rowVirtualizer={rowVirtualizer}
        items={allRelationships}
        renderRow={(rel) => (
          <RelationshipRow
            rel={rel}
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
