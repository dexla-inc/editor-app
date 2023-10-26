import { DashboardShell } from "@/components/DashboardShell";
import TeamSettings from "@/components/settings/TeamSettings";
import { useRouter } from "next/router";

export default function Team() {
  const router = useRouter();
  const { id, name } = router.query as { id: string; name: string };

  return (
    <DashboardShell>
      <TeamSettings projectId={id} />
    </DashboardShell>
  );
}
