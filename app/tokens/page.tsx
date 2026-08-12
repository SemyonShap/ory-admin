"use client"

import { ToekenRow } from "./tokenRow"
import { Spinner } from "@/components/ui/spinner"
import { useDialogStore } from "@/store/dialogStore"
import { useServerStore } from "@/store/serverStore"
import { PageError, PageLoader, PageEmpty } from "@/components/common"
import { VirtualList } from "@/components/common/virtualList"
import { useInfiniteVirtualizer } from "@/hooks/useInfiniteVirtualizer"
import { useApiKeys } from "@/features/ory-admin/hooks/useApiKeysQuery"

export default function TokensPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useApiKeys({ pageSize: 100 })
  const { openDialog } = useDialogStore()
  const serversLoading = useServerStore((s) => s.isLoading)

  const allKeys = data?.pages.flatMap((page) => page.data ?? []) ?? []

  const { parentRef, rowVirtualizer } = useInfiniteVirtualizer({
    items: allKeys,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  })

  const onInfoClick = (keyId: string) => openDialog("showApiKeyInfo", { keyId })
  const onRevokeClick = (keyId: string) => openDialog("revokeApiKey", { keyId })

  if (serversLoading || isLoading) return PageLoader()
  if (error) return PageError(error)
  if (allKeys.length === 0) return PageEmpty("No API keys found")

  return (
    <div>
      <div className="flex items-center border-b gap-4 p-2 text-muted-foreground">
        <div className="flex-1">Name</div>
        <div className="flex-1">Key ID</div>
        <div className="flex-1">Actor</div>
        <div className="flex-1">Scopes</div>
        <div className="w-24">Created</div>
        <div className="w-24">Status</div>
        <div className="w-10" />
      </div>
      <VirtualList
        parentRef={parentRef}
        rowVirtualizer={rowVirtualizer}
        items={allKeys}
        renderRow={(toeken) => (
          <ToekenRow
            toeken={toeken}
            onInfoClick={onInfoClick}
            onRevokeClick={onRevokeClick}
          />
        )}
      />
      {isFetchingNextPage && (
        <div className="text-center py-2 flex justify-center">
          <Spinner />
        </div>
      )}
    </div>
  )
}
