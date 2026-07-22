import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  Resolver,
  FormProvider as RHFProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { createContext, useContext, useMemo } from "react";

import { FieldConfig } from "../types";
import { parseZodSchema } from "../parser";

interface FormContextValue<T extends z.ZodObject<z.ZodRawShape>> {
  methods: UseFormReturn<z.infer<T>>;
  fieldConfigs: FieldConfig[];
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
}

const FormContext = createContext<
  FormContextValue<z.ZodObject<z.ZodRawShape>> | undefined
>(undefined);

interface FormProviderProps<T extends z.ZodObject<z.ZodRawShape>> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  children: React.ReactNode;
}

export function FormProvider<T extends z.ZodObject<z.ZodRawShape>>({
  schema,
  onSubmit,
  children,
}: FormProviderProps<T>) {
  type FormValues = z.infer<T>;

  const fieldConfigs = useMemo(() => parseZodSchema(schema), [schema]);
  const defaultValues = useMemo(() => {
    return fieldConfigs.reduce((acc, field) => {
      if (field.defaultValue !== undefined) {
        (acc as Record<string, unknown>)[field.name] = field.defaultValue;
      }
      return acc;
    }, {} as Partial<FormValues>);
  }, [fieldConfigs]);

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema) as Resolver<FormValues>,
    defaultValues: defaultValues as DefaultValues<FormValues>,
  });

  const contextValue: FormContextValue<T> = {
    methods,
    fieldConfigs,
    onSubmit,
  };

  return (
    <FormContext.Provider
      value={
        contextValue as unknown as FormContextValue<z.ZodObject<z.ZodRawShape>>
      }
    >
      <RHFProvider {...methods}>{children}</RHFProvider>
    </FormContext.Provider>
  );
}

export function useFormContext<T extends z.ZodObject<z.ZodRawShape>>() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context as FormContextValue<T>;
}
