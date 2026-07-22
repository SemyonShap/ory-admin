"use client";

import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/custom/sidebar";
import { AdminNavbar } from "@/components/custom/navbar";
import { DialogRenderer } from "@/components/custom/dialogRenderer";
import { Toaster } from "sonner";

export function Providers({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="w-full flex min-h-screen">
          <AdminSidebar />
          <main className="w-full flex flex-col">
            <AdminNavbar />
            <div className="w-full flex-1 p-2">{children}</div>
          </main>
        </div>
        <DialogRenderer />
        <Toaster theme="dark" />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
