import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OAuth2Client } from "@ory/client-fetch";
import { Trash2 } from "lucide-react";

interface ClientRowProps {
  client: OAuth2Client;
  onInfoClick: (id: string) => void;
  onDeleteClick: (id: string) => void;
}

export const ClientRow = ({
  client,
  onInfoClick,
  onDeleteClick,
}: ClientRowProps) => {
  return (
    <div
      className="flex items-center p-2 border-b cursor-pointer hover:bg-muted/50"
      onClick={() => onInfoClick(client.client_id!)}
    >
      <div className="flex-1 max-w-20 truncate ml-2">
        {client.client_name || "N/A"}
      </div>
      <div className="flex-1 truncate ml-2">
        <div className="flex flex-col gap-1">
          {client.redirect_uris?.map((uri: string) => (
            <Badge key={uri} variant="outline">
              {uri}
            </Badge>
          ))}
        </div>
      </div>
      <div className="w-24 truncate ml-4 text-muted-foreground">
        {client.created_at
          ? new Date(client.created_at).toLocaleDateString()
          : "N/A"}
      </div>
      <Button
        variant="outline"
        size="sm"
        className="ml-2"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(client.client_id!);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
