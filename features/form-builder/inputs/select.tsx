import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputProps } from "../types";

export function SelectInput({ field, config, handlers, invalid }: InputProps) {
  return (
    <Select value={field.value ?? ""} onValueChange={field.onChange}>
      <SelectTrigger
        className={invalid ? "border-destructive" : ""}
        onBlur={() => {
          field.onBlur();
          handlers?.onBlur?.(field.value);
        }}
        onFocus={() => handlers?.onFocus?.(field.value)}
      >
        <SelectValue placeholder={config.placeholder || "Select..."} />
      </SelectTrigger>
      <SelectContent>
        {config.options?.map((opt) => (
          <SelectItem key={opt.value} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
