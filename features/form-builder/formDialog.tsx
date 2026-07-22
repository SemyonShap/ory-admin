"use client";

import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormProvider, useFormContext } from "./context/formContext";
import { FormField } from "./formField";
import { Spinner } from "@/components/ui/spinner";
import { AnyFieldHandlers } from "./types";
import { FieldHandlersProvider } from "./context/formHandlersContext";

interface FormDialogProps<T extends z.ZodObject<z.ZodRawShape>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  schema: T;
  onSubmit: (data: z.infer<T>) => void;
  handlers?: Record<string, AnyFieldHandlers>;
}

export function FormDialog<T extends z.ZodObject<z.ZodRawShape>>({
  open,
  onOpenChange,
  title,
  description,
  schema,
  onSubmit,
  handlers,
}: FormDialogProps<T>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          {title && <DialogTitle className="uppercase font-black">{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <FormProvider schema={schema} onSubmit={onSubmit}>
          <FieldHandlersProvider handlers={handlers}>
            <FormContent />
          </FieldHandlersProvider>
          <FormFooter onOpenChange={onOpenChange} />
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

export function FormContent() {
  const { fieldConfigs, methods } = useFormContext();
  return (
    <form className="space-y-4">
      {fieldConfigs.map((config) => (
        <FormField
          key={config.name}
          control={methods.control}
          config={config}
        />
      ))}
    </form>
  );
}

function FormFooter({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const { methods, onSubmit } = useFormContext();
  const { isSubmitting } = methods.formState;

  return (
    <DialogFooter>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        Cancel
      </Button>
      <Button onClick={methods.handleSubmit(onSubmit)} disabled={isSubmitting}>
        {isSubmitting ? <Spinner /> : "Submit"}
      </Button>
    </DialogFooter>
  );
}
