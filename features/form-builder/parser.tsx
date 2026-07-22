/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod";
import { FieldConfig, FieldOptions, formRegistry } from "./types";

type UnwrapTarget = "optional" | "nullable" | "default";

function isUnwrappable(
  x: z.ZodTypeAny,
  targets: UnwrapTarget[] = ["optional", "nullable", "default"],
): x is z.ZodOptional<any> | z.ZodNullable<any> | z.ZodDefault<any> {
  return targets.some((target) => {
    if (target === "optional" && x instanceof z.ZodOptional) return true;
    if (target === "nullable" && x instanceof z.ZodNullable) return true;
    if (target === "default" && x instanceof z.ZodDefault) return true;
    return false;
  });
}

function unwrapSchema(
  schema: z.ZodTypeAny,
  targets: UnwrapTarget[] = ["optional", "nullable", "default"],
): z.ZodTypeAny {
  let current = schema;
  while (isUnwrappable(current, targets)) {
    current = current.unwrap();
  }
  return current;
}

function walkWrappers<T>(
  schema: z.ZodTypeAny,
  callback: (current: z.ZodTypeAny, depth: number) => T | undefined,
  targets: UnwrapTarget[] = ["optional", "nullable", "default"],
): T | undefined {
  let current = schema;
  let depth = 0;
  while (true) {
    const result = callback(current, depth);
    if (result !== undefined) return result;
    if (isUnwrappable(current, targets)) {
      current = current.unwrap();
      depth++;
    } else {
      break;
    }
  }
  return undefined;
}

function extractDefault(schema: z.ZodTypeAny): any {
  const withoutOptionalNullable = unwrapSchema(schema, [
    "optional",
    "nullable",
  ]);
  if (withoutOptionalNullable instanceof z.ZodDefault) {
    return withoutOptionalNullable.def.defaultValue;
  }
  return undefined;
}

function extractOptions(schema: z.ZodTypeAny): FieldOptions | undefined {
  const unwrapped = unwrapSchema(schema);

  if (unwrapped instanceof z.ZodEnum) {
    return unwrapped.options.map((v) => ({ value: v, label: String(v) }));
  }

  if (unwrapped instanceof z.ZodArray) {
    const inner = unwrapped.element;
    if (inner instanceof z.ZodEnum) {
      return inner.options.map((v) => ({ value: v, label: String(v) }));
    }
  }

  return undefined;
}

function getMeta(schema: z.ZodTypeAny): Record<string, any> {
  return (
    walkWrappers(schema, (current) => {
      return formRegistry.get(current);
    }) ?? {}
  );
}

function mergeMeta(
  parentMeta: Record<string, any>,
  childMeta: Record<string, any>,
): Record<string, any> {
  return { ...parentMeta, ...childMeta };
}

function parseField(
  key: string,
  fieldSchema: z.ZodTypeAny,
  prefix: string,
  inheritedMeta: Record<string, any>,
  fields: FieldConfig[],
): void {
  const fullName = prefix ? `${prefix}.${key}` : key;
  const ownMeta = getMeta(fieldSchema);
  const fieldMeta = mergeMeta(inheritedMeta, ownMeta);
  const unwrapped = unwrapSchema(fieldSchema);

  if (unwrapped instanceof z.ZodObject) {
    for (const [subKey, subSchema] of Object.entries(unwrapped.shape)) {
      parseField(
        subKey,
        subSchema as z.ZodTypeAny,
        fullName,
        fieldMeta,
        fields,
      );
    }
  } else {
    const defaultValue = extractDefault(fieldSchema);
    const options = extractOptions(fieldSchema);
    const config: FieldConfig = {
      name: fullName,
      ...fieldMeta,
      options,
      defaultValue,
      label: fieldMeta.label ?? key,
    };
    fields.push(config);
  }
}

export function parseZodSchema<T extends z.ZodObject<z.ZodRawShape>>(
  schema: T,
): FieldConfig[] {
  const fields: FieldConfig[] = [];
  for (const [key, fieldSchema] of Object.entries(schema.shape)) {
    parseField(key, fieldSchema as z.ZodTypeAny, "", {}, fields);
  }
  return fields;
}
