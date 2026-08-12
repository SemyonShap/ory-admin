import {
  entries,
  get,
  isArray,
  isDate,
  isNil,
  isPlainObject,
  startCase,
} from "lodash-es"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export interface InfoField {
  label: string
  value: string | string[] | number | null | undefined
  onClick?: () => void
}

export type InfoFieldSpec<T extends object> = string | (keyof T & string)

function formatValue(value: unknown): string | undefined {
  if (isNil(value)) return undefined
  if (isDate(value)) return value.toLocaleString()
  if (isArray(value)) {
    const joined = value.map((v) => String(v)).join(", ")
    return joined || undefined
  }
  if (isPlainObject(value)) return JSON.stringify(value, null, 2)
  const s = String(value)
  return s || undefined
}

function collectField(path: string, value: unknown, acc: InfoField[]): void {
  if (isNil(value)) return
  if (isArray(value) || isDate(value) || !isPlainObject(value)) {
    acc.push({ label: startCase(path), value: formatValue(value) })
    return
  }
  for (const [k, v] of entries(value)) {
    collectField(`${path}.${k}`, v, acc)
  }
}

export function buildInfoFields<T extends object>(
  obj: T | null | undefined,
  specs: InfoFieldSpec<T>[],
): InfoField[] {
  if (isNil(obj)) return []
  const result: InfoField[] = []
  for (const key of specs) {
    collectField(key, get(obj, key), result)
  }
  return result
}

interface InfoFieldsProps {
  fields: InfoField[]
  isLoading?: boolean
}

export function InfoFields({ fields, isLoading = false }: InfoFieldsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    )
  }

  if (!fields.length) {
    return <div className="text-center"> No data available </div>
  }

  return (
    <div className="flex flex-col gap-2">
      {fields.map((field, index) => (
        <div key={index} className="break-all ">
          <span className="font-medium text-muted-foreground">
            {field.label}:{" "}
          </span>
          <span
            className={cn(
              "whitespace-pre-wrap text-sm ",
              field.onClick ? "cursor-pointer hover:underline" : "",
            )}
            onClick={field.onClick}
          >
            {Array.isArray(field.value)
              ? field.value.join(", ")
              : (field.value ?? "N/A")}
          </span>
        </div>
      ))}
    </div>
  )
}
