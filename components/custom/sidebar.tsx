"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Briefcase, Network } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import JikoIcon from "@/components/icons/jiko-icon";

export function AdminSidebar() {
  const pathname = usePathname();

  const items = [
    { href: "/users", label: "Users", icon: Users },
    { href: "/clients", label: "Clients", icon: Briefcase },
    { href: "/relationships", label: "Relationships", icon: Network },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 px-6">
        <Link href="/" className="flex items-center">
          <JikoIcon className="h-8 w-auto" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          <div className="flex flex-col gap-1">
            {items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href} className="flex items-start gap-4 font-heading">
                    <item.icon className="self-center" />
                    {item.label}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
