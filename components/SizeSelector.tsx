import {
  Box,
  MantineSize,
  Select,
  SelectItem,
  SelectProps,
  Text,
} from "@mantine/core";
import { useMemo } from "react";

interface CustomSelectItemProps {
  label: string;
  description: string;
}

const fullLabels: Record<MantineSize, string> = {
  xxs: "Extra Extra Small",
  xs: "Extra Small",
  sm: "Small",
  md: "Medium",
  lg: "Large",
  xl: "Extra Large",
};

const defaultFullLabels: Record<MantineSize, string> = {
  xs: fullLabels.xs,
  sm: fullLabels.sm,
  md: fullLabels.md,
  lg: fullLabels.lg,
  xl: fullLabels.xl,
};

const CustomSelectItem: React.FC<CustomSelectItemProps> = ({
  label,
  description,
  ...others
}) => (
  <Box {...others}>
    <Text>{label}</Text>
    <Text size="xs" color="#ddd">
      {description}
    </Text>
  </Box>
);

type Props = {
  showNone?: boolean;
  showFullscreen?: boolean;
  data?: Array<{ label: string; value: string }>;
  sizing?: Record<MantineSize, string | undefined>;
  showFullLabel?: boolean;
} & Omit<SelectProps, "data">;

export const SizeSelector = ({
  showNone = true,
  showFullscreen = false,
  label = "Size",
  sizing,
  showFullLabel,
  ...props
}: Props) => {
  const defaultData = useMemo(() => {
    let newData: SelectItem[] = [];

    if (sizing) {
      newData = Object.entries(sizing).map(([size, description]) => ({
        label: showFullLabel
          ? fullLabels[size] || size
          : size.charAt(0).toUpperCase() + size.slice(1),
        value: size,
        description: description,
      }));
    } else {
      newData = Object.keys(defaultFullLabels).map((size) => ({
        label: showFullLabel
          ? fullLabels[size]
          : size.charAt(0).toUpperCase() + size.slice(1),
        value: size,
        description: showFullLabel
          ? undefined
          : size.charAt(0).toUpperCase() + size.slice(1),
      }));
    }

    if (showFullscreen) {
      newData.push({
        label: "Fullscreen",
        value: "fullscreen",
      });
    }

    if (showNone) {
      newData.unshift({
        label: "None",
        value: "0",
        description: "0px",
      });
    }

    return newData;
  }, [sizing, showFullscreen, showNone, showFullLabel]);

  return (
    <Select
      label={label}
      size="xs"
      {...props}
      data={defaultData}
      itemComponent={CustomSelectItem}
    />
  );
};
