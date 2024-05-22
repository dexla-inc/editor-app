import InitialisePropelAuth from "@/components/InitialisePropelAuth";
import { ReactNode } from "react";
import { EditorProviders } from "@/app/editorProviders";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <InitialisePropelAuth>
      <EditorProviders>{children}</EditorProviders>
    </InitialisePropelAuth>
  );
}
