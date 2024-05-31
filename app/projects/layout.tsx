import { ReactNode } from "react";
import { EditorProviders } from "@/app/editorProviders";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Dexla - Build apps fast on Next.js",
  description:
    "Dexla is a low-code platform that allows you to build apps fast on Next.js. Create a new project, start from scratch or use a template.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function Layout({ children }: { children: ReactNode }) {
  return <EditorProviders>{children}</EditorProviders>;
}
