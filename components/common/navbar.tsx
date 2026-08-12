"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PanelLeft, MoreHorizontal, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDialogStore } from "@/store/dialogStore"
import { ServerSelector } from "@/components/common/serverSelector"

export function AdminNavbar() {
  const { toggleSidebar } = useSidebar()
  const { openDialog } = useDialogStore()

  return (
    <nav className="w-full flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <PanelLeft className="w-4 h-4" />
        </Button>
        <ServerSelector />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "cursor-default",
          )}
        >
          <MoreHorizontal className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openDialog("createClient")}>
            <Plus className="h-4 w-4" />
            Client
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog("createApiKey")}>
            <Plus className="h-4 w-4" />
            API Key
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog("createRelationship")}>
            <Plus className="h-4 w-4" />
            Relationship
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
