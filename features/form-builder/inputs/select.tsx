import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useMemo } from "react"
import { InputProps } from "../types"

export function SelectInput({ field, config, handlers, invalid }: InputProps) {
  const options = useMemo(() => config.options ?? [], [config.options])
  const disabled = options.length === 0

  useEffect(() => {
    if (
      field.value &&
      options.length > 0 &&
      !options.some((o) => String(o.value) === String(field.value))
    ) {
      field.onChange("")
    }
  }, [field, options])

  return (
    <Select
      value={field.value ?? ""}
      onValueChange={field.onChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={invalid ? "border-destructive" : ""}
        onBlur={() => {
          field.onBlur()
          handlers?.onBlur?.(field.value)
        }}
        onFocus={() => handlers?.onFocus?.(field.value)}
      >
        <SelectValue
          placeholder={
            disabled ? "No options" : config.placeholder || "Select..."
          }
        />
      </SelectTrigger>
      <SelectContent>
        {config.options?.map((opt) => (
          <SelectItem key={opt.value} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
