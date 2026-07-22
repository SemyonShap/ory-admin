import "./globals.css"
import { ReactNode } from "react"
import { Metadata } from "next"
import { Providers } from "@/components/custom/providers"
import { panelSans, panelMono, panelSansMono, roboto } from "./fonts"
import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Jiko Admin Auth",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      className={cn(
        "dark",
        panelSans.variable,
        panelMono.variable,
        panelSansMono.variable,
        roboto.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
