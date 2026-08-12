import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IssuedApiKey, KeyStatus } from "@ory/client-fetch"
import { Ban } from "lucide-react"

interface ToekenRowProps {
  toeken: IssuedApiKey
  onInfoClick: (keyId: string) => void
  onRevokeClick: (keyId: string) => void
}

const statusVariant = (status?: string) =>
  status === KeyStatus.KeyStatusActive
    ? "default"
    : status === KeyStatus.KeyStatusExpired
      ? "secondary"
      : "destructive"

export const ToekenRow = ({
  toeken,
  onInfoClick,
  onRevokeClick,
}: ToekenRowProps) => {
  const keyId = toeken.key_id ?? ""

  return (
    <div
      className="flex items-center p-2 border-b cursor-pointer hover:bg-muted/50"
      onClick={() => onInfoClick(keyId)}
    >
      <div className="flex-1 max-w-32 truncate ml-2">
        {toeken.name || "N/A"}
      </div>
      <div className="flex-1 truncate ml-2 text-muted-foreground">
        {toeken.key_id || "N/A"}
      </div>
      <div className="flex-1 truncate ml-2">{toeken.actor_id || "N/A"}</div>
      <div className="flex-1 ml-2 flex gap-1 flex-wrap">
        {toeken.scopes?.length ? (
          toeken.scopes.map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))
        ) : (
          <Badge variant="destructive">none</Badge>
        )}
      </div>
      <div className="w-24 truncate ml-4 text-muted-foreground">
        {toeken.create_time
          ? new Date(toeken.create_time).toLocaleDateString()
          : "N/A"}
      </div>
      <div className="w-24 ml-4">
        <Badge variant={statusVariant(toeken.status)}>
          {toeken.status?.replace("KEY_STATUS_", "") || "unknown"}
        </Badge>
      </div>
      <div className="w-10 ml-2 flex justify-center">
        {toeken.status === KeyStatus.KeyStatusActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              onRevokeClick(keyId)
            }}
          >
            <Ban className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
