import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export interface InfoField {
  label: string
  value: string | string[] | number | null | undefined
  onClick?: () => void
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
