import { Check, ChevronsUpDown, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FieldOptions, InputProps } from "../types"
import { useCallback, useMemo, useState } from "react"

type OptionValue = string | number

function SelectedBadges({
  values,
  options,
  onToggle,
}: {
  values: OptionValue[]
  options: FieldOptions
  onToggle: (val: OptionValue) => void
}) {
  if (values.length === 0) {
    return <span className="text-muted-foreground">Select...</span>
  }

  return (
    <>
      {values.map((val) => {
        const option = options.find((opt) => opt.value === val)
        return (
          <Badge
            key={val}
            variant="outline"
            className="text-xs truncate max-w-48"
          >
            <span className="truncate">{option?.label || val}</span>
            <span
              className="ml-1 cursor-pointer opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation()
                onToggle(val)
              }}
            >
              <X className="h-3 w-3" />
            </span>
          </Badge>
        )
      })}
    </>
  )
}

export function MultiSelectInput({
  field,
  config,
  handlers,
  invalid,
}: InputProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  const value = useMemo(
    () => (field.value ?? []) as OptionValue[],
    [field.value],
  )
  const { options = [] } = config

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) setSearch("")
    setOpen(newOpen)
  }

  const canCreate = options.length === 0

  // Фильтрация опций по поиску
  const filteredOptions = useMemo(() => {
    if (!search) return options
    const lower = search.toLowerCase()
    return options.filter((opt) => opt.label.toLowerCase().includes(lower))
  }, [options, search])

  // Переключение выбранного значения
  const toggleValue = useCallback(
    (selected: OptionValue) => {
      const isSelected = value.some((v) => String(v) === String(selected))
      const newValue = isSelected
        ? value.filter((v) => String(v) !== String(selected))
        : [...value, selected]
      field.onChange(newValue)
    },
    [value, field],
  )

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <div
          aria-expanded={open}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full justify-between min-h-2 h-auto py-1.5 font-normal",
            invalid && "border-destructive ring-destructive",
          )}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            <SelectedBadges
              values={value}
              options={options}
              onToggle={toggleValue}
            />
          </div>
          {canCreate ? (
            <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-96 p-0">
        <Command>
          <CommandInput
            value={search}
            placeholder={canCreate ? "Type and press Enter..." : "Search..."}
            className="h-9"
            onValueChange={(val) => {
              setSearch(val)
              handlers?.onInputChange?.(val)
            }}
          />
          <CommandList>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={String(option.value)}
                  onSelect={() => toggleValue(option.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value.some((v) => String(v) === String(option.value))
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <span className="break-all">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {canCreate && search && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    value={search}
                    onSelect={() => {
                      toggleValue(search)
                      setSearch("")
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Create {search}</span>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
