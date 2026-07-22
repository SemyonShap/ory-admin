"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDeleteRelationships } from "@/features/ory-admin/hooks/useRelationshipsQuery"
import { useDialogStore } from "@/store/dialogStore"
import { Relationship, DeleteRelationshipsRequest } from "@ory/client-fetch"
import { toast } from "sonner"

export default function DeleteRelationshipDialog() {
  const { open, closeDialog, props } = useDialogStore()
  const deleteMutation = useDeleteRelationships()

  const relationship = props?.relationship as Relationship | undefined

  if (!relationship) return null

	const handleDelete = () => {
		if (!relationship.subject_id && !relationship.subject_set) {
			toast.error("No subject found")
			return
		}

		const req: DeleteRelationshipsRequest = {
			namespace: relationship.namespace,
			object: relationship.object,
			relation: relationship.relation,
			...(relationship.subject_id
				? { subjectId: relationship.subject_id }
				: {
						subjectSetNamespace: relationship.subject_set!.namespace,
						subjectSetObject: relationship.subject_set!.object,
						subjectSetRelation: relationship.subject_set!.relation,
					}),
		}

		deleteMutation.mutate(req, {
			onSuccess: () => closeDialog(),
		})
	}
	
  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Relationship</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this relationship? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm text-muted-foreground space-y-1 py-2">
          <p><strong>Namespace:</strong> {relationship.namespace}</p>
          <p><strong>Object:</strong> {relationship.object}</p>
          <p><strong>Relation:</strong> {relationship.relation}</p>
          <p>
            <strong>Subject:</strong>{" "}
            {relationship.subject_id
              ? relationship.subject_id
              : relationship.subject_set
                ? `${relationship.subject_set.namespace}:${relationship.subject_set.object}#${relationship.subject_set.relation}`
                : "N/A"}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => closeDialog()}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
