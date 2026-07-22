import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface CopyToClipboardProps {
  text: string
  label: string
}

export default function CopyToClipboard({ text, label }: CopyToClipboardProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied to clipboard`)
    } catch {
      toast.error(`Failed to copy ${label}`)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={copyToClipboard}
    >
      <Copy className="h-4 w-4" />
    </Button>
  )
}