import "./globals.css"
import { ReactNode } from "react"
import { Metadata } from "next"
import { Inter } from "next/font/google"

import { cn } from "@/lib/utils"
import { Providers } from "@/components/common/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Ory Admin",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html className={cn("dark", inter.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
