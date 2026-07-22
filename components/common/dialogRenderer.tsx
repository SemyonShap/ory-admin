"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { useDialogStore } from "@/store/dialogStore";
import { Spinner } from "@/components/ui/spinner";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  [key: string]: unknown;
}

const dialogComponentsMap: Record<string, React.ComponentType<DialogProps>> = {
  createClient: dynamic<DialogProps>(
    () => import("@/features/ory-admin/dialogs/createClient"),
    { ssr: false },
  ),
  createRelationship: dynamic<DialogProps>(
    () => import("@/features/ory-admin/dialogs/createRelationship"),
    { ssr: false },
  ),
  showClient: dynamic<DialogProps>(
    () => import("@/features/ory-admin/dialogs/showClientSecrets"),
    { ssr: false },
  ),
  showClientInfo: dynamic<DialogProps>(
    () => import("@/features/ory-admin/dialogs/showClientInfo"),
    { ssr: false },
  ),
  showUserInfo: dynamic<DialogProps>(
    () => import("@/features/ory-admin/dialogs/showUserInfo"),
    { ssr: false },
  ),
  deleteClient: dynamic<DialogProps>(
    () => import("@/features/ory-admin/dialogs/deleteClient"),
    { ssr: false },
  ),
  deleteRelationship: dynamic<DialogProps>(
    () => import("@/features/ory-admin/dialogs/deleteRelationship"),
    { ssr: false },
  ),
  showRelashionshipInfo: dynamic<DialogProps>(
    () => import("@/features/ory-admin/dialogs/showRelashionshipInfo"),
    { ssr: false },
  ),
};

function DialogManager(): React.JSX.Element | null {
  const { type, open, props, closeDialog } = useDialogStore();

  if (!open || !type) return null;

  const Component = dialogComponentsMap[type];

  if (!Component) {
    console.error(`Dialog component for type "${type}" not found`);
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      }
    >
      <Component
        open={open}
        onOpenChange={closeDialog}
        {...(props as Record<string, unknown>)}
      />
    </Suspense>
  );
}

export function DialogRenderer(): React.JSX.Element {
  return <DialogManager />;
}
