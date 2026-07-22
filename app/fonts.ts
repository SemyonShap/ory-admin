import localFont from "next/font/local";
import { Inter } from "next/font/google"; 

export const panelSans = localFont({
  src: [
    {
      path: "./fonts/panel-sans_400_normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/panel-sans_400_italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/panel-sans_500_normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/panel-sans_500_italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/panel-sans_700_normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/panel-sans_700_italic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/panel-sans_900_normal.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/panel-sans_900_italic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-panel-sans",
});

export const panelMono = localFont({
  src: [
    {
      path: "./fonts/panel-mono_500_normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/panel-mono_500_italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/panel-mono_900_normal.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/panel-mono_900_italic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-panel-mono",
});

export const panelSansMono = localFont({
  src: [
    {
      path: "./fonts/panel-sans-mono_500_normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/panel-sans-mono_500_italic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/panel-sans-mono_700_normal.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/panel-sans-mono_700_italic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/panel-sans-mono_900_normal.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/panel-sans-mono_900_italic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-panel-sans-mono",
});

export const roboto = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
});