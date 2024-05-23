import { ReactNode } from "react";
import { EditorProviders } from "@/app/editorProviders";

export const metadata = {
  title: "Editor",
  description: "Dexla Editor",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <EditorProviders>{children}</EditorProviders>;
}
