import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { InputProps } from "../types";

export function RadioInput({ field, config, handlers, invalid }: InputProps) {
  const options = config.options ?? [];

  return (
    <RadioGroup
      value={field.value ?? ""}
      onValueChange={field.onChange}
      className="flex gap-4"
      aria-invalid={invalid}
      onBlur={() => {
        field.onBlur();
        handlers?.onBlur?.(field.value);
      }}
      onFocus={() => handlers?.onFocus?.(field.value)}
    >
      {options.map((opt) => (
        <div key={opt.value} className="flex items-center space-x-2">
          <RadioGroupItem
            value={String(opt.value)}
            id={`${field.name}-${opt.value}`}
          />
          <Label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}
