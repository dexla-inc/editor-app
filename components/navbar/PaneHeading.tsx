import { DataSourceTypes } from "@/requests/datasources/types";
import { Stack } from "@mantine/core";

type PaneHeadingProps = {
  text: string;
  dataSourceType: DataSourceTypes;
  showBackButton: true;
  onBack: () => void;
  onClose: () => void;
};

export default function PaneHeading({
  text,
  dataSourceType,
  showBackButton,
  onBack,
  onClose,
}: PaneHeadingProps) {
  return <Stack></Stack>;
}
