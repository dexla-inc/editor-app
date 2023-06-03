import { Shell } from "@/components/AppShell";
import { Editor } from "@/components/Editor";
import { PageHeader } from "@/components/PageHeader";

export default function Home() {
  return (
    <Shell>
      <PageHeader />
      <Editor />
    </Shell>
  );
}
