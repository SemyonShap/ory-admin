import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldValues,
  Path,
  useWatch,
} from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { FieldConfig } from "./types";
import { getInput } from "./inputs/registry";
import { useFieldHandlers } from "./context/formHandlersContext";
import { useFormContext } from "./context/formContext";
import { useMemo } from "react";

interface FormFieldProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  config: FieldConfig;
}

export function FormField<T extends FieldValues = FieldValues>({
  control,
  config,
}: FormFieldProps<T>) {
  const fieldName = config.name as Path<T>;
  const handlers = useFieldHandlers(config.name);
  const { methods } = useFormContext();
  const formValues = useWatch({ control: methods.control });

  const resolvedConfig = useMemo(() => {
    if (handlers.getOptions) {
      const dynamicOptions = handlers.getOptions(formValues);
      return { ...config, options: dynamicOptions };
    }
    return config;
  }, [config, handlers, formValues]);

  const InputComponent = getInput(config.interface);
  if (!InputComponent) return null;

  const isHidden = config.hidden ? config.hidden(formValues) : false;
  if (isHidden) return null;

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid || undefined}>
          <FieldLabel>{config.label}</FieldLabel>
          <InputComponent
            field={field as ControllerRenderProps<FieldValues, string>}
            config={resolvedConfig}
            handlers={handlers}
            invalid={fieldState.invalid}
          />
          {fieldState.invalid && (
            <FieldError>{fieldState.error?.message}</FieldError>
          )}
        </Field>
      )}
    />
  );
}
