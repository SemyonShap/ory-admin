"use client"

import { UserRow } from "./userRow"
import { Spinner } from "@/components/ui/spinner"
import { useDialogStore } from "@/store/dialogStore"
import { useServerStore } from "@/store/serverStore"
import { PageError, PageLoader, PageEmpty } from "@/components/common"
import { VirtualList } from "@/components/common/virtualList"
import {
  useUsers,
  useSetUserState,
} from "@/features/ory-admin/hooks/useUsersQuery"
import { useInfiniteVirtualizer } from "@/hooks/useInfiniteVirtualizer"
import { Identity } from "@ory/client-fetch"

export default function UsersPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useUsers({ pageSize: 100 })

  const allUsers = data?.pages.flatMap((page) => page.data ?? []) ?? []
  const { openDialog } = useDialogStore()
  const serversLoading = useServerStore((s) => s.isLoading)
  const setUserState = useSetUserState()

  const { parentRef, rowVirtualizer } = useInfiniteVirtualizer({
    items: allUsers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  })

  const onUserClick = (id: string) => openDialog("showUserInfo", { userId: id })
  const onToggleBlock = (user: Identity) => {
    setUserState.mutate({
      id: user.id,
      state: user.state === "active" ? "inactive" : "active",
    })
  }

  if (serversLoading || isLoading) return PageLoader()
  if (error) return PageError(error)
  if (allUsers.length === 0) return PageEmpty("No users found")

  return (
    <div>
      <div className="flex items-center border-b p-2 text-muted-foreground">
        <div className="flex-1 max-w-20 ml-2">Username</div>
        <div className="flex-1 ml-2">Email</div>
        <div className="w-16 ml-2 flex justify-center">Verified</div>
        <div className="w-24 ml-4">Created</div>
        <div className="w-24 ml-4 flex justify-center">Status</div>
      </div>
      <VirtualList
        parentRef={parentRef}
        rowVirtualizer={rowVirtualizer}
        items={allUsers}
        renderRow={(user) => (
          <UserRow
            user={user}
            onUserClick={onUserClick}
            onToggleBlock={onToggleBlock}
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
