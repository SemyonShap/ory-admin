import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

interface CopyToClipboardProps {
  text: string
}

export default function CopyToClipboard({ text }: CopyToClipboardProps) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`Copied to clipboard`)
    } catch {
      toast.error(`Failed to copy`)
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