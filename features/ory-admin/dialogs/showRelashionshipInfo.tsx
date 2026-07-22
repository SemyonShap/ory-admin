"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialogStore } from "@/store/dialogStore";
import { Relationship } from "@ory/client-fetch";
import CopyToClipboard from "@/components/custom/copyToClipboard";
import { InfoField, InfoFields } from "@/components/custom/infoFields";

export default function ShowRelashionshipInfoDialog() {
  const { open, props, closeDialog, openDialog } = useDialogStore();
  const relationship = props?.relationship as Relationship | undefined;

  const fields: InfoField[] = [];

  if (relationship) {
    fields.push(
      { label: "Namespace", value: relationship.namespace },
      { label: "Object", value: relationship.object },
      { label: "Relation", value: relationship.relation },
    );

    if (relationship.subject_id) {
      const subjectField: InfoField = {
        label: "Subject ID",
        value: relationship.subject_id,
        onClick: () => {
          openDialog("showUserInfo", { userId: relationship.subject_id });
        },
      };
      fields.push(subjectField);
    } else if (relationship.subject_set) {
      fields.push(
        {
          label: "Subject Namespace",
          value: relationship.subject_set.namespace,
        },
        { label: "Subject Object", value: relationship.subject_set.object },
        {
          label: "Subject Relation",
          value: relationship.subject_set.relation,
        },
      );
    }
  }

  const infoText = fields
    .map((field) => `${field.label}: ${field.value || "N/A"}`)
    .join("\n");

  return (
    <Dialog key={relationship?.object} open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="flex flex-row justify-between items-start">
          <div className="flex flex-col gap-1">
            <DialogTitle className="font-bold uppercase">
              Relationship Information
            </DialogTitle>
            <DialogDescription>
              Details for Keto relationship tuple
            </DialogDescription>
          </div>
          <CopyToClipboard text={infoText} label="Relationship information" />
        </DialogHeader>
        <InfoFields fields={fields} />
      </DialogContent>
    </Dialog>
  );
}
