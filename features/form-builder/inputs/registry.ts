import { ComponentType } from "react";
import { FieldType, InputProps } from "../types";
import {
  StringInput,
  NumberInput,
  BooleanInput,
  SelectInput,
  RadioInput,
  MultiSelectInput,
  ComboboxInput,
} from ".";

const registry = new Map<FieldType, ComponentType<InputProps>>([
  ["string", StringInput],
  ["number", NumberInput],
  ["boolean", BooleanInput],
  ["select", SelectInput],
  ["radio", RadioInput],
  ["combobox", ComboboxInput],
  ["multiselect", MultiSelectInput],
]);

export function getInput(type?: FieldType): ComponentType<InputProps> | null {
  return registry.get(type || "string") ?? null;
}
