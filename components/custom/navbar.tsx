"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { PanelLeft, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialogStore } from "@/store/dialogStore";

export function AdminNavbar() {
  const { toggleSidebar } = useSidebar();
  const { openDialog } = useDialogStore();

  return (
    <nav className="w-full flex items-center justify-between p-4 border-b bg-background">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <PanelLeft className="w-4 h-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => openDialog("createClient")}>
            <Plus className="h-4 w-4" />
            Client
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => openDialog("createRelationship")}>
            <Plus className="h-4 w-4" />
            Relationship
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}
