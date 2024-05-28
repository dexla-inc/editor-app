import { ReactNode } from "react";
import { EditorProviders } from "@/app/editorProviders";
import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Editor",
  description: "Dexla Editor",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <EditorProviders>{children}</EditorProviders>;
}
