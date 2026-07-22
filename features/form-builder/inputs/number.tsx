import { Input } from "@/components/ui/input";
import { InputProps } from "../types";

export function NumberInput({ field, config, handlers, invalid }: InputProps) {
  return (
    <Input
      {...field}
      placeholder={config.placeholder}
      aria-invalid={invalid}
      value={field.value}
      onChange={(e) => {
        const val = e.target.valueAsNumber;
        if (!isNaN(val)) {
          field.onChange(val);
        }
        handlers?.onInputChange?.(e.target.value);
      }}
      onBlur={() => {
        field.onBlur();
        handlers?.onBlur?.(String(field.value));
      }}
      onFocus={() => {
        handlers?.onFocus?.(String(field.value));
      }}
    />
  );
}
