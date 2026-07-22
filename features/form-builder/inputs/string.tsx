import { Input } from "@/components/ui/input";
import { InputProps } from "../types";

export function StringInput({ field, config, handlers, invalid }: InputProps) {
  return (
    <Input
      {...field}
      value={field.value ?? ""}
      placeholder={config.placeholder}
      aria-invalid={invalid}
      onChange={(e) => {
        field.onChange(e);
        handlers?.onInputChange?.(e.target.value);
      }}
      onBlur={(e) => {
        field.onBlur();
        handlers?.onBlur?.(e.target.value);
      }}
      onFocus={(e) => {
        handlers?.onFocus?.(e.target.value);
      }}
    />
  );
}
