import TeamSettings from "@/components/settings/TeamSettings";
import { PageProps } from "@/types/app";

export default function Team({ params: { id } }: PageProps) {
  return <TeamSettings projectId={id} />;
}
