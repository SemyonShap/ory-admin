import { Button } from "@/components/ui/button";
import { Relationship } from "@ory/client-fetch";
import { Trash2 } from "lucide-react";

interface RelationshipRowProps {
  rel: Relationship;
  onInfoClick: (rel: Relationship) => void;
  onDeleteClick: (rel: Relationship) => void;
}

export const RelationshipRow = ({
  rel,
  onInfoClick,
  onDeleteClick,
}: RelationshipRowProps) => {
  return (
    <div
      className="flex items-center border-b gap-4 p-2 cursor-pointer hover:bg-muted/50"
      onClick={() => onInfoClick(rel)}
    >
      <div className="flex-1 truncate">{rel.namespace}</div>
      <div className="flex-1 truncate">{rel.object}</div>
      <div className="flex-1 truncate">{rel.relation}</div>
      <div className="flex-1 truncate">
        {rel.subject_id
          ? rel.subject_id
          : rel.subject_set
            ? `${rel.subject_set.namespace}:${rel.subject_set.object}#${rel.subject_set.relation}`
            : "N/A"}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(rel);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
