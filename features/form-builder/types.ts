import z from "zod";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

export type FieldType =
  | "string"
  | "number"
  | "boolean"
  | "select"
  | "radio"
  | "combobox"
  | "multiselect";

export interface FormFieldMeta {
  label?: string;
  placeholder?: string;
  interface?: FieldType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hidden?: (formValues: any) => boolean;
}

export const formRegistry = z.registry<FormFieldMeta>();

export type FieldOptions =  { value: string | number; label: string }[];

export type FieldConfig = {
  name: string;
  options?:FieldOptions;
  defaultValue?: unknown;
} & FormFieldMeta;

export type FormValues<T extends z.ZodObject<z.ZodRawShape>> = z.infer<T>;

export type FieldHandlers<T extends z.ZodObject<z.ZodRawShape>> = {
  onInputChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  onFocus?: (value: string) => void;
  getOptions?: (
    formValues: FormValues<T>,
  ) => FieldOptions;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFieldHandlers = FieldHandlers<any>;

export interface InputProps {
  field: ControllerRenderProps<FieldValues, string>;
  config: FieldConfig;
  handlers?: AnyFieldHandlers;
  invalid?: boolean;
}
