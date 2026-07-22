import "./globals.css";
import { ReactNode } from "react";
import { Metadata } from "next";
import { Providers } from "@/components/custom/providers";
import { panelSans, panelMono, panelSansMono, roboto } from "./fonts";

export const metadata: Metadata = {
  title: "Jiko Admin Auth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      className={`${panelSans.variable} ${panelMono.variable} ${panelSansMono.variable} ${roboto.variable} dark`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
