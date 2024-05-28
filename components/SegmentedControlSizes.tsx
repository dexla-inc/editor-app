import { TopLabel } from "@/components/TopLabel";
import {
  MantineSize,
  SegmentedControl,
  SegmentedControlProps,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core";
import { useMemo } from "react";

interface Props extends Omit<SegmentedControlProps, "data"> {
  label: string;
  sizing: Record<MantineSize, string | undefined>;
  includeZero?: boolean;
  includeFull?: boolean;
}

function formatSizing(sizing: Record<MantineSize, string | undefined>) {
  return Object.entries(sizing)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => ({
      label: key.toUpperCase(),
      value: key,
      tooltip: value,
    }));
}

export const SegmentedControlSizes = ({
  label,
  sizing,
  includeZero,
  includeFull,
  ...props
}: Props) => {
  const segmentsData = useMemo(() => {
    const data = formatSizing(sizing);

    if (includeZero) {
      data.unshift({ label: "-", value: "0", tooltip: "0px" });
      data.push({
        label: "FS",
        value: "fullScreen",
        tooltip: "Full Screen",
      });
    }

    return data;
  }, [sizing, includeZero]);

  type SegmentProps = (typeof segmentsData)[number];

  const renderSegment = ({ label, tooltip }: SegmentProps) => (
    <Tooltip label={tooltip} withinPortal>
      <Text>{label}</Text>
    </Tooltip>
  );

  return (
    <Stack spacing={2}>
      <TopLabel text={label} />
      <SegmentedControl
        {...props}
        data={segmentsData.map(({ label, value, tooltip }) => ({
          label: renderSegment({ label, value, tooltip }),
          value,
        }))}
      />
    </Stack>
  );
};
