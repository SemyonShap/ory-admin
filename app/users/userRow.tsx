import { Button } from "@/components/ui/button"
import { Identity } from "@ory/client-fetch"
import { CheckCircle, XCircle, Ban, Unlock } from "lucide-react"

interface UserRowProps {
  user: Identity
  onUserClick: (id: string) => void
  onToggleBlock: (user: Identity) => void
}

export const UserRow = ({ user, onUserClick, onToggleBlock }: UserRowProps) => {
  const isEmailVerified =
    user.verifiable_addresses?.some(
      (addr) => addr.value === user.traits?.email && addr.verified,
    ) || false

  const isBlocked = user.state === "inactive"

  return (
    <div
      className="flex items-center p-2 border-b cursor-pointer hover:bg-muted/50"
      onClick={() => onUserClick(user.id)}
    >
      <div className="flex-1 max-w-20 truncate ml-2">
        {user.traits?.username || user.traits?.name || "N/A"}
      </div>
      <div className="flex-1 truncate ml-2">{user.traits?.email || "N/A"}</div>
      <div className="w-16 ml-2 flex justify-center">
        {isEmailVerified ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500" />
        )}
      </div>
      <div className="w-24 truncate ml-4 text-muted-foreground">
        {user.created_at
          ? new Date(user.created_at).toLocaleDateString()
          : "N/A"}
      </div>
      <div className="w-24 ml-4 flex justify-center">
        <Button
          variant={isBlocked ? "outline" : "destructive"}
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            onToggleBlock(user)
          }}
        >
          {isBlocked ? (
            <Unlock className="h-4 w-4" />
          ) : (
            <Ban className="h-4 w-4" />
          )}
          {isBlocked ? "Unblock" : "Block"}
        </Button>
      </div>
    </div>
  )
}
