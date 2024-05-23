import { ReactNode } from "react";

export const metadata = {
  title: "Editor",
  description: "Dexla Editor",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return { children };
}
